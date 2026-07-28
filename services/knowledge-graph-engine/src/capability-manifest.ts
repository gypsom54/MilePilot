import type { CapabilityManifest } from "@seo-autopilot/engine-sdk";

export const KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST: CapabilityManifest = {
  engine: {
    id: "knowledge-graph",
    name: "Knowledge Graph Engine",
    version: "1.0.0",
  },
  capabilities: [
    "propose_canonical_entities",
    "propose_canonical_relationships",
    "manage_aliases",
    "attach_evidence",
    "detect_duplicates",
    "propose_merges",
    "confirm_or_reject_merges",
    "query_evidence_chains",
    "query_provenance_chains",
    "query_confidence_history",
    "query_version_history",
    "query_temporal_validity",
  ],
  consumes: [
    "tenant_context",
    "engine_proposals",
    "evidence_references",
  ],
  produces: [
    "canonical_entity",
    "canonical_relationship",
    "entity_alias",
    "evidence_record",
    "merge_proposal",
    "duplicate_candidate",
    "version_history",
  ],
  confidence: {
    minimum_actionable: 0.65,
  },
  risk: {
    default: "low",
  },
  approval: {
    required_for_execution: true,
  },
};
