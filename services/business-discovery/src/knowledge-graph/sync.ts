import {
  BusinessDiscoveryEntityType,
  BusinessDiscoveryRelationshipType,
  businessEntityId,
  childEntityId,
  type InMemoryKnowledgeGraph,
} from "@seo-autopilot/knowledge-graph";
import type { BusinessProfile } from "../domain/types.js";

/**
 * Maps a canonical Business Profile into Knowledge Graph entities/relationships.
 */
export async function syncBusinessProfileToKnowledgeGraph(
  graph: InMemoryKnowledgeGraph,
  profile: BusinessProfile,
): Promise<void> {
  const businessNodeId = businessEntityId(profile.id);

  await graph.upsertEntity({
    id: businessNodeId,
    type: BusinessDiscoveryEntityType.Business,
    properties: {
      businessId: profile.id,
      version: profile.version,
      legalName: profile.identity.legalName.value,
      tradingName: profile.identity.tradingName.value,
      website: profile.identity.website.value,
      industry: profile.identity.industry.value,
      stage: profile.identity.businessStage.value,
    },
  });

  const brandId = childEntityId(profile.id, "brand", "primary");
  await graph.upsertEntity({
    id: brandId,
    type: BusinessDiscoveryEntityType.Brand,
    properties: {
      tone: profile.brand.tone.value,
      usp: profile.brand.uniqueSellingProposition.value,
      positioning: profile.brand.positioning.value,
    },
  });
  await graph.createRelationship({
    id: `${businessNodeId}->brand`,
    type: BusinessDiscoveryRelationshipType.HAS_BRAND,
    from: businessNodeId,
    to: brandId,
    properties: {},
  });

  for (const offer of profile.products) {
    const id = childEntityId(profile.id, "product", offer.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.Product,
      properties: {
        name: offer.name.value,
        category: offer.category.value,
        lifecycleStatus: offer.lifecycleStatus.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->product:${offer.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_PRODUCT,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  for (const offer of profile.services) {
    const id = childEntityId(profile.id, "service", offer.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.Service,
      properties: {
        name: offer.name.value,
        category: offer.category.value,
        lifecycleStatus: offer.lifecycleStatus.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->service:${offer.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_SERVICE,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  const audienceId = childEntityId(profile.id, "audience", "primary");
  await graph.upsertEntity({
    id: audienceId,
    type: BusinessDiscoveryEntityType.Audience,
    properties: {
      primaryAudience: profile.audience.primaryAudience.value,
    },
  });
  await graph.createRelationship({
    id: `${businessNodeId}->audience`,
    type: BusinessDiscoveryRelationshipType.HAS_AUDIENCE,
    from: businessNodeId,
    to: audienceId,
    properties: {},
  });

  for (const goal of profile.goals) {
    const id = childEntityId(profile.id, "goal", goal.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.Goal,
      properties: {
        statement: goal.statement.value,
        progressState: goal.progressState.value,
        priority: goal.priority.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->goal:${goal.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_GOAL,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  for (const node of profile.expertise) {
    await upsertExpertiseTree(graph, profile.id, businessNodeId, node);
  }

  for (const signal of profile.trust) {
    const id = childEntityId(profile.id, "trust", signal.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.TrustSignal,
      properties: {
        kind: signal.kind.value,
        label: signal.label.value,
        verified: signal.verified.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->trust:${signal.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_TRUST_SIGNAL,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  for (const competitor of profile.competitors) {
    const id = childEntityId(profile.id, "competitor", competitor.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.CompetitorSeed,
      properties: {
        name: competitor.name.value,
        relevanceConfidence: competitor.relevanceConfidence.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->competitor:${competitor.id}`,
      type: BusinessDiscoveryRelationshipType.COMPETITOR_SEED,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  for (const question of profile.questions) {
    const id = childEntityId(profile.id, "question", question.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.CustomerQuestion,
      properties: {
        category: question.category.value,
        question: question.question.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->question:${question.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_QUESTION,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  for (const constraint of profile.constraints) {
    const id = childEntityId(profile.id, "constraint", constraint.id);
    await graph.upsertEntity({
      id,
      type: BusinessDiscoveryEntityType.Constraint,
      properties: {
        kind: constraint.kind.value,
        description: constraint.description.value,
      },
    });
    await graph.createRelationship({
      id: `${businessNodeId}->constraint:${constraint.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_CONSTRAINT,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }
}

async function upsertExpertiseTree(
  graph: InMemoryKnowledgeGraph,
  businessId: string,
  businessNodeId: string,
  node: BusinessProfile["expertise"][number],
  parentGraphId?: string,
): Promise<void> {
  const id = childEntityId(businessId, "expertise", node.id);
  await graph.upsertEntity({
    id,
    type: BusinessDiscoveryEntityType.Expertise,
    properties: { name: node.name.value },
  });

  if (parentGraphId) {
    await graph.createRelationship({
      id: `${parentGraphId}->expertise:${node.id}`,
      type: BusinessDiscoveryRelationshipType.EXPERTISE_CHILD,
      from: parentGraphId,
      to: id,
      properties: {},
    });
  } else {
    await graph.createRelationship({
      id: `${businessNodeId}->expertise:${node.id}`,
      type: BusinessDiscoveryRelationshipType.HAS_EXPERTISE,
      from: businessNodeId,
      to: id,
      properties: {},
    });
  }

  for (const child of node.children) {
    await upsertExpertiseTree(graph, businessId, businessNodeId, child, id);
  }
}
