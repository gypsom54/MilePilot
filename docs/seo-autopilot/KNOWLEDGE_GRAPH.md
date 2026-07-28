# Knowledge Graph SDK + Canonical Memory

## Scope

Package: `@seo-autopilot/knowledge-graph`  
Engine: `@seo-autopilot/knowledge-graph-engine` (`knowledge-graph`)

- Sprint 0: SDK interfaces
- Sprint 1: `InMemoryKnowledgeGraph` + Business Discovery entity/relationship mappings
- Sprint 2: Market Intelligence entity/relationship mappings (idempotent sync)
- Sprint 3: Website Intelligence entity/relationship mappings (idempotent sync)
- Sprint 4: Crawl Intelligence observation entity/relationship mappings (idempotent sync; does not overwrite Website Intelligence)
- Sprint 5: Canonical semantic memory (Volume 8) — entities, relationships, aliases, identity, duplicates, merge proposals, evidence/provenance/confidence/version/temporal queries

**No SEO logic.**

See Volume 5 for Market mappings, Volume 6 for Website / Page / Navigation mappings, Volume 7 for Crawl observation mappings, and Volume 8 for the Knowledge Graph Engine.

## SDK functions (domain projection)

| Function | Purpose |
| --- | --- |
| `createEntity()` | Create a graph entity |
| `updateRelationship()` | Update a relationship |
| `findRelatedTopics()` | Find related topics for an entity |
| `findCompetitors()` | Find competitors for an entity |
| `findSupportingEvidence()` | Find supporting evidence |
| `findBusinessContext()` | Find business context |

## Canonical engine capabilities (Volume 8)

| Capability | Purpose |
| --- | --- |
| propose entity / relationship | Engines propose; KG creates canonical facts |
| aliases + identity | Duplicate detection inputs |
| evidence / provenance chains | Required for every canonical fact |
| confidence / version history | Append-only immutable history |
| temporal validity | Query entities valid at a point in time |
| merge proposals | Require explicit confirmation — never automatic |

All methods return `EngineResult<T>` from `@seo-autopilot/shared`.

## Rule

Engines depend on `KnowledgeGraphSdk` for domain projections, and on the Knowledge Graph Engine APIs for canonical semantic memory.
No engine may directly mutate another engine's canonical entities.
