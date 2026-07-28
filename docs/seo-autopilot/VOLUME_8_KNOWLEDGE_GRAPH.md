# Engineering Bible — Volume 8

# Knowledge Graph Engine

> Transform the Knowledge Graph into the canonical semantic memory of SEO AutoPilot.

---

## Locked architectural law

```text
Observation records what was seen.
Knowledge explains what it means.
Recommendations decide what to do.
```

The Knowledge Graph Engine owns **canonical semantic memory**.

Domain engines may **propose** facts. Only the Knowledge Graph Engine **creates or changes** canonical graph entities.

---

## Mission

Provide a single, provenance-preserving, evidence-backed, temporally aware graph of canonical entities and relationships for SEO AutoPilot.

It does **not** invent SEO meaning, crawl websites, score opportunities, recommend actions, or orchestrate Ask.

---

## Engine boundary

### Owns

- Canonical Entity model
- Canonical Relationship model
- Alias support
- Entity identity
- Duplicate detection
- Merge proposals (never automatic merges)
- Evidence chains
- Provenance chains
- Confidence history
- Version history (immutable)
- Temporal validity
- Graph query services
- Repository contracts and in-memory persistence
- Knowledge Graph API and event publication

### Must not

- SEO logic / crawl logic / website logic / business logic / market logic
- Recommendations / opportunity scoring
- Dashboards / Ask SEO AutoPilot
- Automatic AI merges

`recommend()` must return `ENGINE_DOES_NOT_RECOMMEND`.

---

## Core rules

1. Engines may propose; only the Knowledge Graph creates or changes canonical graph entities.
2. No engine may directly mutate another engine's canonical entities.
3. Every canonical fact must reference evidence.
4. Every change must preserve provenance.
5. Entity IDs are immutable.
6. Graph writes must be idempotent.
7. Version history is immutable.
8. Merge proposals require confirmation.

---

## Domain model

### Canonical Entity

| Field | Rule |
| --- | --- |
| `id` | Immutable once assigned |
| `tenantId` | Tenant isolation |
| `type` | Entity type string |
| `status` | `candidate` \| `canonical` \| `merged` \| `deprecated` |
| `aliases` | Alternate identifiers |
| `identityKeys` | Normalised identity keys for duplicate detection |
| `properties` | Fact payload |
| `evidenceIds` | Required evidence references |
| `provenance` | Provenance chain |
| `confidence` | Current confidence 0..1 |
| `confidenceHistory` | Immutable append-only history |
| `version` | Monotonic version |
| `versionHistory` | Immutable snapshots per version |
| `validFrom` / `validTo` | Temporal validity window |
| `owningEngine` | Engine that proposed / owns the fact family |
| `mergedIntoId` | Set when status is `merged` |

### Canonical Relationship

Same evidence, provenance, confidence, version, and temporal rules as entities. Fields: `id`, `tenantId`, `type`, `from`, `to`, `status`, `properties`, `owningEngine`.

### Alias

`entityId`, `value`, `kind`, `normalisedValue`, `sourceEngine`, `observedAt`.

### Evidence record

`id`, `tenantId`, `kind`, `sourceEngine`, `referenceIds` (observation / source / document ids), `summary`, `recordedAt`, `payload` (non-sensitive).

### Merge proposal

`id`, `tenantId`, `sourceEntityId`, `targetEntityId`, `reason`, `status` (`pending` \| `confirmed` \| `rejected`), `proposedBy`, `proposedAt`, `resolvedAt?`, `correlationId?`.

Confirmation is required. Automatic merges are forbidden.

---

## Identity and duplicates

- Identity keys are derived from entity type + normalised aliases / identity fields.
- Duplicate detection returns candidate pairs; it never merges.
- Merge requires an explicit confirmed proposal.

---

## Write path

```text
Engine proposes fact (+ evidence)
        │
        ▼
Knowledge Graph validates evidence + provenance
        │
        ▼
Idempotent create / versioned update of canonical entity or relationship
        │
        ▼
Immutable version history + events
```

Cross-engine mutation of another engine's canonical entities is rejected.

---

## Query services

- Get entity / relationship by id
- Find by alias
- Find related entities
- Find evidence chain for an entity
- Find provenance / confidence / version history
- Entities valid at a point in time
- Detect duplicates
- List merge proposals

---

## Events

| Event | When |
| --- | --- |
| `KnowledgeEntityProposed` | Proposal received |
| `KnowledgeEntityCreated` | Canonical entity created |
| `KnowledgeEntityUpdated` | Canonical entity versioned update |
| `KnowledgeRelationshipCreated` | Canonical relationship created |
| `KnowledgeRelationshipUpdated` | Relationship versioned update |
| `KnowledgeAliasAdded` | Alias attached |
| `KnowledgeEvidenceAttached` | Evidence linked |
| `KnowledgeDuplicateDetected` | Duplicate candidates found |
| `KnowledgeMergeProposed` | Merge proposal created |
| `KnowledgeMergeConfirmed` | Merge applied after confirmation |
| `KnowledgeMergeRejected` | Merge proposal rejected |
| `KnowledgeVersionRecorded` | Immutable version snapshot recorded |

Events include correlation IDs and entity / evidence references. Never embed unrestricted confidential bodies.

---

## API

| Method | Path |
| --- | --- |
| `GET` | `/knowledge-graph/manifest` |
| `POST` | `/knowledge-graph/entities/propose` |
| `GET` | `/knowledge-graph/entities` |
| `GET` | `/knowledge-graph/entities/:entityId` |
| `POST` | `/knowledge-graph/relationships/propose` |
| `GET` | `/knowledge-graph/relationships/:relationshipId` |
| `POST` | `/knowledge-graph/aliases` |
| `POST` | `/knowledge-graph/evidence` |
| `POST` | `/knowledge-graph/duplicates/detect` |
| `POST` | `/knowledge-graph/merge-proposals` |
| `POST` | `/knowledge-graph/merge-proposals/:proposalId/confirm` |
| `POST` | `/knowledge-graph/merge-proposals/:proposalId/reject` |
| `GET` | `/knowledge-graph/entities/:entityId/history` |
| `GET` | `/knowledge-graph/entities/:entityId/evidence` |
| `GET` | `/knowledge-graph/query/valid-at` |

`tenantId` required for tenant-scoped operations.

---

## Compatibility

Existing engine sync adapters that write domain projection nodes via `InMemoryKnowledgeGraph` remain for domain observation/projection continuity. Canonical semantic memory is owned exclusively by this engine's canonical store and APIs.

Migrating all domain syncs onto propose-only write paths is deferred infrastructure.

---

## Outputs

- Canonical entities and relationships
- Aliases, evidence chains, provenance chains
- Confidence and version history
- Temporal validity queries
- Merge proposals requiring confirmation

**No judgements. No recommendations. Canonical memory only.**

---

## Sprint 5 success criteria

1. Canonical entity/relationship contracts usable via API
2. Evidence and provenance required and retained
3. Entity IDs immutable; version history immutable; writes idempotent
4. Duplicate detection without automatic merge
5. Merge proposals require confirmation
6. Cross-engine canonical mutation refused
7. `recommend()` refuses
8. TypeScript builds; all tests pass
9. No excluded functionality added
