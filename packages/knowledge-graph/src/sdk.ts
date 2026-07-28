import type { EngineResult } from "@seo-autopilot/shared";

/**
 * Knowledge Graph SDK — interfaces only (Sprint 0).
 * No graph storage, no SEO logic, no business entity rules.
 */

export type EntityId = string;
export type RelationshipId = string;

export interface GraphEntity {
  id: EntityId;
  type: string;
  properties: Record<string, unknown>;
}

export interface GraphRelationship {
  id: RelationshipId;
  type: string;
  from: EntityId;
  to: EntityId;
  properties: Record<string, unknown>;
}

export interface CreateEntityInput {
  type: string;
  properties?: Record<string, unknown>;
  id?: EntityId;
}

export interface UpdateRelationshipInput {
  id: RelationshipId;
  properties: Record<string, unknown>;
}

export interface FindRelatedTopicsInput {
  entityId: EntityId;
  limit?: number;
}

export interface FindCompetitorsInput {
  entityId: EntityId;
  limit?: number;
}

export interface FindSupportingEvidenceInput {
  entityId: EntityId;
  claim?: string;
  limit?: number;
}

export interface FindBusinessContextInput {
  entityId: EntityId;
}

/**
 * Knowledge Graph SDK contract.
 * Implementations arrive in later sprints — engines depend only on this interface.
 */
export interface KnowledgeGraphSdk {
  createEntity(
    input: CreateEntityInput,
  ): Promise<EngineResult<GraphEntity>>;

  updateRelationship(
    input: UpdateRelationshipInput,
  ): Promise<EngineResult<GraphRelationship>>;

  findRelatedTopics(
    input: FindRelatedTopicsInput,
  ): Promise<EngineResult<GraphEntity[]>>;

  findCompetitors(
    input: FindCompetitorsInput,
  ): Promise<EngineResult<GraphEntity[]>>;

  findSupportingEvidence(
    input: FindSupportingEvidenceInput,
  ): Promise<EngineResult<GraphEntity[]>>;

  findBusinessContext(
    input: FindBusinessContextInput,
  ): Promise<EngineResult<GraphEntity>>;
}

/**
 * Naming aliases matching the Sprint 0 specification language.
 */
export type CreateEntity = KnowledgeGraphSdk["createEntity"];
export type UpdateRelationship = KnowledgeGraphSdk["updateRelationship"];
export type FindRelatedTopics = KnowledgeGraphSdk["findRelatedTopics"];
export type FindCompetitors = KnowledgeGraphSdk["findCompetitors"];
export type FindSupportingEvidence = KnowledgeGraphSdk["findSupportingEvidence"];
export type FindBusinessContext = KnowledgeGraphSdk["findBusinessContext"];
