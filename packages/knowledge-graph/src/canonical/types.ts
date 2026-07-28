/**
 * Volume 8 — Canonical Knowledge Graph domain types.
 * Semantic memory only — no SEO / crawl / recommendation logic.
 */

export type CanonicalStatus =
  | "candidate"
  | "canonical"
  | "merged"
  | "deprecated";

export type MergeProposalStatus = "pending" | "confirmed" | "rejected";

export interface ProvenanceEntry {
  at: string;
  sourceEngine: string;
  action: string;
  correlationId?: string;
  note?: string;
  previousVersion?: number;
}

export interface ConfidenceHistoryEntry {
  at: string;
  confidence: number;
  sourceEngine: string;
  note?: string;
}

export interface VersionSnapshot {
  version: number;
  recordedAt: string;
  status: CanonicalStatus;
  properties: Record<string, unknown>;
  evidenceIds: string[];
  confidence: number;
  validFrom: string;
  validTo: string | null;
  immutable: true;
}

export interface EntityAlias {
  value: string;
  kind: string;
  normalisedValue: string;
  sourceEngine: string;
  observedAt: string;
}

export interface TemporalValidity {
  validFrom: string;
  validTo: string | null;
}

export interface CanonicalEntity {
  id: string;
  tenantId: string;
  type: string;
  status: CanonicalStatus;
  aliases: EntityAlias[];
  identityKeys: string[];
  properties: Record<string, unknown>;
  evidenceIds: string[];
  provenance: ProvenanceEntry[];
  confidence: number;
  confidenceHistory: ConfidenceHistoryEntry[];
  version: number;
  versionHistory: VersionSnapshot[];
  validFrom: string;
  validTo: string | null;
  owningEngine: string;
  mergedIntoId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CanonicalRelationship {
  id: string;
  tenantId: string;
  type: string;
  from: string;
  to: string;
  status: CanonicalStatus;
  properties: Record<string, unknown>;
  evidenceIds: string[];
  provenance: ProvenanceEntry[];
  confidence: number;
  confidenceHistory: ConfidenceHistoryEntry[];
  version: number;
  versionHistory: VersionSnapshot[];
  validFrom: string;
  validTo: string | null;
  owningEngine: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRecord {
  id: string;
  tenantId: string;
  kind: string;
  sourceEngine: string;
  referenceIds: string[];
  summary: string;
  recordedAt: string;
  payload: Record<string, unknown>;
}

export interface MergeProposal {
  id: string;
  tenantId: string;
  sourceEntityId: string;
  targetEntityId: string;
  reason: string;
  status: MergeProposalStatus;
  proposedBy: string;
  proposedAt: string;
  resolvedAt?: string;
  correlationId?: string;
}

export interface DuplicateCandidate {
  leftEntityId: string;
  rightEntityId: string;
  sharedIdentityKeys: string[];
  sharedAliases: string[];
  score: number;
}

export interface ProposeEntityInput {
  tenantId: string;
  type: string;
  proposingEngine: string;
  properties?: Record<string, unknown>;
  aliases?: Array<{ value: string; kind: string }>;
  identityFields?: string[];
  evidenceIds: string[];
  confidence?: number;
  validFrom?: string;
  validTo?: string | null;
  idempotencyKey?: string;
  correlationId?: string;
  /** Optional stable id — immutable once created */
  id?: string;
  status?: "candidate" | "canonical";
}

export interface ProposeRelationshipInput {
  tenantId: string;
  type: string;
  from: string;
  to: string;
  proposingEngine: string;
  properties?: Record<string, unknown>;
  evidenceIds: string[];
  confidence?: number;
  validFrom?: string;
  validTo?: string | null;
  idempotencyKey?: string;
  correlationId?: string;
  id?: string;
}

export interface AddAliasInput {
  tenantId: string;
  entityId: string;
  value: string;
  kind: string;
  sourceEngine: string;
  observedAt?: string;
  correlationId?: string;
}

export interface AttachEvidenceInput {
  tenantId: string;
  entityId?: string;
  relationshipId?: string;
  evidence: Omit<EvidenceRecord, "id" | "tenantId" | "recordedAt"> & {
    id?: string;
    recordedAt?: string;
  };
  correlationId?: string;
}

export interface CreateMergeProposalInput {
  tenantId: string;
  sourceEntityId: string;
  targetEntityId: string;
  reason: string;
  proposedBy: string;
  correlationId?: string;
}
