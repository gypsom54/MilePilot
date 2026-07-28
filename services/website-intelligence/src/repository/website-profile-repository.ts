import type { WebsiteIntelligenceStore } from "@seo-autopilot/database";
import type { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type { WebsiteProfile } from "../domain/types.js";
import { syncWebsiteProfileToKnowledgeGraph } from "../knowledge-graph/sync.js";

export class WebsiteProfileRepository {
  constructor(
    private readonly store: WebsiteIntelligenceStore,
    private readonly graph: InMemoryKnowledgeGraph,
  ) {}

  async saveNew(profile: WebsiteProfile): Promise<EngineResult<WebsiteProfile>> {
    this.store.insertWebsite({
      id: profile.id,
      tenantId: profile.tenantId,
      version: profile.version,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      profileJson: JSON.stringify(profile),
    });
    this.store.insertVersion({
      websiteId: profile.id,
      version: profile.version,
      snapshotJson: JSON.stringify(profile),
      createdAt: profile.updatedAt,
    });
    await syncWebsiteProfileToKnowledgeGraph(this.graph, profile);
    return ok(profile);
  }

  async saveVersioned(
    profile: WebsiteProfile,
  ): Promise<EngineResult<WebsiteProfile>> {
    const existing = this.store.getWebsite(profile.id);
    if (!existing) {
      return err({
        code: "WEBSITE_NOT_FOUND",
        message: `Website not found: ${profile.id}`,
        retryable: false,
      });
    }
    if (existing.tenantId !== profile.tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Cannot mutate a website across tenants",
        retryable: false,
      });
    }

    const next: WebsiteProfile = {
      ...profile,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    };

    this.store.updateWebsite({
      id: next.id,
      tenantId: next.tenantId,
      version: next.version,
      createdAt: next.createdAt,
      updatedAt: next.updatedAt,
      profileJson: JSON.stringify(next),
    });
    this.store.insertVersion({
      websiteId: next.id,
      version: next.version,
      snapshotJson: JSON.stringify(next),
      createdAt: next.updatedAt,
    });
    await syncWebsiteProfileToKnowledgeGraph(this.graph, next);
    return ok(next);
  }

  get(id: string, tenantId?: string): EngineResult<WebsiteProfile> {
    const row = this.store.getWebsite(id);
    if (!row) {
      return err({
        code: "WEBSITE_NOT_FOUND",
        message: `Website not found: ${id}`,
        retryable: false,
      });
    }
    if (tenantId !== undefined && row.tenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Website is not visible to this tenant",
        retryable: false,
      });
    }
    return ok(JSON.parse(row.profileJson) as WebsiteProfile);
  }

  listByTenant(tenantId: string): WebsiteProfile[] {
    return this.store
      .listWebsitesByTenant(tenantId)
      .map((row) => JSON.parse(row.profileJson) as WebsiteProfile);
  }

  listVersions(websiteId: string): number[] {
    return this.store.listVersions(websiteId).map((row) => row.version);
  }
}
