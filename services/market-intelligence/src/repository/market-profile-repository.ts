import type { MarketIntelligenceStore } from "@seo-autopilot/database";
import type { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type { MarketProfile } from "../domain/types.js";
import { syncMarketProfileToKnowledgeGraph } from "../knowledge-graph/sync.js";

export class MarketProfileRepository {
  constructor(
    private readonly store: MarketIntelligenceStore,
    private readonly graph: InMemoryKnowledgeGraph,
  ) {}

  async saveNew(profile: MarketProfile): Promise<EngineResult<MarketProfile>> {
    this.store.insertMarket({
      id: profile.id,
      tenantId: profile.tenantId,
      version: profile.version,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      profileJson: JSON.stringify(profile),
    });
    this.store.insertVersion({
      marketId: profile.id,
      version: profile.version,
      snapshotJson: JSON.stringify(profile),
      createdAt: profile.updatedAt,
    });
    await syncMarketProfileToKnowledgeGraph(this.graph, profile);
    return ok(profile);
  }

  async saveVersioned(
    profile: MarketProfile,
  ): Promise<EngineResult<MarketProfile>> {
    const existing = this.store.getMarket(profile.id);
    if (!existing) {
      return err({
        code: "MARKET_NOT_FOUND",
        message: `Market not found: ${profile.id}`,
        retryable: false,
      });
    }
    if (existing.tenantId !== profile.tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Cannot mutate a market across tenants",
        retryable: false,
      });
    }

    const next: MarketProfile = {
      ...profile,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    };

    this.store.updateMarket({
      id: next.id,
      tenantId: next.tenantId,
      version: next.version,
      createdAt: next.createdAt,
      updatedAt: next.updatedAt,
      profileJson: JSON.stringify(next),
    });
    this.store.insertVersion({
      marketId: next.id,
      version: next.version,
      snapshotJson: JSON.stringify(next),
      createdAt: next.updatedAt,
    });
    await syncMarketProfileToKnowledgeGraph(this.graph, next);
    return ok(next);
  }

  get(id: string, tenantId?: string): EngineResult<MarketProfile> {
    const row = this.store.getMarket(id);
    if (!row) {
      return err({
        code: "MARKET_NOT_FOUND",
        message: `Market not found: ${id}`,
        retryable: false,
      });
    }
    if (tenantId !== undefined && row.tenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Market is not visible to this tenant",
        retryable: false,
      });
    }
    return ok(JSON.parse(row.profileJson) as MarketProfile);
  }

  listByTenant(tenantId: string): MarketProfile[] {
    return this.store
      .listMarketsByTenant(tenantId)
      .map((row) => JSON.parse(row.profileJson) as MarketProfile);
  }

  listVersions(marketId: string): number[] {
    return this.store.listVersions(marketId).map((row) => row.version);
  }
}
