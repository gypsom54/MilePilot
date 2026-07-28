export const CRAWL_INTELLIGENCE_TABLES = [
  "crawl_jobs",
  "crawl_job_versions",
] as const;

export type CrawlIntelligenceTable =
  (typeof CRAWL_INTELLIGENCE_TABLES)[number];

export const CRAWL_INTELLIGENCE_DDL = `
CREATE TABLE crawl_jobs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  profile_json TEXT NOT NULL
);

CREATE TABLE crawl_job_versions (
  job_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (job_id, version)
);
`;

export interface CrawlJobRow {
  id: string;
  tenantId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  profileJson: string;
}

export interface CrawlJobVersionRow {
  jobId: string;
  version: number;
  snapshotJson: string;
  createdAt: string;
}
