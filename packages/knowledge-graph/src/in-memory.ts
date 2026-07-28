import { randomUUID } from "node:crypto";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type {
  CreateEntityInput,
  FindBusinessContextInput,
  FindCompetitorsInput,
  FindRelatedTopicsInput,
  FindSupportingEvidenceInput,
  GraphEntity,
  GraphRelationship,
  KnowledgeGraphSdk,
  UpdateRelationshipInput,
} from "./sdk.js";

/**
 * Sprint 1 in-memory Knowledge Graph.
 * Sufficient for Business Discovery entity persistence and lookups.
 */
export class InMemoryKnowledgeGraph implements KnowledgeGraphSdk {
  private readonly entities = new Map<string, GraphEntity>();
  private readonly relationships = new Map<string, GraphRelationship>();

  async createEntity(
    input: CreateEntityInput,
  ): Promise<EngineResult<GraphEntity>> {
    const id = input.id ?? randomUUID();
    if (this.entities.has(id)) {
      return err({
        code: "ENTITY_EXISTS",
        message: `Entity already exists: ${id}`,
        retryable: false,
      });
    }
    const entity: GraphEntity = {
      id,
      type: input.type,
      properties: input.properties ?? {},
    };
    this.entities.set(id, entity);
    return ok(entity);
  }

  async upsertEntity(entity: GraphEntity): Promise<EngineResult<GraphEntity>> {
    this.entities.set(entity.id, entity);
    return ok(entity);
  }

  async getEntity(id: string): Promise<GraphEntity | undefined> {
    return this.entities.get(id);
  }

  async createRelationship(
    relationship: Omit<GraphRelationship, "id"> & { id?: string },
  ): Promise<EngineResult<GraphRelationship>> {
    const id = relationship.id ?? randomUUID();
    const row: GraphRelationship = {
      id,
      type: relationship.type,
      from: relationship.from,
      to: relationship.to,
      properties: relationship.properties,
    };
    // Idempotent upsert when callers supply a stable relationship id.
    this.relationships.set(id, row);
    return ok(row);
  }

  async updateRelationship(
    input: UpdateRelationshipInput,
  ): Promise<EngineResult<GraphRelationship>> {
    const existing = this.relationships.get(input.id);
    if (!existing) {
      return err({
        code: "RELATIONSHIP_NOT_FOUND",
        message: `Relationship not found: ${input.id}`,
        retryable: false,
      });
    }
    const updated: GraphRelationship = {
      ...existing,
      properties: { ...existing.properties, ...input.properties },
    };
    this.relationships.set(input.id, updated);
    return ok(updated);
  }

  async findRelatedTopics(
    input: FindRelatedTopicsInput,
  ): Promise<EngineResult<GraphEntity[]>> {
    const relatedIds = [...this.relationships.values()]
      .filter(
        (rel) =>
          (rel.from === input.entityId || rel.to === input.entityId) &&
          (rel.type === "RELATED_TOPIC" || rel.type === "HAS_EXPERTISE"),
      )
      .map((rel) => (rel.from === input.entityId ? rel.to : rel.from));

    const entities = relatedIds
      .map((id) => this.entities.get(id))
      .filter((entity): entity is GraphEntity => entity !== undefined)
      .slice(0, input.limit ?? 50);

    return ok(entities);
  }

  async findCompetitors(
    input: FindCompetitorsInput,
  ): Promise<EngineResult<GraphEntity[]>> {
    const competitorIds = [...this.relationships.values()]
      .filter(
        (rel) =>
          rel.from === input.entityId && rel.type === "COMPETITOR_SEED",
      )
      .map((rel) => rel.to);

    const entities = competitorIds
      .map((id) => this.entities.get(id))
      .filter((entity): entity is GraphEntity => entity !== undefined)
      .slice(0, input.limit ?? 50);

    return ok(entities);
  }

  async findSupportingEvidence(
    input: FindSupportingEvidenceInput,
  ): Promise<EngineResult<GraphEntity[]>> {
    const evidenceIds = [...this.relationships.values()]
      .filter(
        (rel) =>
          rel.from === input.entityId && rel.type === "HAS_TRUST_SIGNAL",
      )
      .map((rel) => rel.to);

    const entities = evidenceIds
      .map((id) => this.entities.get(id))
      .filter((entity): entity is GraphEntity => entity !== undefined)
      .slice(0, input.limit ?? 50);

    return ok(entities);
  }

  async findBusinessContext(
    input: FindBusinessContextInput,
  ): Promise<EngineResult<GraphEntity>> {
    const entity = this.entities.get(input.entityId);
    if (!entity || entity.type !== "Business") {
      return err({
        code: "BUSINESS_NOT_FOUND",
        message: `Business entity not found: ${input.entityId}`,
        retryable: false,
      });
    }
    return ok(entity);
  }
}
