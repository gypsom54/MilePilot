# How engines communicate (Event Bus)

## Rule

**No direct engine coupling.**

Engines never call each other. They publish and subscribe to events.

## Platform events (Sprint 0)

| Event | Intent |
| --- | --- |
| `BusinessCreated` | A business entity entered the platform |
| `WebsiteConnected` | A website was connected to a business |
| `PageCrawled` | A page was crawled |
| `PerformanceChanged` | Performance signals changed |
| `ReviewReceived` | A review was received |
| `CompetitorUpdated` | Competitor data changed |
| `OpportunityCreated` | An opportunity was created |
| `AIRecommendationGenerated` | An AI recommendation was generated |

## API

```ts
import { InMemoryEventBus, PlatformEventName } from "@seo-autopilot/engine-sdk";

const bus = new InMemoryEventBus();

await bus.publish({
  name: PlatformEventName.BusinessCreated,
  payload: {},
  occurredAt: new Date().toISOString(),
  source: "business-discovery",
});

bus.subscribe(PlatformEventName.BusinessCreated, async (event) => {
  // react via this engine's own analyse/recommend/automate path
});
```

## Replacement

`InMemoryEventBus` is the Sprint 0 foundation.
A durable bus may replace it later without changing `IntelligenceEngine`.
