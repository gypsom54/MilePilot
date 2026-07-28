import type { CrawlIntelligenceStore } from "@seo-autopilot/database";
import type { InMemoryKnowledgeGraph } from "@seo-autopilot/knowledge-graph";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type { CrawlJob } from "../domain/types.js";
import { syncCrawlJobToKnowledgeGraph } from "../knowledge-graph/sync.js";

export class CrawlJobRepository {
  constructor(
    private readonly store: CrawlIntelligenceStore,
    private readonly graph: InMemoryKnowledgeGraph,
  ) {}

  async saveNew(job: CrawlJob): Promise<EngineResult<CrawlJob>> {
    this.store.insertJob({
      id: job.id,
      tenantId: job.tenantId,
      version: job.version,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      profileJson: JSON.stringify(job),
    });
    this.store.insertVersion({
      jobId: job.id,
      version: job.version,
      snapshotJson: JSON.stringify(job),
      createdAt: job.updatedAt,
    });
    await syncCrawlJobToKnowledgeGraph(this.graph, job);
    return ok(job);
  }

  async saveVersioned(job: CrawlJob): Promise<EngineResult<CrawlJob>> {
    const existing = this.store.getJob(job.id);
    if (!existing) {
      return err({
        code: "CRAWL_JOB_NOT_FOUND",
        message: `Crawl job not found: ${job.id}`,
        retryable: false,
      });
    }
    if (existing.tenantId !== job.tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Cannot mutate a crawl job across tenants",
        retryable: false,
      });
    }
    const next: CrawlJob = {
      ...job,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    };
    this.store.updateJob({
      id: next.id,
      tenantId: next.tenantId,
      version: next.version,
      createdAt: next.createdAt,
      updatedAt: next.updatedAt,
      profileJson: JSON.stringify(next),
    });
    this.store.insertVersion({
      jobId: next.id,
      version: next.version,
      snapshotJson: JSON.stringify(next),
      createdAt: next.updatedAt,
    });
    await syncCrawlJobToKnowledgeGraph(this.graph, next);
    return ok(next);
  }

  get(id: string, tenantId?: string): EngineResult<CrawlJob> {
    const row = this.store.getJob(id);
    if (!row) {
      return err({
        code: "CRAWL_JOB_NOT_FOUND",
        message: `Crawl job not found: ${id}`,
        retryable: false,
      });
    }
    if (tenantId !== undefined && row.tenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Crawl job is not visible to this tenant",
        retryable: false,
      });
    }
    return ok(JSON.parse(row.profileJson) as CrawlJob);
  }

  listByTenant(tenantId: string): CrawlJob[] {
    return this.store
      .listJobsByTenant(tenantId)
      .map((row) => JSON.parse(row.profileJson) as CrawlJob);
  }

  listVersions(jobId: string): number[] {
    return this.store.listVersions(jobId).map((row) => row.version);
  }
}
