export const WEBSITE_INTELLIGENCE_TABLES = [
  "websites",
  "website_versions",
] as const;

export type WebsiteIntelligenceTable =
  (typeof WEBSITE_INTELLIGENCE_TABLES)[number];

export const WEBSITE_INTELLIGENCE_DDL = `
CREATE TABLE websites (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  profile_json TEXT NOT NULL
);

CREATE TABLE website_versions (
  website_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (website_id, version)
);

CREATE INDEX websites_tenant_id_idx ON websites (tenant_id);
`;

export interface WebsiteRow {
  id: string;
  tenantId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  profileJson: string;
}

export interface WebsiteVersionRow {
  websiteId: string;
  version: number;
  snapshotJson: string;
  createdAt: string;
}
