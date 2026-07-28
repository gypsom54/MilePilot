import { randomUUID } from "node:crypto";
import type { EventBus } from "@seo-autopilot/shared";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import {
  buildIdempotencyKey,
  computeFreshness,
  createEvidenceMeta,
} from "./domain/evidence.js";
import type {
  CreateMarketInput,
  GeographicScope,
  MarketProfile,
  SourceKind,
} from "./domain/types.js";
import { PlatformEventName, publishMarketEvent } from "./events/publish.js";
import type { MarketProfileRepository } from "./repository/market-profile-repository.js";
import {
  validateCreateMarketInput,
  validateEvidenceInput,
  validateGapEvidence,
  validateNonEmpty,
  validateTrendObservations,
} from "./validation/validate.js";

type EvidenceInput = {
  sourceId: string;
  observedAt: string;
  scope: GeographicScope;
  provenance?: string;
  confidence: number;
  limitations?: string[];
  expiresAt?: string;
};

function buildEvidence(
  validated: {
    sourceId: string;
    observedAt: string;
    scope: GeographicScope;
    confidence: number;
  },
  input: Pick<EvidenceInput, "provenance" | "limitations" | "expiresAt">,
  defaultProvenance: string,
  extraLimitations: string[] = [],
) {
  return createEvidenceMeta({
    ...validated,
    provenance: input.provenance ?? defaultProvenance,
    ...(input.limitations !== undefined || extraLimitations.length > 0
      ? {
          limitations: [
            ...(input.limitations ?? []),
            ...extraLimitations,
          ],
        }
      : {}),
    ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt } : {}),
  });
}

export class MarketIntelligenceService {
  constructor(
    private readonly repository: MarketProfileRepository,
    private readonly events: EventBus,
  ) {}

  async defineMarket(
    rawInput: unknown,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const validated = validateCreateMarketInput(rawInput);
    if (!validated.ok) {
      return validated;
    }
    const input: CreateMarketInput = validated.value;
    const now = new Date().toISOString();
    const profile: MarketProfile = {
      id: randomUUID(),
      tenantId: input.tenantId,
      ...(input.businessId !== undefined ? { businessId: input.businessId } : {}),
      version: 1,
      createdAt: now,
      updatedAt: now,
      definition: {
        name: input.name,
        description: input.description,
        industryScope: input.industryScope,
        geographicScope: input.geographicScope,
        locationLabels: input.locationLabels ?? [],
      },
      categories: [],
      problems: [],
      outcomes: [],
      demandSignals: [],
      demandThemes: [],
      questions: [],
      competitors: [],
      organisations: [],
      products: [],
      services: [],
      locations: [],
      offers: [],
      gaps: [],
      trends: [],
      seasonality: [],
      sources: [],
      importKeys: [],
    };

    const saved = await this.repository.saveNew(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketDefined,
      {
        marketId: saved.value.id,
        tenantId: saved.value.tenantId,
        geographicScope: saved.value.definition.geographicScope,
        businessId: saved.value.businessId ?? null,
      },
      correlationId,
    );
    return saved;
  }

  getMarket(marketId: string, tenantId?: string): EngineResult<MarketProfile> {
    return this.repository.get(marketId, tenantId);
  }

  listMarkets(tenantId: string): MarketProfile[] {
    return this.repository.listByTenant(tenantId);
  }

  listVersions(
    marketId: string,
    tenantId?: string,
  ): EngineResult<number[]> {
    const existing = this.repository.get(marketId, tenantId);
    if (!existing.ok) {
      return existing;
    }
    return ok(this.repository.listVersions(marketId));
  }

  /**
   * Market Intelligence never mutates Business Discovery.
   * businessId is retained as a read-only reference only.
   */
  assertBusinessDiscoveryUntouched(profile: MarketProfile): {
    businessId: string | undefined;
    mutatedBusinessDiscovery: false;
  } {
    return {
      businessId: profile.businessId,
      mutatedBusinessDiscovery: false,
    };
  }

  async updateScope(
    marketId: string,
    tenantId: string,
    patch: {
      geographicScope?: GeographicScope;
      locationLabels?: string[];
      description?: string;
      industryScope?: string;
      name?: string;
    },
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const previousBusinessId = profile.businessId;

    if (patch.geographicScope) {
      profile.definition.geographicScope = patch.geographicScope;
    }
    if (patch.locationLabels) {
      profile.definition.locationLabels = patch.locationLabels;
    }
    if (patch.description) {
      profile.definition.description = patch.description;
    }
    if (patch.industryScope) {
      profile.definition.industryScope = patch.industryScope;
    }
    if (patch.name) {
      profile.definition.name = patch.name;
    }

    // Explicit protection: never allow businessId mutation via scope updates.
    if (previousBusinessId !== undefined) {
      profile.businessId = previousBusinessId;
    } else {
      delete profile.businessId;
    }

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketScopeUpdated,
      {
        marketId,
        tenantId,
        geographicScope: saved.value.definition.geographicScope,
        businessId: saved.value.businessId ?? null,
      },
      correlationId,
    );
    return saved;
  }

  async addSource(
    marketId: string,
    tenantId: string,
    input: { label: string; kind: SourceKind; uri?: string; id?: string },
  ): Promise<EngineResult<MarketProfile>> {
    const label = validateNonEmpty(input.label, "source.label");
    if (!label.ok) {
      return label;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = input.id ?? randomUUID();
    if (!profile.sources.some((source) => source.id === id)) {
      profile.sources.push({
        id,
        label: label.value,
        kind: input.kind,
        ...(input.uri !== undefined ? { uri: input.uri } : {}),
        collectedAt: new Date().toISOString(),
      });
    }
    return this.repository.saveVersioned(profile);
  }

  async addCategoryCandidate(
    marketId: string,
    tenantId: string,
    input: { name: string; description?: string } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const name = validateNonEmpty(input.name, "category.name");
    if (!name.ok) {
      return name;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.categories.push({
      id,
      name: name.value,
      description: input.description ?? "",
      status: "candidate",
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketCategoryCandidateCreated,
      { marketId, tenantId, categoryId: id, name: name.value },
      correlationId,
    );
    return saved;
  }

  async confirmCategory(
    marketId: string,
    tenantId: string,
    categoryId: string,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const category = profile.categories.find((item) => item.id === categoryId);
    if (!category) {
      return err({
        code: "CATEGORY_NOT_FOUND",
        message: `Category not found: ${categoryId}`,
        retryable: false,
      });
    }
    category.status = "confirmed";
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketCategoryConfirmed,
      { marketId, tenantId, categoryId },
      correlationId,
    );
    return saved;
  }

  async addProblem(
    marketId: string,
    tenantId: string,
    input: { statement: string; categoryIds?: string[] } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const statement = validateNonEmpty(input.statement, "problem.statement");
    if (!statement.ok) {
      return statement;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.problems.push({
      id,
      statement: statement.value,
      categoryIds: input.categoryIds ?? [],
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.CustomerProblemObserved,
      { marketId, tenantId, problemId: id },
      correlationId,
    );
    return saved;
  }

  async addOutcome(
    marketId: string,
    tenantId: string,
    input: { statement: string; categoryIds?: string[] } & EvidenceInput,
  ): Promise<EngineResult<MarketProfile>> {
    const statement = validateNonEmpty(input.statement, "outcome.statement");
    if (!statement.ok) {
      return statement;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    profile.outcomes.push({
      id: randomUUID(),
      statement: statement.value,
      categoryIds: input.categoryIds ?? [],
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    return this.repository.saveVersioned(profile);
  }

  async observeDemandSignal(
    marketId: string,
    tenantId: string,
    input: { text: string; intensity?: number } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const text = validateNonEmpty(input.text, "demandSignal.text");
    if (!text.ok) {
      return text;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const idempotencyKey = buildIdempotencyKey([
      tenantId,
      "demand-signal",
      evidence.value.sourceId,
      evidence.value.observedAt,
      text.value,
      evidence.value.scope,
    ]);
    if (profile.importKeys.includes(idempotencyKey)) {
      return ok(profile);
    }
    const id = randomUUID();
    profile.demandSignals.push({
      id,
      text: text.value,
      ...(input.intensity !== undefined ? { intensity: input.intensity } : {}),
      evidence: buildEvidence(evidence.value, input, "import"),
      idempotencyKey,
    });
    profile.importKeys.push(idempotencyKey);
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.DemandSignalObserved,
      { marketId, tenantId, signalId: id, scope: evidence.value.scope },
      correlationId,
    );
    return saved;
  }

  async createDemandTheme(
    marketId: string,
    tenantId: string,
    input: {
      name: string;
      signalIds: string[];
      questionIds?: string[];
    } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const name = validateNonEmpty(input.name, "demandTheme.name");
    if (!name.ok) {
      return name;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.demandThemes.push({
      id,
      name: name.value,
      signalIds: input.signalIds,
      questionIds: input.questionIds ?? [],
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.DemandThemeCreated,
      { marketId, tenantId, themeId: id },
      correlationId,
    );
    return saved;
  }

  async addQuestion(
    marketId: string,
    tenantId: string,
    input: { question: string } & EvidenceInput,
  ): Promise<EngineResult<MarketProfile>> {
    const question = validateNonEmpty(input.question, "question");
    if (!question.ok) {
      return question;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    profile.questions.push({
      id: randomUUID(),
      question: question.value,
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    return this.repository.saveVersioned(profile);
  }

  async discoverCompetitor(
    marketId: string,
    tenantId: string,
    input: {
      name: string;
      website?: string;
      organisationName?: string;
    } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const name = validateNonEmpty(input.name, "competitor.name");
    if (!name.ok) {
      return name;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    let organisationId: string | undefined;
    if (input.organisationName) {
      organisationId = randomUUID();
      profile.organisations.push({
        id: organisationId,
        name: input.organisationName,
        ...(input.website !== undefined ? { website: input.website } : {}),
      });
    }
    const id = randomUUID();
    profile.competitors.push({
      id,
      name: name.value,
      ...(input.website !== undefined ? { website: input.website } : {}),
      ...(organisationId !== undefined ? { organisationId } : {}),
      status: "candidate",
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.CompetitorCandidateDiscovered,
      { marketId, tenantId, candidateId: id, name: name.value },
      correlationId,
    );
    return saved;
  }

  async confirmCompetitor(
    marketId: string,
    tenantId: string,
    candidateId: string,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const candidate = profile.competitors.find((item) => item.id === candidateId);
    if (!candidate) {
      return err({
        code: "COMPETITOR_NOT_FOUND",
        message: `Competitor candidate not found: ${candidateId}`,
        retryable: false,
      });
    }
    if (candidate.status === "dismissed") {
      return err({
        code: "COMPETITOR_DISMISSED",
        message: "Dismissed competitors remain dismissed",
        retryable: false,
      });
    }
    candidate.status = "confirmed";
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.CompetitorCandidateConfirmed,
      { marketId, tenantId, candidateId },
      correlationId,
    );
    return saved;
  }

  async dismissCompetitor(
    marketId: string,
    tenantId: string,
    candidateId: string,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const candidate = profile.competitors.find((item) => item.id === candidateId);
    if (!candidate) {
      return err({
        code: "COMPETITOR_NOT_FOUND",
        message: `Competitor candidate not found: ${candidateId}`,
        retryable: false,
      });
    }
    candidate.status = "dismissed";
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.CompetitorCandidateDismissed,
      { marketId, tenantId, candidateId },
      correlationId,
    );
    return saved;
  }

  async observeOffer(
    marketId: string,
    tenantId: string,
    input: {
      organisationId: string;
      summary: string;
      productName?: string;
      serviceName?: string;
      priceObservation?: string;
      locationLabel?: string;
      locationScope?: GeographicScope;
    } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const summary = validateNonEmpty(input.summary, "offer.summary");
    if (!summary.ok) {
      return summary;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const idempotencyKey = buildIdempotencyKey([
      tenantId,
      "offer",
      evidence.value.sourceId,
      evidence.value.observedAt,
      input.organisationId,
      summary.value,
      input.priceObservation ?? "",
      evidence.value.scope,
    ]);
    if (profile.importKeys.includes(idempotencyKey)) {
      return ok(profile);
    }

    let productId: string | undefined;
    let serviceId: string | undefined;
    let locationId: string | undefined;

    if (input.productName) {
      productId = randomUUID();
      profile.products.push({
        id: productId,
        organisationId: input.organisationId,
        name: input.productName,
      });
    }
    if (input.serviceName) {
      serviceId = randomUUID();
      profile.services.push({
        id: serviceId,
        organisationId: input.organisationId,
        name: input.serviceName,
      });
    }
    if (input.locationLabel && input.locationScope) {
      locationId = randomUUID();
      profile.locations.push({
        id: locationId,
        label: input.locationLabel,
        scope: input.locationScope,
      });
    }

    const id = randomUUID();
    profile.offers.push({
      id,
      organisationId: input.organisationId,
      ...(productId !== undefined ? { productId } : {}),
      ...(serviceId !== undefined ? { serviceId } : {}),
      summary: summary.value,
      ...(input.priceObservation !== undefined
        ? { priceObservation: input.priceObservation }
        : {}),
      ...(locationId !== undefined ? { locationId } : {}),
      evidence: buildEvidence(evidence.value, input, "import", ["Pricing and competitor offers are dated observations, not guaranteed facts"]),
      idempotencyKey,
    });
    profile.importKeys.push(idempotencyKey);

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.OfferObserved,
      { marketId, tenantId, offerId: id, scope: evidence.value.scope },
      correlationId,
    );
    return saved;
  }

  async detectGap(
    marketId: string,
    tenantId: string,
    input: {
      statement: string;
      supportingEvidenceIds: string[];
    } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const statement = validateNonEmpty(input.statement, "gap.statement");
    if (!statement.ok) {
      return statement;
    }
    const gapEvidence = validateGapEvidence(input.supportingEvidenceIds);
    if (!gapEvidence.ok) {
      return gapEvidence;
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const knownSources = new Set(profile.sources.map((source) => source.id));
    for (const sourceId of gapEvidence.value) {
      if (!knownSources.has(sourceId) && sourceId !== evidence.value.sourceId) {
        return err({
          code: "GAP_REQUIRES_EVIDENCE",
          message: `Supporting evidence source not found: ${sourceId}`,
          retryable: false,
        });
      }
    }
    const id = randomUUID();
    profile.gaps.push({
      id,
      statement: statement.value,
      supportingEvidenceIds: gapEvidence.value,
      status: "candidate",
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketGapDetected,
      { marketId, tenantId, gapId: id },
      correlationId,
    );
    return saved;
  }

  async validateGap(
    marketId: string,
    tenantId: string,
    gapId: string,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const gap = profile.gaps.find((item) => item.id === gapId);
    if (!gap) {
      return err({
        code: "GAP_NOT_FOUND",
        message: `Gap not found: ${gapId}`,
        retryable: false,
      });
    }
    if (gap.supportingEvidenceIds.length < 1) {
      return err({
        code: "GAP_REQUIRES_EVIDENCE",
        message: "Unsupported gaps are rejected",
        retryable: false,
      });
    }
    gap.status = "validated";
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketGapValidated,
      { marketId, tenantId, gapId },
      correlationId,
    );
    return saved;
  }

  async observeTrend(
    marketId: string,
    tenantId: string,
    input: {
      name: string;
      direction: string;
      observations: unknown;
    } & Omit<EvidenceInput, "observedAt"> & { observedAt?: string },
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const name = validateNonEmpty(input.name, "trend.name");
    if (!name.ok) {
      return name;
    }
    const observations = validateTrendObservations(input.observations);
    if (!observations.ok) {
      return observations;
    }
    const observedAt =
      input.observedAt ?? observations.value[observations.value.length - 1]?.observedAt;
    const evidence = validateEvidenceInput({
      sourceId: input.sourceId,
      observedAt,
      scope: input.scope,
      confidence: input.confidence,
    });
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.trends.push({
      id,
      name: name.value,
      direction: input.direction,
      observations: observations.value,
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.MarketTrendObserved,
      { marketId, tenantId, trendId: id },
      correlationId,
    );
    return saved;
  }

  async observeSeasonality(
    marketId: string,
    tenantId: string,
    input: {
      name: string;
      pattern: string;
      observations: unknown;
    } & EvidenceInput,
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const name = validateNonEmpty(input.name, "seasonality.name");
    if (!name.ok) {
      return name;
    }
    const observations = validateTrendObservations(input.observations);
    if (!observations.ok) {
      return err({
        code: "SEASONALITY_REQUIRES_MULTIPLE_OBSERVATIONS",
        message:
          "Seasonality patterns require observations from separate points in time",
        retryable: false,
      });
    }
    const evidence = validateEvidenceInput(input);
    if (!evidence.ok) {
      return evidence;
    }
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.seasonality.push({
      id,
      name: name.value,
      pattern: input.pattern,
      observations: observations.value,
      evidence: buildEvidence(evidence.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishMarketEvent(
      this.events,
      PlatformEventName.SeasonalityPatternObserved,
      { marketId, tenantId, seasonalityId: id },
      correlationId,
    );
    return saved;
  }

  async importEvidenceBatch(
    marketId: string,
    tenantId: string,
    items: Array<{ text: string } & EvidenceInput>,
    correlationId?: string,
  ): Promise<EngineResult<{ profile: MarketProfile; imported: number; skipped: number }>> {
    let imported = 0;
    let skipped = 0;
    const initial = this.repository.get(marketId, tenantId);
    if (!initial.ok) {
      return initial;
    }
    let profile = initial.value;

    for (const item of items) {
      const beforeCount = profile.demandSignals.length;
      const result = await this.observeDemandSignal(
        marketId,
        tenantId,
        item,
        correlationId,
      );
      if (!result.ok) {
        return result;
      }
      if (result.value.demandSignals.length === beforeCount) {
        skipped += 1;
      } else {
        imported += 1;
      }
      profile = result.value;
    }

    return ok({ profile, imported, skipped });
  }

  async expireEvidence(
    marketId: string,
    tenantId: string,
    nowIso = new Date().toISOString(),
    correlationId?: string,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const expiredIds: string[] = [];

    const touch = <T extends { evidence: { freshness: string; expiresAt?: string; sourceId: string } }>(
      items: T[],
    ) => {
      for (const item of items) {
        const next = computeFreshness(nowIso, item.evidence.expiresAt);
        if (next === "expired" && item.evidence.freshness !== "expired") {
          expiredIds.push(item.evidence.sourceId);
        }
        item.evidence.freshness = next;
      }
    };

    touch(profile.categories);
    touch(profile.problems);
    touch(profile.outcomes);
    touch(profile.demandSignals);
    touch(profile.demandThemes);
    touch(profile.questions);
    touch(profile.competitors);
    touch(profile.offers);
    touch(profile.gaps);
    touch(profile.trends);
    touch(profile.seasonality);

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    for (const sourceId of new Set(expiredIds)) {
      await publishMarketEvent(
        this.events,
        PlatformEventName.MarketEvidenceExpired,
        { marketId, tenantId, sourceId, at: nowIso },
        correlationId,
      );
    }
    return saved;
  }

  async completeResearch(
    marketId: string,
    tenantId: string,
    status: "completed" | "partial" | "failed",
    correlationId?: string,
    details?: Record<string, unknown>,
  ): Promise<EngineResult<MarketProfile>> {
    const current = this.repository.get(marketId, tenantId);
    if (!current.ok) {
      return current;
    }
    const eventName =
      status === "completed"
        ? PlatformEventName.MarketResearchCompleted
        : status === "partial"
          ? PlatformEventName.MarketResearchPartiallyCompleted
          : PlatformEventName.MarketResearchFailed;

    await publishMarketEvent(
      this.events,
      eventName,
      { marketId, tenantId, ...(details ?? {}) },
      correlationId,
    );
    return current;
  }
}
