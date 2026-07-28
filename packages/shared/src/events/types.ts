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

  // Website Intelligence (Volume 6)
  WebsiteDefined: "WebsiteDefined",
  WebsitePropertyAdded: "WebsitePropertyAdded",
  PageObserved: "PageObserved",
  PageTypeCandidateCreated: "PageTypeCandidateCreated",
  PageTypeConfirmed: "PageTypeConfirmed",
  PagePurposeCandidateCreated: "PagePurposeCandidateCreated",
  PagePurposeConfirmed: "PagePurposeConfirmed",
  PageHierarchyUpdated: "PageHierarchyUpdated",
  NavigationStructureUpdated: "NavigationStructureUpdated",
  PageSectionObserved: "PageSectionObserved",
  PageTemplateAssociated: "PageTemplateAssociated",
  BusinessEntityMapped: "BusinessEntityMapped",
  MarketEntityMapped: "MarketEntityMapped",
  TopicAssociated: "TopicAssociated",
  QuestionAssociated: "QuestionAssociated",
  ConversionActionObserved: "ConversionActionObserved",
  FormObserved: "FormObserved",
  TrustElementObserved: "TrustElementObserved",
  WebsiteAssetObserved: "WebsiteAssetObserved",
  PagePublicationStateChanged: "PagePublicationStateChanged",
  WebsiteSnapshotCreated: "WebsiteSnapshotCreated",
  WebsiteImportStarted: "WebsiteImportStarted",
  WebsiteImportCompleted: "WebsiteImportCompleted",
  WebsiteImportFailed: "WebsiteImportFailed",

  // Crawl Intelligence (Volume 7)
  CrawlJobCreated: "CrawlJobCreated",
  CrawlJobStarted: "CrawlJobStarted",
  CrawlJobCompleted: "CrawlJobCompleted",
  CrawlJobFailed: "CrawlJobFailed",
  CrawlScopeValidated: "CrawlScopeValidated",
  CrawlObservationRecorded: "CrawlObservationRecorded",
  CrawlFetchAttempted: "CrawlFetchAttempted",
  CrawlResponseObserved: "CrawlResponseObserved",
  CrawlRedirectObserved: "CrawlRedirectObserved",
  CrawlFailureObserved: "CrawlFailureObserved",
  CrawlSnapshotCreated: "CrawlSnapshotCreated",
  CrawlSnapshotCompared: "CrawlSnapshotCompared",

  // Knowledge Graph Engine (Volume 8)
  KnowledgeEntityProposed: "KnowledgeEntityProposed",
  KnowledgeEntityCreated: "KnowledgeEntityCreated",
  KnowledgeEntityUpdated: "KnowledgeEntityUpdated",
  KnowledgeRelationshipCreated: "KnowledgeRelationshipCreated",
  KnowledgeRelationshipUpdated: "KnowledgeRelationshipUpdated",
  KnowledgeAliasAdded: "KnowledgeAliasAdded",
  KnowledgeEvidenceAttached: "KnowledgeEvidenceAttached",
  KnowledgeDuplicateDetected: "KnowledgeDuplicateDetected",
  KnowledgeMergeProposed: "KnowledgeMergeProposed",
  KnowledgeMergeConfirmed: "KnowledgeMergeConfirmed",
  KnowledgeMergeRejected: "KnowledgeMergeRejected",
  KnowledgeVersionRecorded: "KnowledgeVersionRecorded",

  // Platform (later engines) / compatibility
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
