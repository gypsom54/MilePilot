export type CrawlEnvironment = "production" | "staging" | "other";

export type AdapterKind = "fixture" | "injected";

export type CrawlJobStatus =
  | "draft"
  | "running"
  | "completed"
  | "failed";

export type ObservationKind =
  | "url_discovery"
  | "fetch_attempt"
  | "http_response"
  | "redirect_chain"
  | "document"
  | "html_metadata"
  | "heading"
  | "link"
  | "image"
  | "resource"
  | "canonical_declaration"
  | "robots_directive"
  | "robots_file"
  | "sitemap"
  | "structured_data"
  | "language"
  | "text_content_structural"
  | "timing"
  | "content_fingerprint"
  | "crawl_failure";

export type ImageAltState = "present" | "empty" | "absent";

export interface CrawlScope {
  allowedHosts: string[];
  allowedProtocols: Array<"http" | "https">;
  includePathPrefixes: string[];
  excludePathPrefixes: string[];
  environment: CrawlEnvironment;
}

export interface CrawlSource {
  id: string;
  kind: AdapterKind;
  label: string;
}

export interface CrawlObservation {
  id: string;
  kind: ObservationKind;
  sourceId: string;
  observedAt: string;
  originalUrl: string;
  normalisedUrl: string;
  scopeEnvironment: CrawlEnvironment;
  payload: Record<string, unknown>;
  idempotencyKey: string;
  /** Immutable once recorded */
  recordedAt: string;
}

export interface CrawlSnapshot {
  id: string;
  createdAt: string;
  label: string;
  observationIds: string[];
  /** Frozen copy of observation ids + kinds at snapshot time */
  factualSummary: Array<{ id: string; kind: ObservationKind; normalisedUrl: string }>;
  immutable: true;
}

export interface FactualChange {
  changeType: "added" | "removed" | "changed";
  field: string;
  before?: unknown;
  after?: unknown;
  observationId?: string;
}

export interface SnapshotComparison {
  id: string;
  createdAt: string;
  leftSnapshotId: string;
  rightSnapshotId: string;
  factualChanges: FactualChange[];
}

export interface CrawlJob {
  id: string;
  tenantId: string;
  websiteId?: string;
  propertyId?: string;
  status: CrawlJobStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  scope: CrawlScope;
  source: CrawlSource;
  observations: CrawlObservation[];
  snapshots: CrawlSnapshot[];
  comparisons: SnapshotComparison[];
  importKeys: string[];
}

export interface CreateCrawlJobInput {
  tenantId: string;
  websiteId?: string;
  propertyId?: string;
  scope: CrawlScope;
  source: Omit<CrawlSource, "id"> & { id?: string };
}
