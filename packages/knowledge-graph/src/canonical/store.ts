import type {
  CanonicalEntity,
  CanonicalRelationship,
  DuplicateCandidate,
  EvidenceRecord,
  MergeProposal,
} from "./types.js";
import { aliasesOverlap } from "./identity.js";

export interface CanonicalKnowledgeStore {
  insertEntity(entity: CanonicalEntity): void;
  updateEntity(entity: CanonicalEntity): void;
  getEntity(id: string): CanonicalEntity | undefined;
  listEntitiesByTenant(tenantId: string): CanonicalEntity[];
  findEntitiesByIdentityKey(
    tenantId: string,
    identityKey: string,
  ): CanonicalEntity[];
  findEntityByAlias(
    tenantId: string,
    normalisedAlias: string,
  ): CanonicalEntity | undefined;

  insertRelationship(rel: CanonicalRelationship): void;
  updateRelationship(rel: CanonicalRelationship): void;
  getRelationship(id: string): CanonicalRelationship | undefined;
  listRelationshipsByTenant(tenantId: string): CanonicalRelationship[];
  listRelationshipsForEntity(
    tenantId: string,
    entityId: string,
  ): CanonicalRelationship[];

  insertEvidence(record: EvidenceRecord): void;
  getEvidence(id: string): EvidenceRecord | undefined;
  listEvidenceByIds(ids: string[]): EvidenceRecord[];

  insertMergeProposal(proposal: MergeProposal): void;
  updateMergeProposal(proposal: MergeProposal): void;
  getMergeProposal(id: string): MergeProposal | undefined;
  listMergeProposals(tenantId: string): MergeProposal[];

  hasIdempotencyKey(tenantId: string, key: string): boolean;
  rememberIdempotencyKey(tenantId: string, key: string, resultId: string): void;
  getIdempotencyResult(
    tenantId: string,
    key: string,
  ): string | undefined;
}

export class InMemoryCanonicalKnowledgeStore implements CanonicalKnowledgeStore {
  private readonly entities = new Map<string, CanonicalEntity>();
  private readonly relationships = new Map<string, CanonicalRelationship>();
  private readonly evidence = new Map<string, EvidenceRecord>();
  private readonly mergeProposals = new Map<string, MergeProposal>();
  private readonly idempotency = new Map<string, string>();

  insertEntity(entity: CanonicalEntity): void {
    if (this.entities.has(entity.id)) {
      throw new Error(`Canonical entity exists: ${entity.id}`);
    }
    this.entities.set(entity.id, structuredClone(entity));
  }

  updateEntity(entity: CanonicalEntity): void {
    if (!this.entities.has(entity.id)) {
      throw new Error(`Canonical entity missing: ${entity.id}`);
    }
    this.entities.set(entity.id, structuredClone(entity));
  }

  getEntity(id: string): CanonicalEntity | undefined {
    const row = this.entities.get(id);
    return row ? structuredClone(row) : undefined;
  }

  listEntitiesByTenant(tenantId: string): CanonicalEntity[] {
    return [...this.entities.values()]
      .filter((item) => item.tenantId === tenantId)
      .map((item) => structuredClone(item));
  }

  findEntitiesByIdentityKey(
    tenantId: string,
    identityKey: string,
  ): CanonicalEntity[] {
    return this.listEntitiesByTenant(tenantId).filter((item) =>
      item.identityKeys.includes(identityKey),
    );
  }

  findEntityByAlias(
    tenantId: string,
    normalisedAlias: string,
  ): CanonicalEntity | undefined {
    return this.listEntitiesByTenant(tenantId).find((item) =>
      item.aliases.some((alias) => alias.normalisedValue === normalisedAlias),
    );
  }

  insertRelationship(rel: CanonicalRelationship): void {
    if (this.relationships.has(rel.id)) {
      throw new Error(`Canonical relationship exists: ${rel.id}`);
    }
    this.relationships.set(rel.id, structuredClone(rel));
  }

  updateRelationship(rel: CanonicalRelationship): void {
    if (!this.relationships.has(rel.id)) {
      throw new Error(`Canonical relationship missing: ${rel.id}`);
    }
    this.relationships.set(rel.id, structuredClone(rel));
  }

  getRelationship(id: string): CanonicalRelationship | undefined {
    const row = this.relationships.get(id);
    return row ? structuredClone(row) : undefined;
  }

  listRelationshipsByTenant(tenantId: string): CanonicalRelationship[] {
    return [...this.relationships.values()]
      .filter((item) => item.tenantId === tenantId)
      .map((item) => structuredClone(item));
  }

  listRelationshipsForEntity(
    tenantId: string,
    entityId: string,
  ): CanonicalRelationship[] {
    return this.listRelationshipsByTenant(tenantId).filter(
      (item) => item.from === entityId || item.to === entityId,
    );
  }

  insertEvidence(record: EvidenceRecord): void {
    if (this.evidence.has(record.id)) {
      // Idempotent evidence insert by id.
      return;
    }
    this.evidence.set(record.id, structuredClone(record));
  }

  getEvidence(id: string): EvidenceRecord | undefined {
    const row = this.evidence.get(id);
    return row ? structuredClone(row) : undefined;
  }

  listEvidenceByIds(ids: string[]): EvidenceRecord[] {
    return ids
      .map((id) => this.getEvidence(id))
      .filter((item): item is EvidenceRecord => item !== undefined);
  }

  insertMergeProposal(proposal: MergeProposal): void {
    if (this.mergeProposals.has(proposal.id)) {
      throw new Error(`Merge proposal exists: ${proposal.id}`);
    }
    this.mergeProposals.set(proposal.id, structuredClone(proposal));
  }

  updateMergeProposal(proposal: MergeProposal): void {
    if (!this.mergeProposals.has(proposal.id)) {
      throw new Error(`Merge proposal missing: ${proposal.id}`);
    }
    this.mergeProposals.set(proposal.id, structuredClone(proposal));
  }

  getMergeProposal(id: string): MergeProposal | undefined {
    const row = this.mergeProposals.get(id);
    return row ? structuredClone(row) : undefined;
  }

  listMergeProposals(tenantId: string): MergeProposal[] {
    return [...this.mergeProposals.values()]
      .filter((item) => item.tenantId === tenantId)
      .map((item) => structuredClone(item));
  }

  hasIdempotencyKey(tenantId: string, key: string): boolean {
    return this.idempotency.has(`${tenantId}::${key}`);
  }

  rememberIdempotencyKey(
    tenantId: string,
    key: string,
    resultId: string,
  ): void {
    this.idempotency.set(`${tenantId}::${key}`, resultId);
  }

  getIdempotencyResult(tenantId: string, key: string): string | undefined {
    return this.idempotency.get(`${tenantId}::${key}`);
  }
}

export function detectDuplicates(
  entities: CanonicalEntity[],
): DuplicateCandidate[] {
  const active = entities.filter(
    (item) => item.status === "canonical" || item.status === "candidate",
  );
  const candidates: DuplicateCandidate[] = [];

  for (let i = 0; i < active.length; i += 1) {
    for (let j = i + 1; j < active.length; j += 1) {
      const left = active[i]!;
      const right = active[j]!;
      if (left.type !== right.type) continue;
      if (left.owningEngine !== right.owningEngine) {
        // Cross-engine duplicates are reported but never auto-merged.
      }
      const sharedIdentityKeys = left.identityKeys.filter((key) =>
        right.identityKeys.includes(key),
      );
      const sharedAliases = aliasesOverlap(left.aliases, right.aliases);
      if (sharedIdentityKeys.length === 0 && sharedAliases.length === 0) {
        continue;
      }
      candidates.push({
        leftEntityId: left.id,
        rightEntityId: right.id,
        sharedIdentityKeys,
        sharedAliases,
        score: sharedIdentityKeys.length * 2 + sharedAliases.length,
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}

export function isValidAt(
  validFrom: string,
  validTo: string | null,
  at: string,
): boolean {
  if (at < validFrom) return false;
  if (validTo !== null && at > validTo) return false;
  return true;
}
