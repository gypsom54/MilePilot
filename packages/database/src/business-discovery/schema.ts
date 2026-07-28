/**
 * Business Discovery database schema (Volume 4 / Sprint 1).
 * Logical tables — Sprint 1 uses an in-memory store implementing this schema.
 * No SEO tables.
 */

export const BUSINESS_DISCOVERY_TABLES = [
  "businesses",
  "identity_fields",
  "brand_profiles",
  "offers",
  "locations",
  "audience_profiles",
  "goals",
  "expertise_nodes",
  "team_members",
  "trust_signals",
  "digital_assets",
  "competitor_seeds",
  "customer_questions",
  "constraints",
  "preferences",
  "enrichment_suggestions",
  "profile_versions",
] as const;

export type BusinessDiscoveryTable =
  (typeof BUSINESS_DISCOVERY_TABLES)[number];

/**
 * SQL DDL reference for future durable adapters.
 * Sprint 1 does not execute this against a live RDBMS.
 */
export const BUSINESS_DISCOVERY_DDL = `
CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  profile_json TEXT NOT NULL
);

CREATE TABLE profile_versions (
  business_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (business_id, version)
);
`;

export interface BusinessRow {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  profileJson: string;
}

export interface ProfileVersionRow {
  businessId: string;
  version: number;
  snapshotJson: string;
  createdAt: string;
}
