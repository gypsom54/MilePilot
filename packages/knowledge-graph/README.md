# Knowledge Graph SDK + Canonical Memory

Package: `@seo-autopilot/knowledge-graph`

- Sprint 0: SDK interfaces
- Sprint 1–4: Domain projection mappings + `InMemoryKnowledgeGraph`
- Sprint 5: Canonical entity/relationship memory (Volume 8) — identity, aliases, evidence, provenance, confidence/version history, temporal validity, duplicate detection, merge proposals

**No SEO logic.**

Canonical writes are owned by the Knowledge Graph Engine (`@seo-autopilot/knowledge-graph-engine`). Domain engines may propose; they must not mutate another engine's canonical entities.

See `docs/seo-autopilot/VOLUME_8_KNOWLEDGE_GRAPH.md`.
