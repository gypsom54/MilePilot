/**
 * Canonical platform event names.
 * Engines communicate through these events only — never via direct coupling.
 */
export const PlatformEventName = {
  BusinessCreated: "BusinessCreated",
  WebsiteConnected: "WebsiteConnected",
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
