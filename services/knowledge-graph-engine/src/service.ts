import { createHash, randomUUID } from "node:crypto";
import {
  collectIdentityKeys,
  createGraphQueryService,
  detectDuplicates,
  normaliseAliasValue,
  type AddAliasInput,
  type AttachEvidenceInput,
  type CanonicalEntity,
  type CanonicalKnowledgeStore,
  type CanonicalRelationship,
  type CreateMergeProposalInput,
  type DuplicateCandidate,
  type EvidenceRecord,
  type MergeProposal,
  type ProposeEntityInput,
  type ProposeRelationshipInput,
  type VersionSnapshot,
} from "@seo-autopilot/knowledge-graph";
import { err, ok, type EngineResult, type EventBus } from "@seo-autopilot/shared";
import { PlatformEventName, publishKnowledgeGraphEvent } from "./events/publish.js";

function snapshotOf(entity: {
  version: number;
  status: CanonicalEntity["status"];
  properties: Record<string, unknown>;
  evidenceIds: string[];
  confidence: number;
  validFrom: string;
  validTo: string | null;
}): VersionSnapshot {
  return {
    version: entity.version,
    recordedAt: new Date().toISOString(),
    status: entity.status,
    properties: structuredClone(entity.properties),
    evidenceIds: [...entity.evidenceIds],
    confidence: entity.confidence,
    validFrom: entity.validFrom,
    validTo: entity.validTo,
    immutable: true,
  };
}

function defaultIdempotencyKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export class KnowledgeGraphService {
  readonly queries;

  constructor(
    private readonly store: CanonicalKnowledgeStore,
    private readonly events: EventBus,
  ) {
    this.queries = createGraphQueryService({
      getEntity: (id) => this.store.getEntity(id),
      findByAlias: (tenantId, alias) =>
        this.store.findEntityByAlias(tenantId, alias),
      listRelationshipsForEntity: (tenantId, entityId) =>
        this.store.listRelationshipsForEntity(tenantId, entityId),
      listEvidenceByIds: (ids) => this.store.listEvidenceByIds(ids),
      listEntitiesByTenant: (tenantId) => this.store.listEntitiesByTenant(tenantId),
    });
  }

  private requireEvidence(
    tenantId: string,
    evidenceIds: string[],
  ): EngineResult<EvidenceRecord[]> {
    if (!evidenceIds.length) {
      return err({
        code: "EVIDENCE_REQUIRED",
        message: "Every canonical fact must reference evidence",
        retryable: false,
      });
    }
    const records = this.store.listEvidenceByIds(evidenceIds);
    if (records.length !== evidenceIds.length) {
      return err({
        code: "EVIDENCE_NOT_FOUND",
        message: "One or more evidence ids are missing — attach evidence first",
        retryable: false,
      });
    }
    if (records.some((item) => item.tenantId !== tenantId)) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Evidence is not visible to this tenant",
        retryable: false,
      });
    }
    return ok(records);
  }

  async attachEvidence(
    input: AttachEvidenceInput,
  ): Promise<EngineResult<EvidenceRecord>> {
    if (!input.tenantId || !input.evidence?.sourceEngine || !input.evidence.kind) {
      return err({
        code: "VALIDATION_FAILED",
        message: "tenantId, evidence.kind and evidence.sourceEngine are required",
        retryable: false,
      });
    }
    const now = input.evidence.recordedAt ?? new Date().toISOString();
    const record: EvidenceRecord = {
      id: input.evidence.id ?? randomUUID(),
      tenantId: input.tenantId,
      kind: input.evidence.kind,
      sourceEngine: input.evidence.sourceEngine,
      referenceIds: input.evidence.referenceIds ?? [],
      summary: input.evidence.summary ?? "",
      recordedAt: now,
      payload: input.evidence.payload ?? {},
    };
    this.store.insertEvidence(record);

    if (input.entityId) {
      const entity = this.store.getEntity(input.entityId);
      if (!entity || entity.tenantId !== input.tenantId) {
        return err({
          code: "ENTITY_NOT_FOUND",
          message: `Entity not found: ${input.entityId}`,
          retryable: false,
        });
      }
      if (!entity.evidenceIds.includes(record.id)) {
        entity.evidenceIds = [...entity.evidenceIds, record.id];
        entity.updatedAt = now;
        this.store.updateEntity(entity);
      }
    }

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeEvidenceAttached,
      {
        evidenceId: record.id,
        tenantId: record.tenantId,
        entityId: input.entityId ?? null,
        relationshipId: input.relationshipId ?? null,
      },
      input.correlationId,
    );
    return ok(record);
  }

  async proposeEntity(
    input: ProposeEntityInput,
  ): Promise<EngineResult<CanonicalEntity>> {
    if (!input.tenantId || !input.type || !input.proposingEngine) {
      return err({
        code: "VALIDATION_FAILED",
        message: "tenantId, type and proposingEngine are required",
        retryable: false,
      });
    }

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeEntityProposed,
      {
        tenantId: input.tenantId,
        type: input.type,
        proposingEngine: input.proposingEngine,
        idempotencyKey: input.idempotencyKey ?? null,
      },
      input.correlationId,
    );

    const evidenceCheck = this.requireEvidence(input.tenantId, input.evidenceIds);
    if (!evidenceCheck.ok) return evidenceCheck;

    const idempotencyKey =
      input.idempotencyKey ??
      defaultIdempotencyKey([
        input.tenantId,
        input.type,
        input.proposingEngine,
        JSON.stringify(input.properties ?? {}),
        [...input.evidenceIds].sort().join(","),
        ...(input.identityFields ?? []),
      ]);

    if (this.store.hasIdempotencyKey(input.tenantId, idempotencyKey)) {
      const existingId = this.store.getIdempotencyResult(
        input.tenantId,
        idempotencyKey,
      );
      const existing = existingId ? this.store.getEntity(existingId) : undefined;
      if (existing) return ok(existing);
    }

    if (input.id) {
      const existing = this.store.getEntity(input.id);
      if (existing) {
        if (existing.tenantId !== input.tenantId) {
          return err({
            code: "TENANT_ISOLATION_VIOLATION",
            message: "Cannot mutate an entity across tenants",
            retryable: false,
          });
        }
        if (existing.owningEngine !== input.proposingEngine) {
          return err({
            code: "CROSS_ENGINE_MUTATION_FORBIDDEN",
            message: `Engine ${input.proposingEngine} cannot mutate canonical entities owned by ${existing.owningEngine}`,
            retryable: false,
          });
        }
        return this.versionedUpdateEntity(existing, input);
      }
    }

    const now = new Date().toISOString();
    const aliases = (input.aliases ?? []).map((alias) => ({
      value: alias.value,
      kind: alias.kind,
      normalisedValue: normaliseAliasValue(alias.value),
      sourceEngine: input.proposingEngine,
      observedAt: now,
    }));
    const identityKeys = collectIdentityKeys({
      type: input.type,
      aliases,
      ...(input.identityFields !== undefined
        ? { identityFields: input.identityFields }
        : {}),
    });
    const confidence = input.confidence ?? 0.7;
    const entity: CanonicalEntity = {
      id: input.id ?? randomUUID(),
      tenantId: input.tenantId,
      type: input.type,
      status: input.status ?? "canonical",
      aliases,
      identityKeys,
      properties: input.properties ?? {},
      evidenceIds: [...input.evidenceIds],
      provenance: [
        {
          at: now,
          sourceEngine: input.proposingEngine,
          action: "create",
          ...(input.correlationId !== undefined
            ? { correlationId: input.correlationId }
            : {}),
          note: "canonical create via Knowledge Graph Engine",
        },
      ],
      confidence,
      confidenceHistory: [
        {
          at: now,
          confidence,
          sourceEngine: input.proposingEngine,
          note: "initial",
        },
      ],
      version: 1,
      versionHistory: [],
      validFrom: input.validFrom ?? now,
      validTo: input.validTo ?? null,
      owningEngine: input.proposingEngine,
      createdAt: now,
      updatedAt: now,
    };
    entity.versionHistory = [snapshotOf(entity)];

    this.store.insertEntity(entity);
    this.store.rememberIdempotencyKey(input.tenantId, idempotencyKey, entity.id);

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeEntityCreated,
      {
        entityId: entity.id,
        tenantId: entity.tenantId,
        type: entity.type,
        owningEngine: entity.owningEngine,
        evidenceIds: entity.evidenceIds,
      },
      input.correlationId,
    );
    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeVersionRecorded,
      { entityId: entity.id, version: entity.version },
      input.correlationId,
    );

    return ok(entity);
  }

  private async versionedUpdateEntity(
    existing: CanonicalEntity,
    input: ProposeEntityInput,
  ): Promise<EngineResult<CanonicalEntity>> {
    const now = new Date().toISOString();
    const next: CanonicalEntity = structuredClone(existing);
    next.properties = { ...next.properties, ...(input.properties ?? {}) };
    next.evidenceIds = [
      ...new Set([...next.evidenceIds, ...input.evidenceIds]),
    ];
    if (input.confidence !== undefined) {
      next.confidence = input.confidence;
      next.confidenceHistory.push({
        at: now,
        confidence: input.confidence,
        sourceEngine: input.proposingEngine,
        note: "update",
      });
    }
    if (input.validFrom) next.validFrom = input.validFrom;
    if (input.validTo !== undefined) next.validTo = input.validTo;
    next.version += 1;
    next.updatedAt = now;
    next.provenance.push({
      at: now,
      sourceEngine: input.proposingEngine,
      action: "update",
      previousVersion: existing.version,
      ...(input.correlationId !== undefined
        ? { correlationId: input.correlationId }
        : {}),
    });
    const frozen = snapshotOf(next);
    // Version history is immutable — append only.
    next.versionHistory = [...existing.versionHistory, frozen];
    this.store.updateEntity(next);

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeEntityUpdated,
      {
        entityId: next.id,
        tenantId: next.tenantId,
        version: next.version,
        owningEngine: next.owningEngine,
      },
      input.correlationId,
    );
    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeVersionRecorded,
      { entityId: next.id, version: next.version },
      input.correlationId,
    );
    return ok(next);
  }

  async proposeRelationship(
    input: ProposeRelationshipInput,
  ): Promise<EngineResult<CanonicalRelationship>> {
    if (
      !input.tenantId ||
      !input.type ||
      !input.from ||
      !input.to ||
      !input.proposingEngine
    ) {
      return err({
        code: "VALIDATION_FAILED",
        message: "tenantId, type, from, to and proposingEngine are required",
        retryable: false,
      });
    }

    const evidenceCheck = this.requireEvidence(input.tenantId, input.evidenceIds);
    if (!evidenceCheck.ok) return evidenceCheck;

    const from = this.store.getEntity(input.from);
    const to = this.store.getEntity(input.to);
    if (!from || !to || from.tenantId !== input.tenantId || to.tenantId !== input.tenantId) {
      return err({
        code: "ENTITY_NOT_FOUND",
        message: "Both relationship endpoints must exist in the tenant",
        retryable: false,
      });
    }

    const idempotencyKey =
      input.idempotencyKey ??
      defaultIdempotencyKey([
        input.tenantId,
        input.type,
        input.from,
        input.to,
        input.proposingEngine,
        [...input.evidenceIds].sort().join(","),
      ]);
    if (this.store.hasIdempotencyKey(input.tenantId, idempotencyKey)) {
      const existingId = this.store.getIdempotencyResult(
        input.tenantId,
        idempotencyKey,
      );
      const existing = existingId
        ? this.store.getRelationship(existingId)
        : undefined;
      if (existing) return ok(existing);
    }

    if (input.id) {
      const existing = this.store.getRelationship(input.id);
      if (existing) {
        if (existing.owningEngine !== input.proposingEngine) {
          return err({
            code: "CROSS_ENGINE_MUTATION_FORBIDDEN",
            message: `Engine ${input.proposingEngine} cannot mutate relationships owned by ${existing.owningEngine}`,
            retryable: false,
          });
        }
        const now = new Date().toISOString();
        const next = structuredClone(existing);
        next.properties = { ...next.properties, ...(input.properties ?? {}) };
        next.evidenceIds = [
          ...new Set([...next.evidenceIds, ...input.evidenceIds]),
        ];
        next.version += 1;
        next.updatedAt = now;
        next.provenance.push({
          at: now,
          sourceEngine: input.proposingEngine,
          action: "update",
          previousVersion: existing.version,
        });
        next.versionHistory = [...existing.versionHistory, snapshotOf(next)];
        this.store.updateRelationship(next);
        await publishKnowledgeGraphEvent(
          this.events,
          PlatformEventName.KnowledgeRelationshipUpdated,
          { relationshipId: next.id, version: next.version },
          input.correlationId,
        );
        return ok(next);
      }
    }

    const now = new Date().toISOString();
    const confidence = input.confidence ?? 0.7;
    const relationship: CanonicalRelationship = {
      id: input.id ?? randomUUID(),
      tenantId: input.tenantId,
      type: input.type,
      from: input.from,
      to: input.to,
      status: "canonical",
      properties: input.properties ?? {},
      evidenceIds: [...input.evidenceIds],
      provenance: [
        {
          at: now,
          sourceEngine: input.proposingEngine,
          action: "create",
          ...(input.correlationId !== undefined
            ? { correlationId: input.correlationId }
            : {}),
        },
      ],
      confidence,
      confidenceHistory: [
        {
          at: now,
          confidence,
          sourceEngine: input.proposingEngine,
          note: "initial",
        },
      ],
      version: 1,
      versionHistory: [],
      validFrom: input.validFrom ?? now,
      validTo: input.validTo ?? null,
      owningEngine: input.proposingEngine,
      createdAt: now,
      updatedAt: now,
    };
    relationship.versionHistory = [snapshotOf(relationship)];
    this.store.insertRelationship(relationship);
    this.store.rememberIdempotencyKey(
      input.tenantId,
      idempotencyKey,
      relationship.id,
    );

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeRelationshipCreated,
      {
        relationshipId: relationship.id,
        tenantId: relationship.tenantId,
        type: relationship.type,
        from: relationship.from,
        to: relationship.to,
      },
      input.correlationId,
    );
    return ok(relationship);
  }

  async addAlias(input: AddAliasInput): Promise<EngineResult<CanonicalEntity>> {
    const entity = this.store.getEntity(input.entityId);
    if (!entity || entity.tenantId !== input.tenantId) {
      return err({
        code: "ENTITY_NOT_FOUND",
        message: `Entity not found: ${input.entityId}`,
        retryable: false,
      });
    }
    if (entity.owningEngine !== input.sourceEngine) {
      return err({
        code: "CROSS_ENGINE_MUTATION_FORBIDDEN",
        message: `Engine ${input.sourceEngine} cannot mutate aliases on entities owned by ${entity.owningEngine}`,
        retryable: false,
      });
    }

    const normalisedValue = normaliseAliasValue(input.value);
    const next = structuredClone(entity);
    if (!next.aliases.some((alias) => alias.normalisedValue === normalisedValue)) {
      next.aliases.push({
        value: input.value,
        kind: input.kind,
        normalisedValue,
        sourceEngine: input.sourceEngine,
        observedAt: input.observedAt ?? new Date().toISOString(),
      });
      next.identityKeys = collectIdentityKeys({
        type: next.type,
        aliases: next.aliases,
      });
      next.version += 1;
      next.updatedAt = new Date().toISOString();
      next.provenance.push({
        at: next.updatedAt,
        sourceEngine: input.sourceEngine,
        action: "add_alias",
        previousVersion: entity.version,
      });
      next.versionHistory = [...entity.versionHistory, snapshotOf(next)];
      this.store.updateEntity(next);
    }

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeAliasAdded,
      {
        entityId: next.id,
        alias: normalisedValue,
        sourceEngine: input.sourceEngine,
      },
      input.correlationId,
    );
    return ok(this.store.getEntity(next.id)!);
  }

  detectDuplicates(
    tenantId: string,
    correlationId?: string,
  ): EngineResult<DuplicateCandidate[]> {
    const candidates = detectDuplicates(this.store.listEntitiesByTenant(tenantId));
    void publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeDuplicateDetected,
      { tenantId, count: candidates.length },
      correlationId,
    );
    return ok(candidates);
  }

  async createMergeProposal(
    input: CreateMergeProposalInput,
  ): Promise<EngineResult<MergeProposal>> {
    const source = this.store.getEntity(input.sourceEntityId);
    const target = this.store.getEntity(input.targetEntityId);
    if (
      !source ||
      !target ||
      source.tenantId !== input.tenantId ||
      target.tenantId !== input.tenantId
    ) {
      return err({
        code: "ENTITY_NOT_FOUND",
        message: "Both merge endpoints must exist in the tenant",
        retryable: false,
      });
    }
    if (source.id === target.id) {
      return err({
        code: "VALIDATION_FAILED",
        message: "Cannot merge an entity into itself",
        retryable: false,
      });
    }

    const proposal: MergeProposal = {
      id: randomUUID(),
      tenantId: input.tenantId,
      sourceEntityId: input.sourceEntityId,
      targetEntityId: input.targetEntityId,
      reason: input.reason,
      status: "pending",
      proposedBy: input.proposedBy,
      proposedAt: new Date().toISOString(),
      ...(input.correlationId !== undefined
        ? { correlationId: input.correlationId }
        : {}),
    };
    this.store.insertMergeProposal(proposal);
    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeMergeProposed,
      {
        proposalId: proposal.id,
        sourceEntityId: proposal.sourceEntityId,
        targetEntityId: proposal.targetEntityId,
      },
      input.correlationId,
    );
    return ok(proposal);
  }

  async confirmMerge(
    tenantId: string,
    proposalId: string,
    confirmedBy: string,
    correlationId?: string,
  ): Promise<EngineResult<{ proposal: MergeProposal; target: CanonicalEntity }>> {
    const proposal = this.store.getMergeProposal(proposalId);
    if (!proposal || proposal.tenantId !== tenantId) {
      return err({
        code: "MERGE_PROPOSAL_NOT_FOUND",
        message: `Merge proposal not found: ${proposalId}`,
        retryable: false,
      });
    }
    if (proposal.status !== "pending") {
      return err({
        code: "MERGE_PROPOSAL_NOT_PENDING",
        message: `Merge proposal is ${proposal.status}`,
        retryable: false,
      });
    }

    const source = this.store.getEntity(proposal.sourceEntityId);
    const target = this.store.getEntity(proposal.targetEntityId);
    if (!source || !target) {
      return err({
        code: "ENTITY_NOT_FOUND",
        message: "Merge endpoints missing",
        retryable: false,
      });
    }

    const now = new Date().toISOString();
    const nextTarget = structuredClone(target);
    for (const alias of source.aliases) {
      if (
        !nextTarget.aliases.some(
          (item) => item.normalisedValue === alias.normalisedValue,
        )
      ) {
        nextTarget.aliases.push(alias);
      }
    }
    nextTarget.identityKeys = collectIdentityKeys({
      type: nextTarget.type,
      aliases: nextTarget.aliases,
    });
    nextTarget.evidenceIds = [
      ...new Set([...nextTarget.evidenceIds, ...source.evidenceIds]),
    ];
    nextTarget.version += 1;
    nextTarget.updatedAt = now;
    nextTarget.provenance.push({
      at: now,
      sourceEngine: confirmedBy,
      action: "merge_confirm",
      previousVersion: target.version,
      note: `merged ${source.id} into ${target.id}`,
      ...(correlationId !== undefined ? { correlationId } : {}),
    });
    nextTarget.versionHistory = [...target.versionHistory, snapshotOf(nextTarget)];
    this.store.updateEntity(nextTarget);

    const nextSource = structuredClone(source);
    nextSource.status = "merged";
    nextSource.mergedIntoId = target.id;
    nextSource.version += 1;
    nextSource.updatedAt = now;
    nextSource.provenance.push({
      at: now,
      sourceEngine: confirmedBy,
      action: "merged_away",
      previousVersion: source.version,
    });
    nextSource.versionHistory = [...source.versionHistory, snapshotOf(nextSource)];
    this.store.updateEntity(nextSource);

    const nextProposal = structuredClone(proposal);
    nextProposal.status = "confirmed";
    nextProposal.resolvedAt = now;
    this.store.updateMergeProposal(nextProposal);

    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeMergeConfirmed,
      {
        proposalId,
        sourceEntityId: source.id,
        targetEntityId: target.id,
        confirmedBy,
      },
      correlationId,
    );

    return ok({ proposal: nextProposal, target: nextTarget });
  }

  async rejectMerge(
    tenantId: string,
    proposalId: string,
    rejectedBy: string,
    correlationId?: string,
  ): Promise<EngineResult<MergeProposal>> {
    const proposal = this.store.getMergeProposal(proposalId);
    if (!proposal || proposal.tenantId !== tenantId) {
      return err({
        code: "MERGE_PROPOSAL_NOT_FOUND",
        message: `Merge proposal not found: ${proposalId}`,
        retryable: false,
      });
    }
    if (proposal.status !== "pending") {
      return err({
        code: "MERGE_PROPOSAL_NOT_PENDING",
        message: `Merge proposal is ${proposal.status}`,
        retryable: false,
      });
    }
    const next = structuredClone(proposal);
    next.status = "rejected";
    next.resolvedAt = new Date().toISOString();
    this.store.updateMergeProposal(next);
    await publishKnowledgeGraphEvent(
      this.events,
      PlatformEventName.KnowledgeMergeRejected,
      { proposalId, rejectedBy },
      correlationId,
    );
    return ok(next);
  }

  getEntity(entityId: string, tenantId?: string): EngineResult<CanonicalEntity> {
    const entity = this.store.getEntity(entityId);
    if (!entity) {
      return err({
        code: "ENTITY_NOT_FOUND",
        message: `Entity not found: ${entityId}`,
        retryable: false,
      });
    }
    if (tenantId !== undefined && entity.tenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Entity is not visible to this tenant",
        retryable: false,
      });
    }
    return ok(entity);
  }

  listEntities(tenantId: string): CanonicalEntity[] {
    return this.store.listEntitiesByTenant(tenantId);
  }

  getRelationship(
    relationshipId: string,
    tenantId?: string,
  ): EngineResult<CanonicalRelationship> {
    const rel = this.store.getRelationship(relationshipId);
    if (!rel) {
      return err({
        code: "RELATIONSHIP_NOT_FOUND",
        message: `Relationship not found: ${relationshipId}`,
        retryable: false,
      });
    }
    if (tenantId !== undefined && rel.tenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Relationship is not visible to this tenant",
        retryable: false,
      });
    }
    return ok(rel);
  }

  listMergeProposals(tenantId: string): MergeProposal[] {
    return this.store.listMergeProposals(tenantId);
  }
}
