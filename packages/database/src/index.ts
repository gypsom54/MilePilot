/**
 * @seo-autopilot/database
 *
 * Sprint 1: Business Discovery schema + in-memory store.
 * No SEO persistence. No auth UI.
 */

export {
  BUSINESS_DISCOVERY_TABLES,
  BUSINESS_DISCOVERY_DDL,
  type BusinessDiscoveryTable,
  type BusinessRow,
  type ProfileVersionRow,
} from "./business-discovery/schema.js";

export {
  type BusinessDiscoveryStore,
  InMemoryBusinessDiscoveryStore,
} from "./business-discovery/store.js";

export interface DatabaseClient {
  ping(): Promise<{ ok: boolean }>;
}

export const DATABASE_PACKAGE_STATUS = "business-discovery-sprint1" as const;
