# Knowledge Graph SDK

## Scope (Sprint 0)

Interfaces only. **No graph implementation. No SEO logic.**

Package: `@seo-autopilot/knowledge-graph`

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
