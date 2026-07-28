# How engines communicate (Event Bus)

## Rule

**No direct engine coupling.**

Engines never call each other. They publish and subscribe to events.

## Platform events

| Event | Intent |
| --- | --- |
| `BusinessCreated` | A business entity entered the platform |
| `BusinessUpdated` | Canonical business profile changed |
| `WebsiteConnected` | A website was connected to a business |
| `ServiceAdded` | A service entity was added |
| `AudienceChanged` | Audience profile changed |
| `GoalAdded` | A structured goal was added |
| `GoalCompleted` | A goal was marked completed |
| `CompetitorSeedAdded` | A competitor seed was recorded |
| `ConstraintUpdated` | Constraints changed |
| `BrandProfileUpdated` | Brand profile changed |
| `MarketDefined` | Market definition created |
| `MarketScopeUpdated` | Market scope/definition updated |
| `MarketCategoryCandidateCreated` | Market category candidate added |
| `MarketCategoryConfirmed` | Market category confirmed |
| `DemandSignalObserved` | Demand signal recorded |
| `DemandThemeCreated` | Demand theme created |
| `CustomerProblemObserved` | Customer problem observed |
| `CompetitorCandidateDiscovered` | Competitor candidate discovered |
| `CompetitorCandidateConfirmed` | Competitor candidate confirmed |
| `CompetitorCandidateDismissed` | Competitor candidate dismissed |
| `OfferObserved` | Market offer observation recorded |
| `MarketGapDetected` | Market gap candidate detected |
| `MarketGapValidated` | Market gap validated |
| `MarketTrendObserved` | Market trend observed |
| `SeasonalityPatternObserved` | Seasonality pattern observed |
| `MarketEvidenceExpired` | Market evidence expired |
| `MarketResearchCompleted` | Market research completed |
| `MarketResearchPartiallyCompleted` | Market research partially completed |
| `MarketResearchFailed` | Market research failed |
| `WebsiteDefined` | Website defined |
| `WebsitePropertyAdded` | Website property added |
| `PageObserved` | Page observation recorded |
| `PageTypeCandidateCreated` | Page type candidate created |
| `PageTypeConfirmed` | Page type confirmed |
| `PagePurposeCandidateCreated` | Page purpose candidate created |
| `PagePurposeConfirmed` | Page purpose confirmed |
| `PageHierarchyUpdated` | Page hierarchy updated |
| `NavigationStructureUpdated` | Navigation structure updated |
| `PageSectionObserved` | Page section observed |
| `PageTemplateAssociated` | Page template associated |
| `BusinessEntityMapped` | Business entity mapped (read-only ref) |
| `MarketEntityMapped` | Market entity mapped (read-only ref) |
| `TopicAssociated` | Topic associated to page |
| `QuestionAssociated` | Question associated to page |
| `ConversionActionObserved` | Conversion action observed |
| `FormObserved` | Form observed |
| `TrustElementObserved` | Trust element observed |
| `WebsiteAssetObserved` | Website asset observed |
| `PagePublicationStateChanged` | Page publication state changed |
| `WebsiteSnapshotCreated` | Website snapshot created |
| `WebsiteImportStarted` | Website import started |
| `WebsiteImportCompleted` | Website import completed |
| `WebsiteImportFailed` | Website import failed |
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
