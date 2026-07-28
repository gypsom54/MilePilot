export type {
  EntityId,
  RelationshipId,
  GraphEntity,
  GraphRelationship,
  CreateEntityInput,
  UpdateRelationshipInput,
  FindRelatedTopicsInput,
  FindCompetitorsInput,
  FindSupportingEvidenceInput,
  FindBusinessContextInput,
  KnowledgeGraphSdk,
  CreateEntity,
  UpdateRelationship,
  FindRelatedTopics,
  FindCompetitors,
  FindSupportingEvidence,
  FindBusinessContext,
} from "./sdk.js";

export { InMemoryKnowledgeGraph } from "./in-memory.js";

export {
  BusinessDiscoveryEntityType,
  BusinessDiscoveryRelationshipType,
  businessEntityId,
  childEntityId,
} from "./business-discovery-mappings.js";

export {
  MarketIntelligenceEntityType,
  MarketIntelligenceRelationshipType,
  marketEntityId,
  marketChildEntityId,
} from "./market-intelligence-mappings.js";

export {
  WebsiteIntelligenceEntityType,
  WebsiteIntelligenceRelationshipType,
  websiteEntityId,
  websiteChildEntityId,
} from "./website-intelligence-mappings.js";

export {
  CrawlIntelligenceEntityType,
  CrawlIntelligenceRelationshipType,
  crawlJobEntityId,
  crawlChildEntityId,
} from "./crawl-intelligence-mappings.js";

export type {
  CanonicalStatus,
  MergeProposalStatus,
  ProvenanceEntry,
  ConfidenceHistoryEntry,
  VersionSnapshot,
  EntityAlias,
  TemporalValidity,
  CanonicalEntity,
  CanonicalRelationship,
  EvidenceRecord,
  MergeProposal,
  DuplicateCandidate,
  ProposeEntityInput,
  ProposeRelationshipInput,
  AddAliasInput,
  AttachEvidenceInput,
  CreateMergeProposalInput,
} from "./canonical/types.js";

export {
  normaliseAliasValue,
  buildIdentityKey,
  collectIdentityKeys,
  aliasesOverlap,
} from "./canonical/identity.js";

export {
  type CanonicalKnowledgeStore,
  InMemoryCanonicalKnowledgeStore,
  detectDuplicates,
  isValidAt,
} from "./canonical/store.js";

export {
  type GraphQueryService,
  createGraphQueryService,
} from "./canonical/query.js";

export const KNOWLEDGE_GRAPH_PACKAGE_STATUS = "knowledge-graph-sprint5" as const;
