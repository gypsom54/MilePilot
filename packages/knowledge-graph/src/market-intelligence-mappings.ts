/**
 * Knowledge Graph entity/relationship mappings for Market Intelligence (Volume 5).
 */

export const MarketIntelligenceEntityType = {
  Market: "Market",
  MarketCategory: "MarketCategory",
  CustomerProblem: "CustomerProblem",
  DesiredOutcome: "DesiredOutcome",
  DemandTheme: "DemandTheme",
  DemandSignal: "DemandSignal",
  Question: "Question",
  CompetitorCandidate: "CompetitorCandidate",
  Organisation: "Organisation",
  Product: "Product",
  Service: "Service",
  OfferObservation: "OfferObservation",
  Location: "Location",
  MarketGap: "MarketGap",
  Trend: "Trend",
  SeasonalityPattern: "SeasonalityPattern",
  MarketSource: "MarketSource",
} as const;

export type MarketIntelligenceEntityType =
  (typeof MarketIntelligenceEntityType)[keyof typeof MarketIntelligenceEntityType];

export const MarketIntelligenceRelationshipType = {
  HAS_CATEGORY: "HAS_CATEGORY",
  HAS_PROBLEM: "HAS_PROBLEM",
  HAS_OUTCOME: "HAS_OUTCOME",
  HAS_DEMAND_THEME: "HAS_DEMAND_THEME",
  CLUSTERS_SIGNAL: "CLUSTERS_SIGNAL",
  RELATES_TO_QUESTION: "RELATES_TO_QUESTION",
  HAS_QUESTION: "HAS_QUESTION",
  HAS_COMPETITOR_CANDIDATE: "HAS_COMPETITOR_CANDIDATE",
  REFERS_TO_ORGANISATION: "REFERS_TO_ORGANISATION",
  HAS_ORGANISATION: "HAS_ORGANISATION",
  OFFERS_PRODUCT: "OFFERS_PRODUCT",
  OFFERS_SERVICE: "OFFERS_SERVICE",
  HAS_OFFER_OBSERVATION: "HAS_OFFER_OBSERVATION",
  OBSERVES_PRODUCT: "OBSERVES_PRODUCT",
  OBSERVES_SERVICE: "OBSERVES_SERVICE",
  AT_LOCATION: "AT_LOCATION",
  HAS_LOCATION: "HAS_LOCATION",
  HAS_GAP: "HAS_GAP",
  SUPPORTED_BY_SOURCE: "SUPPORTED_BY_SOURCE",
  HAS_TREND: "HAS_TREND",
  HAS_SEASONALITY: "HAS_SEASONALITY",
  HAS_SOURCE: "HAS_SOURCE",
  HAS_DEMAND_SIGNAL: "HAS_DEMAND_SIGNAL",
} as const;

export type MarketIntelligenceRelationshipType =
  (typeof MarketIntelligenceRelationshipType)[keyof typeof MarketIntelligenceRelationshipType];

export function marketEntityId(marketId: string): string {
  return `market:${marketId}`;
}

export function marketChildEntityId(
  marketId: string,
  kind: string,
  childId: string,
): string {
  return `market:${marketId}:${kind}:${childId}`;
}
