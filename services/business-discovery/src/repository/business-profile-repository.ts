import type { BusinessDiscoveryStore } from "@seo-autopilot/database";
import type { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import type { EngineResult } from "@seo-autopilot/shared";
import { err, ok } from "@seo-autopilot/shared";
import type { BusinessProfile } from "../domain/types.js";
import { syncBusinessProfileToKnowledgeGraph } from "../knowledge-graph/sync.js";

export class BusinessProfileRepository {
  constructor(
    private readonly store: BusinessDiscoveryStore,
    private readonly graph: InMemoryKnowledgeGraph,
  ) {}

  async saveNew(profile: BusinessProfile): Promise<EngineResult<BusinessProfile>> {
    this.store.insertBusiness({
      id: profile.id,
      version: profile.version,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      profileJson: JSON.stringify(profile),
    });
    this.store.insertVersion({
      businessId: profile.id,
      version: profile.version,
      snapshotJson: JSON.stringify(profile),
      createdAt: profile.updatedAt,
    });
    await syncBusinessProfileToKnowledgeGraph(this.graph, profile);
    return ok(profile);
  }

  async saveVersioned(
    profile: BusinessProfile,
  ): Promise<EngineResult<BusinessProfile>> {
    const existing = this.store.getBusiness(profile.id);
    if (!existing) {
      return err({
        code: "BUSINESS_NOT_FOUND",
        message: `Business not found: ${profile.id}`,
        retryable: false,
      });
    }

    const next: BusinessProfile = {
      ...profile,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    };

    this.store.updateBusiness({
      id: next.id,
      version: next.version,
      createdAt: next.createdAt,
      updatedAt: next.updatedAt,
      profileJson: JSON.stringify(next),
    });
    this.store.insertVersion({
      businessId: next.id,
      version: next.version,
      snapshotJson: JSON.stringify(next),
      createdAt: next.updatedAt,
    });
    await syncBusinessProfileToKnowledgeGraph(this.graph, next);
    return ok(next);
  }

  get(id: string): EngineResult<BusinessProfile> {
    const row = this.store.getBusiness(id);
    if (!row) {
      return err({
        code: "BUSINESS_NOT_FOUND",
        message: `Business not found: ${id}`,
        retryable: false,
      });
    }
    return ok(JSON.parse(row.profileJson) as BusinessProfile);
  }

  list(): BusinessProfile[] {
    return this.store
      .listBusinesses()
      .map((row) => JSON.parse(row.profileJson) as BusinessProfile);
  }

  listVersions(businessId: string): number[] {
    return this.store.listVersions(businessId).map((row) => row.version);
  }
}
