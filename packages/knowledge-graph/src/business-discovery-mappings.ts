/**
 * Knowledge Graph entity type mappings for Business Discovery (Volume 4).
 */

export const BusinessDiscoveryEntityType = {
  Business: "Business",
  Brand: "Brand",
  Product: "Product",
  Service: "Service",
  Location: "Location",
  Audience: "Audience",
  Goal: "Goal",
  Expertise: "Expertise",
  TeamMember: "TeamMember",
  TrustSignal: "TrustSignal",
  DigitalAsset: "DigitalAsset",
  CompetitorSeed: "CompetitorSeed",
  CustomerQuestion: "CustomerQuestion",
  Constraint: "Constraint",
  Preferences: "Preferences",
} as const;

export type BusinessDiscoveryEntityType =
  (typeof BusinessDiscoveryEntityType)[keyof typeof BusinessDiscoveryEntityType];

export const BusinessDiscoveryRelationshipType = {
  HAS_BRAND: "HAS_BRAND",
  HAS_PRODUCT: "HAS_PRODUCT",
  HAS_SERVICE: "HAS_SERVICE",
  HAS_LOCATION: "HAS_LOCATION",
  HAS_AUDIENCE: "HAS_AUDIENCE",
  HAS_GOAL: "HAS_GOAL",
  HAS_EXPERTISE: "HAS_EXPERTISE",
  EXPERTISE_CHILD: "EXPERTISE_CHILD",
  HAS_TEAM_MEMBER: "HAS_TEAM_MEMBER",
  HAS_TRUST_SIGNAL: "HAS_TRUST_SIGNAL",
  HAS_DIGITAL_ASSET: "HAS_DIGITAL_ASSET",
  COMPETITOR_SEED: "COMPETITOR_SEED",
  HAS_QUESTION: "HAS_QUESTION",
  HAS_CONSTRAINT: "HAS_CONSTRAINT",
  HAS_PREFERENCES: "HAS_PREFERENCES",
  RELATED_TOPIC: "RELATED_TOPIC",
} as const;

export type BusinessDiscoveryRelationshipType =
  (typeof BusinessDiscoveryRelationshipType)[keyof typeof BusinessDiscoveryRelationshipType];

export function businessEntityId(businessId: string): string {
  return `business:${businessId}`;
}

export function childEntityId(
  businessId: string,
  kind: string,
  childId: string,
): string {
  return `business:${businessId}:${kind}:${childId}`;
}
