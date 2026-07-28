# Crawl Intelligence (`@seo-autopilot/crawl`)

Observation-layer engine for SEO AutoPilot. Preserves sourced, timestamped, immutable website crawl observations without judging or optimising them.

Authority: `docs/seo-autopilot/VOLUME_7_CRAWL_INTELLIGENCE.md`

## Boundary

- Observes only (Observation Layer)
- Fixture and injected adapters only — no production network crawler
- Does not score SEO, judge indexability/accessibility, score performance, or recommend changes
- Does not overwrite Website Intelligence meaning

## Usage

```ts
import { createCrawlIntelligenceRuntime } from "@seo-autopilot/crawl";

const runtime = createCrawlIntelligenceRuntime();
await runtime.service.createJob({
  tenantId: "tenant_1",
  scope: {
    allowedHosts: ["example.com"],
    allowedProtocols: ["https"],
    includePathPrefixes: [],
    excludePathPrefixes: [],
    environment: "production",
  },
  source: { kind: "fixture", label: "fixture-source" },
});
```
