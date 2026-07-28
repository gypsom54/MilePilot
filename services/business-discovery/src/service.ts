import { randomUUID } from "node:crypto";
import type { EventBus } from "@seo-autopilot/shared";
import {
  createProvenancedValue,
  err,
  ok,
  updateProvenancedValue,
  type EngineResult,
} from "@seo-autopilot/shared";
import { createBusinessProfileFromInput } from "./domain/factory.js";
import type {
  BusinessProfile,
  CreateBusinessInput,
  GoalEntity,
  OfferEntity,
  QuestionCategory,
} from "./domain/types.js";
import { proposeEnrichments } from "./enrichment/suggest.js";
import { PlatformEventName, publishBusinessEvent } from "./events/publish.js";
import type { BusinessProfileRepository } from "./repository/business-profile-repository.js";
import {
  validateCreateBusinessInput,
  validateNonEmptyName,
} from "./validation/validate.js";

export class BusinessDiscoveryService {
  constructor(
    private readonly repository: BusinessProfileRepository,
    private readonly events: EventBus,
  ) {}

  async createBusiness(
    rawInput: unknown,
  ): Promise<EngineResult<BusinessProfile>> {
    const validated = validateCreateBusinessInput(rawInput);
    if (!validated.ok) {
      return validated;
    }

    const profile = createBusinessProfileFromInput(validated.value);
    profile.pendingEnrichments = proposeEnrichments(profile);

    const saved = await this.repository.saveNew(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(this.events, PlatformEventName.BusinessCreated, {
      businessId: saved.value.id,
      version: saved.value.version,
    });

    if (saved.value.identity.website.value) {
      await publishBusinessEvent(
        this.events,
        PlatformEventName.WebsiteConnected,
        {
          businessId: saved.value.id,
          website: saved.value.identity.website.value,
        },
      );
    }

    return saved;
  }

  getBusiness(id: string): EngineResult<BusinessProfile> {
    return this.repository.get(id);
  }

  listBusinesses(): BusinessProfile[] {
    return this.repository.list();
  }

  listVersions(businessId: string): EngineResult<number[]> {
    const existing = this.repository.get(businessId);
    if (!existing.ok) {
      return existing;
    }
    return ok(this.repository.listVersions(businessId));
  }

  async updateBrand(
    businessId: string,
    patch: Partial<{
      tone: string;
      uniqueSellingProposition: string;
      positioning: string;
      writingStyle: string;
    }>,
  ): Promise<EngineResult<BusinessProfile>> {
    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    if (patch.tone !== undefined) {
      profile.brand.tone = updateProvenancedValue(
        profile.brand.tone,
        patch.tone,
        "user",
      );
    }
    if (patch.uniqueSellingProposition !== undefined) {
      profile.brand.uniqueSellingProposition = updateProvenancedValue(
        profile.brand.uniqueSellingProposition,
        patch.uniqueSellingProposition,
        "user",
      );
    }
    if (patch.positioning !== undefined) {
      profile.brand.positioning = updateProvenancedValue(
        profile.brand.positioning,
        patch.positioning,
        "user",
      );
    }
    if (patch.writingStyle !== undefined) {
      profile.brand.writingStyle = updateProvenancedValue(
        profile.brand.writingStyle,
        patch.writingStyle,
        "user",
      );
    }

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(
      this.events,
      PlatformEventName.BrandProfileUpdated,
      { businessId, version: saved.value.version },
    );
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async addService(
    businessId: string,
    input: { name: string; description?: string; category?: string },
  ): Promise<EngineResult<BusinessProfile>> {
    const nameResult = validateNonEmptyName(input.name, "service.name");
    if (!nameResult.ok) {
      return nameResult;
    }

    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const offer: OfferEntity = {
      id: randomUUID(),
      kind: "service",
      name: createProvenancedValue(nameResult.value),
      description: createProvenancedValue(input.description ?? ""),
      category: createProvenancedValue(input.category ?? "uncategorised"),
      relatedTopics: createProvenancedValue<string[]>([]),
      commercialPriority: createProvenancedValue(1),
      geographicAvailability: createProvenancedValue<string[]>([]),
      lifecycleStatus: createProvenancedValue("active"),
      supportingEvidence: createProvenancedValue<string[]>([]),
      associatedKnowledgeAssets: createProvenancedValue<string[]>([]),
    };

    const profile = structuredClone(current.value);
    profile.services.push(offer);

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(this.events, PlatformEventName.ServiceAdded, {
      businessId,
      serviceId: offer.id,
      name: offer.name.value,
    });
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async updateAudience(
    businessId: string,
    primaryAudience: string,
  ): Promise<EngineResult<BusinessProfile>> {
    const nameResult = validateNonEmptyName(primaryAudience, "primaryAudience");
    if (!nameResult.ok) {
      return nameResult;
    }

    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    profile.audience.primaryAudience = updateProvenancedValue(
      profile.audience.primaryAudience,
      nameResult.value,
      "user",
    );

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(
      this.events,
      PlatformEventName.AudienceChanged,
      { businessId, version: saved.value.version },
    );
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async addGoal(
    businessId: string,
    input: {
      statement: string;
      priority?: number;
      timeHorizon?: string;
      successMetric?: string;
      owner?: string;
    },
  ): Promise<EngineResult<BusinessProfile>> {
    const statement = validateNonEmptyName(input.statement, "goal.statement");
    if (!statement.ok) {
      return statement;
    }

    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const goal: GoalEntity = {
      id: randomUUID(),
      statement: createProvenancedValue(statement.value),
      priority: createProvenancedValue(input.priority ?? 1),
      timeHorizon: createProvenancedValue(input.timeHorizon ?? "quarter"),
      successMetric: createProvenancedValue(input.successMetric ?? ""),
      owner: createProvenancedValue(input.owner ?? ""),
      progressState: createProvenancedValue("not_started"),
    };

    const profile = structuredClone(current.value);
    profile.goals.push(goal);

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(this.events, PlatformEventName.GoalAdded, {
      businessId,
      goalId: goal.id,
      statement: goal.statement.value,
    });
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async completeGoal(
    businessId: string,
    goalId: string,
  ): Promise<EngineResult<BusinessProfile>> {
    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    const goal = profile.goals.find((item) => item.id === goalId);
    if (!goal) {
      return err({
        code: "GOAL_NOT_FOUND",
        message: `Goal not found: ${goalId}`,
        retryable: false,
      });
    }

    goal.progressState = updateProvenancedValue(
      goal.progressState,
      "completed",
      "user",
    );

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(this.events, PlatformEventName.GoalCompleted, {
      businessId,
      goalId,
    });
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async addCompetitorSeed(
    businessId: string,
    input: { name: string; website?: string; relevanceConfidence?: number },
  ): Promise<EngineResult<BusinessProfile>> {
    const name = validateNonEmptyName(input.name, "competitor.name");
    if (!name.ok) {
      return name;
    }

    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    const competitorId = randomUUID();
    profile.competitors.push({
      id: competitorId,
      name: createProvenancedValue(name.value),
      ...(input.website
        ? { website: createProvenancedValue(input.website) }
        : {}),
      relevanceConfidence: createProvenancedValue(
        input.relevanceConfidence ?? 0.7,
      ),
      origin: createProvenancedValue("user"),
    });

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(
      this.events,
      PlatformEventName.CompetitorSeedAdded,
      { businessId, competitorId, name: name.value },
    );
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async addConstraint(
    businessId: string,
    input: { kind: string; description: string },
  ): Promise<EngineResult<BusinessProfile>> {
    const kind = validateNonEmptyName(input.kind, "constraint.kind");
    const description = validateNonEmptyName(
      input.description,
      "constraint.description",
    );
    if (!kind.ok) {
      return kind;
    }
    if (!description.ok) {
      return description;
    }

    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    profile.constraints.push({
      id: randomUUID(),
      kind: createProvenancedValue(kind.value),
      description: createProvenancedValue(description.value),
    });

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(
      this.events,
      PlatformEventName.ConstraintUpdated,
      { businessId, version: saved.value.version },
    );
    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version },
    );
    return saved;
  }

  async addQuestion(
    businessId: string,
    input: { category: QuestionCategory; question: string },
  ): Promise<EngineResult<BusinessProfile>> {
    const question = validateNonEmptyName(input.question, "question");
    if (!question.ok) {
      return question;
    }

    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    profile.questions.push({
      id: randomUUID(),
      category: createProvenancedValue(input.category),
      question: createProvenancedValue(question.value),
    });

    return this.repository.saveVersioned(profile);
  }

  async analyseEnrichment(
    businessId: string,
  ): Promise<EngineResult<{ suggestions: BusinessProfile["pendingEnrichments"] }>> {
    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    const fresh = proposeEnrichments(profile).filter(
      (suggestion) =>
        !profile.pendingEnrichments.some(
          (existing) =>
            existing.path === suggestion.path &&
            existing.status === "pending",
        ),
    );
    profile.pendingEnrichments = [...profile.pendingEnrichments, ...fresh];
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    return ok({ suggestions: saved.value.pendingEnrichments });
  }

  async confirmEnrichment(
    businessId: string,
    suggestionId: string,
  ): Promise<EngineResult<BusinessProfile>> {
    const current = this.repository.get(businessId);
    if (!current.ok) {
      return current;
    }

    const profile = structuredClone(current.value);
    const suggestion = profile.pendingEnrichments.find(
      (item) => item.id === suggestionId,
    );
    if (!suggestion || suggestion.status !== "pending") {
      return err({
        code: "ENRICHMENT_NOT_FOUND",
        message: `Pending enrichment not found: ${suggestionId}`,
        retryable: false,
      });
    }

    if (suggestion.path === "identity.primaryDomain") {
      profile.identity.primaryDomain = updateProvenancedValue(
        profile.identity.primaryDomain,
        String(suggestion.proposedValue),
        "confirmed_enrichment",
        suggestion.confidence,
      );
    } else if (suggestion.path === "brand.uniqueSellingProposition") {
      profile.brand.uniqueSellingProposition = updateProvenancedValue(
        profile.brand.uniqueSellingProposition,
        String(suggestion.proposedValue),
        "confirmed_enrichment",
        suggestion.confidence,
      );
    } else if (suggestion.path === "expertise") {
      const proposed = suggestion.proposedValue as Array<{
        name: string;
        children: unknown[];
      }>;
      for (const node of proposed) {
        profile.expertise.push({
          id: randomUUID(),
          name: createProvenancedValue(node.name, "confirmed_enrichment"),
          children: [],
        });
      }
    } else {
      return err({
        code: "ENRICHMENT_PATH_UNSUPPORTED",
        message: `Unsupported enrichment path: ${suggestion.path}`,
        retryable: false,
      });
    }

    suggestion.status = "confirmed";

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }

    await publishBusinessEvent(
      this.events,
      PlatformEventName.BusinessUpdated,
      { businessId, version: saved.value.version, enrichmentId: suggestionId },
    );
    return saved;
  }
}

export type { CreateBusinessInput };
