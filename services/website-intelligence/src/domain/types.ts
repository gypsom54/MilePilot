export type PropertyEnvironment = "production" | "staging" | "other";

export type ClassificationStatus = "candidate" | "confirmed";

export type PublicationState =
  | "draft"
  | "published"
  | "redirected"
  | "archived"
  | "deleted";

export type ImportJobStatus = "started" | "completed" | "failed";

export interface ObservationMeta {
  sourceId: string;
  observedAt: string;
  provenance: string;
  confidence: number;
  limitations: string[];
}

export interface Classification {
  value: string;
  status: ClassificationStatus;
  evidence: ObservationMeta;
}

export interface PublicationHistoryEntry {
  state: PublicationState;
  at: string;
  sourceId: string;
}

export interface PageSection {
  id: string;
  heading: string;
  order: number;
  evidence: ObservationMeta;
}

export interface ConversionAction {
  id: string;
  label: string;
  kind: string;
  evidence: ObservationMeta;
}

export interface FormObservation {
  id: string;
  name: string;
  fieldCount?: number;
  evidence: ObservationMeta;
}

export interface TrustElement {
  id: string;
  kind: string;
  label: string;
  evidence: ObservationMeta;
}

export interface WebsiteAsset {
  id: string;
  kind: string;
  url: string;
  label: string;
  evidence: ObservationMeta;
}

export interface BusinessEntityRef {
  businessId: string;
  entityPath: string;
  tenantId: string;
}

export interface MarketEntityRef {
  marketId: string;
  entityType: string;
  entityId: string;
  tenantId: string;
}

export interface PageEntity {
  id: string;
  propertyId: string;
  rawUrl: string;
  normalisedUrl: string;
  title?: string;
  pageType: Classification;
  purpose: Classification;
  publicationState: PublicationState;
  publicationHistory: PublicationHistoryEntry[];
  parentPageId?: string;
  sectionIds: string[];
  templateId?: string;
  businessEntityRefs: BusinessEntityRef[];
  marketEntityRefs: MarketEntityRef[];
  topicIds: string[];
  questionIds: string[];
  conversionActionIds: string[];
  formIds: string[];
  trustElementIds: string[];
  assetIds: string[];
  evidence: ObservationMeta;
  importKey: string;
}

export interface WebsiteProperty {
  id: string;
  environment: PropertyEnvironment;
  baseUrl: string;
  normalisedBaseUrl: string;
}

export interface NavigationItem {
  label: string;
  pageId?: string;
  href?: string;
}

export interface NavigationStructure {
  id: string;
  name: string;
  items: NavigationItem[];
  evidence: ObservationMeta;
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
}

export interface WebsiteSnapshot {
  id: string;
  createdAt: string;
  label: string;
  pageCount: number;
  propertyIds: string[];
  evidence: ObservationMeta;
}

export interface ImportJob {
  id: string;
  status: ImportJobStatus;
  startedAt: string;
  completedAt?: string;
  imported: number;
  skipped: number;
  errorMessage?: string;
}

export interface WebsiteProfile {
  id: string;
  tenantId: string;
  businessId?: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  properties: WebsiteProperty[];
  pages: PageEntity[];
  sections: PageSection[];
  templates: PageTemplate[];
  navigations: NavigationStructure[];
  conversionActions: ConversionAction[];
  forms: FormObservation[];
  trustElements: TrustElement[];
  assets: WebsiteAsset[];
  snapshots: WebsiteSnapshot[];
  importJobs: ImportJob[];
  importKeys: string[];
}

export interface CreateWebsiteInput {
  tenantId: string;
  businessId?: string;
  name: string;
}
