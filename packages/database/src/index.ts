/**
 * @seo-autopilot/database
 *
 * Sprint 1: Business Discovery schema + in-memory store.
 * Sprint 2: Market Intelligence schema + in-memory store.
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

export {
  MARKET_INTELLIGENCE_TABLES,
  MARKET_INTELLIGENCE_DDL,
  type MarketIntelligenceTable,
  type MarketRow,
  type MarketVersionRow,
} from "./market-intelligence/schema.js";

export {
  type MarketIntelligenceStore,
  InMemoryMarketIntelligenceStore,
} from "./market-intelligence/store.js";

export {
  WEBSITE_INTELLIGENCE_TABLES,
  WEBSITE_INTELLIGENCE_DDL,
  type WebsiteIntelligenceTable,
  type WebsiteRow,
  type WebsiteVersionRow,
} from "./website-intelligence/schema.js";

export {
  type WebsiteIntelligenceStore,
  InMemoryWebsiteIntelligenceStore,
} from "./website-intelligence/store.js";

export interface DatabaseClient {
  ping(): Promise<{ ok: boolean }>;
}

export const DATABASE_PACKAGE_STATUS = "website-intelligence-sprint3" as const;
