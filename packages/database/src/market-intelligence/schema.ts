/**
 * Market Intelligence database schema (Volume 5 / Sprint 2).
 * Logical tables — Sprint 2 uses an in-memory store.
 */

export const MARKET_INTELLIGENCE_TABLES = [
  "markets",
  "market_versions",
] as const;

export type MarketIntelligenceTable =
  (typeof MARKET_INTELLIGENCE_TABLES)[number];

export const MARKET_INTELLIGENCE_DDL = `
CREATE TABLE markets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  profile_json TEXT NOT NULL
);

CREATE TABLE market_versions (
  market_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (market_id, version)
);

CREATE INDEX markets_tenant_id_idx ON markets (tenant_id);
`;

export interface MarketRow {
  id: string;
  tenantId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  profileJson: string;
}

export interface MarketVersionRow {
  marketId: string;
  version: number;
  snapshotJson: string;
  createdAt: string;
}
