/**
 * Canonical platform event names.
 * Engines communicate through these events only — never via direct coupling.
 */
export const PlatformEventName = {
  // Business Discovery (Volume 4)
  BusinessCreated: "BusinessCreated",
  BusinessUpdated: "BusinessUpdated",
  WebsiteConnected: "WebsiteConnected",
  ServiceAdded: "ServiceAdded",
  AudienceChanged: "AudienceChanged",
  GoalAdded: "GoalAdded",
  GoalCompleted: "GoalCompleted",
  CompetitorSeedAdded: "CompetitorSeedAdded",
  ConstraintUpdated: "ConstraintUpdated",
  BrandProfileUpdated: "BrandProfileUpdated",

  // Market Intelligence (Volume 5)
  MarketDefined: "MarketDefined",
  MarketScopeUpdated: "MarketScopeUpdated",
  MarketCategoryCandidateCreated: "MarketCategoryCandidateCreated",
  MarketCategoryConfirmed: "MarketCategoryConfirmed",
  DemandSignalObserved: "DemandSignalObserved",
  DemandThemeCreated: "DemandThemeCreated",
  CustomerProblemObserved: "CustomerProblemObserved",
  CompetitorCandidateDiscovered: "CompetitorCandidateDiscovered",
  CompetitorCandidateConfirmed: "CompetitorCandidateConfirmed",
  CompetitorCandidateDismissed: "CompetitorCandidateDismissed",
  OfferObserved: "OfferObserved",
  MarketGapDetected: "MarketGapDetected",
  MarketGapValidated: "MarketGapValidated",
  MarketTrendObserved: "MarketTrendObserved",
  SeasonalityPatternObserved: "SeasonalityPatternObserved",
  MarketEvidenceExpired: "MarketEvidenceExpired",
  MarketResearchCompleted: "MarketResearchCompleted",
  MarketResearchPartiallyCompleted: "MarketResearchPartiallyCompleted",
  MarketResearchFailed: "MarketResearchFailed",

  // Platform (later engines)
  PageCrawled: "PageCrawled",
  PerformanceChanged: "PerformanceChanged",
  ReviewReceived: "ReviewReceived",
  CompetitorUpdated: "CompetitorUpdated",
  OpportunityCreated: "OpportunityCreated",
  AIRecommendationGenerated: "AIRecommendationGenerated",
} as const;

export type PlatformEventName =
  (typeof PlatformEventName)[keyof typeof PlatformEventName];

export interface PlatformEvent<TPayload = unknown> {
  /** Stable event type from PlatformEventName */
  name: PlatformEventName | string;
  /** Opaque payload — shape defined by publishing engine contract */
  payload: TPayload;
  /** ISO-8601 timestamp */
  occurredAt: string;
  /** Engine or system that emitted the event */
  source: string;
  /** Optional correlation id for multi-engine workflows */
  correlationId?: string;
}

export type EventHandler<TPayload = unknown> = (
  event: PlatformEvent<TPayload>,
) => void | Promise<void>;

export interface EventSubscription {
  unsubscribe(): void;
}
