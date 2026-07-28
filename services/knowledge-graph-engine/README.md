# Knowledge Graph Engine (`@seo-autopilot/knowledge-graph-engine`)

Canonical semantic memory for SEO AutoPilot.

Authority: `docs/seo-autopilot/VOLUME_8_KNOWLEDGE_GRAPH.md`

## Boundary

- Engines propose; only this engine creates/changes canonical entities
- Evidence and provenance required
- Merge proposals require confirmation — no automatic AI merges
- No SEO / crawl / website / business / market / recommendation logic

## Usage

```ts
import { createKnowledgeGraphRuntime } from "@seo-autopilot/knowledge-graph-engine";

const runtime = createKnowledgeGraphRuntime();
await runtime.service.attachEvidence({ tenantId, evidence: { ... } });
await runtime.service.proposeEntity({ tenantId, type, proposingEngine, evidenceIds });
```
