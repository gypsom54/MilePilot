# Knowledge Graph SDK

## Scope

Package: `@seo-autopilot/knowledge-graph`

- Sprint 0: SDK interfaces
- Sprint 1: `InMemoryKnowledgeGraph` + Business Discovery entity/relationship mappings
- Sprint 2: Market Intelligence entity/relationship mappings (idempotent sync)
- Sprint 3: Website Intelligence entity/relationship mappings (idempotent sync)

**No SEO logic.**

See Volume 5 for Market mappings and Volume 6 for Website / Page / Navigation mappings.

## Functions

| Function | Purpose |
| --- | --- |
| `createEntity()` | Create a graph entity |
| `updateRelationship()` | Update a relationship |
| `findRelatedTopics()` | Find related topics for an entity |
| `findCompetitors()` | Find competitors for an entity |
| `findSupportingEvidence()` | Find supporting evidence |
| `findBusinessContext()` | Find business context |

All methods return `EngineResult<T>` from `@seo-autopilot/shared`.

## Rule

Engines depend on `KnowledgeGraphSdk`, never on a concrete store.
Concrete implementations arrive in later sprints / Database Bible work.
