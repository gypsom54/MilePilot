export const WebsiteIntelligenceEntityType = {
  Website: "Website",
  WebsiteProperty: "WebsiteProperty",
  Page: "Page",
  Navigation: "Navigation",
  PageSection: "PageSection",
  PageTemplate: "PageTemplate",
  ConversionAction: "ConversionAction",
  Form: "Form",
  TrustElement: "TrustElement",
  WebsiteAsset: "WebsiteAsset",
  WebsiteSnapshot: "WebsiteSnapshot",
  TopicRef: "TopicRef",
  QuestionRef: "QuestionRef",
} as const;

export type WebsiteIntelligenceEntityType =
  (typeof WebsiteIntelligenceEntityType)[keyof typeof WebsiteIntelligenceEntityType];

export const WebsiteIntelligenceRelationshipType = {
  HAS_PROPERTY: "HAS_PROPERTY",
  HAS_PAGE: "HAS_PAGE",
  PARENT_OF: "PARENT_OF",
  HAS_NAVIGATION: "HAS_NAVIGATION",
  NAV_INCLUDES_PAGE: "NAV_INCLUDES_PAGE",
  HAS_SECTION: "HAS_SECTION",
  USES_TEMPLATE: "USES_TEMPLATE",
  HAS_TEMPLATE: "HAS_TEMPLATE",
  ASSOCIATED_TOPIC: "ASSOCIATED_TOPIC",
  ASSOCIATED_QUESTION: "ASSOCIATED_QUESTION",
  HAS_CONVERSION_ACTION: "HAS_CONVERSION_ACTION",
  HAS_FORM: "HAS_FORM",
  HAS_TRUST_ELEMENT: "HAS_TRUST_ELEMENT",
  HAS_ASSET: "HAS_ASSET",
  HAS_SNAPSHOT: "HAS_SNAPSHOT",
} as const;

export type WebsiteIntelligenceRelationshipType =
  (typeof WebsiteIntelligenceRelationshipType)[keyof typeof WebsiteIntelligenceRelationshipType];

export function websiteEntityId(websiteId: string): string {
  return `website:${websiteId}`;
}

export function websiteChildEntityId(
  websiteId: string,
  kind: string,
  childId: string,
): string {
  return `website:${websiteId}:${kind}:${childId}`;
}
