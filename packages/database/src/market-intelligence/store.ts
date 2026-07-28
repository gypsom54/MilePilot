import type { MarketRow, MarketVersionRow } from "./schema.js";

export interface MarketIntelligenceStore {
  insertMarket(row: MarketRow): void;
  updateMarket(row: MarketRow): void;
  getMarket(id: string): MarketRow | undefined;
  listMarketsByTenant(tenantId: string): MarketRow[];
  insertVersion(row: MarketVersionRow): void;
  listVersions(marketId: string): MarketVersionRow[];
}

export class InMemoryMarketIntelligenceStore implements MarketIntelligenceStore {
  private readonly markets = new Map<string, MarketRow>();
  private readonly versions = new Map<string, MarketVersionRow[]>();

  insertMarket(row: MarketRow): void {
    if (this.markets.has(row.id)) {
      throw new Error(`Market already exists: ${row.id}`);
    }
    this.markets.set(row.id, row);
  }

  updateMarket(row: MarketRow): void {
    if (!this.markets.has(row.id)) {
      throw new Error(`Market not found: ${row.id}`);
    }
    this.markets.set(row.id, row);
  }

  getMarket(id: string): MarketRow | undefined {
    return this.markets.get(id);
  }

  listMarketsByTenant(tenantId: string): MarketRow[] {
    return [...this.markets.values()].filter((row) => row.tenantId === tenantId);
  }

  insertVersion(row: MarketVersionRow): void {
    const list = this.versions.get(row.marketId) ?? [];
    list.push(row);
    this.versions.set(row.marketId, list);
  }

  listVersions(marketId: string): MarketVersionRow[] {
    return [...(this.versions.get(marketId) ?? [])];
  }
}
