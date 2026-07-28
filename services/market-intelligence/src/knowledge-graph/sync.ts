import {
  MarketIntelligenceEntityType,
  MarketIntelligenceRelationshipType,
  marketChildEntityId,
  marketEntityId,
  type InMemoryKnowledgeGraph,
} from "@seo-autopilot/knowledge-graph";
import type { MarketProfile } from "../domain/types.js";

async function link(
  graph: InMemoryKnowledgeGraph,
  id: string,
  type: string,
  from: string,
  to: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  await graph.createRelationship({ id, type, from, to, properties });
}

/**
 * Idempotent Market Profile → Knowledge Graph synchronisation.
 * Retains provenance on entity properties.
 */
export async function syncMarketProfileToKnowledgeGraph(
  graph: InMemoryKnowledgeGraph,
  profile: MarketProfile,
): Promise<void> {
  const marketNodeId = marketEntityId(profile.id);

  await graph.upsertEntity({
    id: marketNodeId,
    type: MarketIntelligenceEntityType.Market,
    properties: {
      marketId: profile.id,
      tenantId: profile.tenantId,
      businessId: profile.businessId ?? null,
      version: profile.version,
      name: profile.definition.name,
      geographicScope: profile.definition.geographicScope,
      industryScope: profile.definition.industryScope,
      provenance: "market-intelligence",
    },
  });

  for (const source of profile.sources) {
    const id = marketChildEntityId(profile.id, "source", source.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.MarketSource,
      properties: { ...source, provenance: "market-intelligence" },
    });
    await link(
      graph,
      `${marketNodeId}->source:${source.id}`,
      MarketIntelligenceRelationshipType.HAS_SOURCE,
      marketNodeId,
      id,
    );
  }

  for (const category of profile.categories) {
    const id = marketChildEntityId(profile.id, "category", category.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.MarketCategory,
      properties: {
        name: category.name,
        status: category.status,
        evidence: category.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->category:${category.id}`,
      MarketIntelligenceRelationshipType.HAS_CATEGORY,
      marketNodeId,
      id,
    );
  }

  for (const problem of profile.problems) {
    const id = marketChildEntityId(profile.id, "problem", problem.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.CustomerProblem,
      properties: {
        statement: problem.statement,
        evidence: problem.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->problem:${problem.id}`,
      MarketIntelligenceRelationshipType.HAS_PROBLEM,
      marketNodeId,
      id,
    );
  }

  for (const outcome of profile.outcomes) {
    const id = marketChildEntityId(profile.id, "outcome", outcome.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.DesiredOutcome,
      properties: {
        statement: outcome.statement,
        evidence: outcome.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->outcome:${outcome.id}`,
      MarketIntelligenceRelationshipType.HAS_OUTCOME,
      marketNodeId,
      id,
    );
  }

  for (const signal of profile.demandSignals) {
    const id = marketChildEntityId(profile.id, "signal", signal.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.DemandSignal,
      properties: {
        text: signal.text,
        evidence: signal.evidence,
        idempotencyKey: signal.idempotencyKey,
      },
    });
    await link(
      graph,
      `${marketNodeId}->signal:${signal.id}`,
      MarketIntelligenceRelationshipType.HAS_DEMAND_SIGNAL,
      marketNodeId,
      id,
    );
  }

  for (const question of profile.questions) {
    const id = marketChildEntityId(profile.id, "question", question.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.Question,
      properties: {
        question: question.question,
        evidence: question.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->question:${question.id}`,
      MarketIntelligenceRelationshipType.HAS_QUESTION,
      marketNodeId,
      id,
    );
  }

  for (const theme of profile.demandThemes) {
    const id = marketChildEntityId(profile.id, "theme", theme.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.DemandTheme,
      properties: {
        name: theme.name,
        signalIds: theme.signalIds,
        questionIds: theme.questionIds,
        evidence: theme.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->theme:${theme.id}`,
      MarketIntelligenceRelationshipType.HAS_DEMAND_THEME,
      marketNodeId,
      id,
    );
    for (const signalId of theme.signalIds) {
      await link(
        graph,
        `${id}->signal:${signalId}`,
        MarketIntelligenceRelationshipType.CLUSTERS_SIGNAL,
        id,
        marketChildEntityId(profile.id, "signal", signalId),
      );
    }
    for (const questionId of theme.questionIds) {
      await link(
        graph,
        `${id}->question:${questionId}`,
        MarketIntelligenceRelationshipType.RELATES_TO_QUESTION,
        id,
        marketChildEntityId(profile.id, "question", questionId),
      );
    }
  }

  for (const org of profile.organisations) {
    const id = marketChildEntityId(profile.id, "org", org.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.Organisation,
      properties: { ...org },
    });
    await link(
      graph,
      `${marketNodeId}->org:${org.id}`,
      MarketIntelligenceRelationshipType.HAS_ORGANISATION,
      marketNodeId,
      id,
    );
  }

  for (const product of profile.products) {
    const id = marketChildEntityId(profile.id, "product", product.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.Product,
      properties: { ...product },
    });
    await link(
      graph,
      `org:${product.organisationId}->product:${product.id}`,
      MarketIntelligenceRelationshipType.OFFERS_PRODUCT,
      marketChildEntityId(profile.id, "org", product.organisationId),
      id,
    );
  }

  for (const service of profile.services) {
    const id = marketChildEntityId(profile.id, "service", service.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.Service,
      properties: { ...service },
    });
    await link(
      graph,
      `org:${service.organisationId}->service:${service.id}`,
      MarketIntelligenceRelationshipType.OFFERS_SERVICE,
      marketChildEntityId(profile.id, "org", service.organisationId),
      id,
    );
  }

  for (const location of profile.locations) {
    const id = marketChildEntityId(profile.id, "location", location.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.Location,
      properties: { ...location },
    });
    await link(
      graph,
      `${marketNodeId}->location:${location.id}`,
      MarketIntelligenceRelationshipType.HAS_LOCATION,
      marketNodeId,
      id,
    );
  }

  for (const competitor of profile.competitors) {
    const id = marketChildEntityId(profile.id, "competitor", competitor.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.CompetitorCandidate,
      properties: {
        name: competitor.name,
        status: competitor.status,
        evidence: competitor.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->competitor:${competitor.id}`,
      MarketIntelligenceRelationshipType.HAS_COMPETITOR_CANDIDATE,
      marketNodeId,
      id,
    );
    if (competitor.organisationId) {
      await link(
        graph,
        `${id}->org:${competitor.organisationId}`,
        MarketIntelligenceRelationshipType.REFERS_TO_ORGANISATION,
        id,
        marketChildEntityId(profile.id, "org", competitor.organisationId),
      );
    }
  }

  for (const offer of profile.offers) {
    const id = marketChildEntityId(profile.id, "offer", offer.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.OfferObservation,
      properties: {
        summary: offer.summary,
        priceObservation: offer.priceObservation ?? null,
        evidence: offer.evidence,
        idempotencyKey: offer.idempotencyKey,
      },
    });
    await link(
      graph,
      `${marketNodeId}->offer:${offer.id}`,
      MarketIntelligenceRelationshipType.HAS_OFFER_OBSERVATION,
      marketNodeId,
      id,
    );
    if (offer.productId) {
      await link(
        graph,
        `${id}->product:${offer.productId}`,
        MarketIntelligenceRelationshipType.OBSERVES_PRODUCT,
        id,
        marketChildEntityId(profile.id, "product", offer.productId),
      );
    }
    if (offer.serviceId) {
      await link(
        graph,
        `${id}->service:${offer.serviceId}`,
        MarketIntelligenceRelationshipType.OBSERVES_SERVICE,
        id,
        marketChildEntityId(profile.id, "service", offer.serviceId),
      );
    }
    if (offer.locationId) {
      await link(
        graph,
        `${id}->location:${offer.locationId}`,
        MarketIntelligenceRelationshipType.AT_LOCATION,
        id,
        marketChildEntityId(profile.id, "location", offer.locationId),
      );
    }
  }

  for (const gap of profile.gaps) {
    const id = marketChildEntityId(profile.id, "gap", gap.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.MarketGap,
      properties: {
        statement: gap.statement,
        status: gap.status,
        supportingEvidenceIds: gap.supportingEvidenceIds,
        evidence: gap.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->gap:${gap.id}`,
      MarketIntelligenceRelationshipType.HAS_GAP,
      marketNodeId,
      id,
    );
    for (const sourceId of gap.supportingEvidenceIds) {
      await link(
        graph,
        `${id}->source:${sourceId}`,
        MarketIntelligenceRelationshipType.SUPPORTED_BY_SOURCE,
        id,
        marketChildEntityId(profile.id, "source", sourceId),
      );
    }
  }

  for (const trend of profile.trends) {
    const id = marketChildEntityId(profile.id, "trend", trend.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.Trend,
      properties: {
        name: trend.name,
        direction: trend.direction,
        observations: trend.observations,
        evidence: trend.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->trend:${trend.id}`,
      MarketIntelligenceRelationshipType.HAS_TREND,
      marketNodeId,
      id,
    );
  }

  for (const pattern of profile.seasonality) {
    const id = marketChildEntityId(profile.id, "seasonality", pattern.id);
    await graph.upsertEntity({
      id,
      type: MarketIntelligenceEntityType.SeasonalityPattern,
      properties: {
        name: pattern.name,
        pattern: pattern.pattern,
        observations: pattern.observations,
        evidence: pattern.evidence,
      },
    });
    await link(
      graph,
      `${marketNodeId}->seasonality:${pattern.id}`,
      MarketIntelligenceRelationshipType.HAS_SEASONALITY,
      marketNodeId,
      id,
    );
  }
}
