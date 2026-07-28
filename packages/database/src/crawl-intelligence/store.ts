import type { CrawlJobRow, CrawlJobVersionRow } from "./schema.js";

export interface CrawlIntelligenceStore {
  insertJob(row: CrawlJobRow): void;
  updateJob(row: CrawlJobRow): void;
  getJob(id: string): CrawlJobRow | undefined;
  listJobsByTenant(tenantId: string): CrawlJobRow[];
  insertVersion(row: CrawlJobVersionRow): void;
  listVersions(jobId: string): CrawlJobVersionRow[];
}

export class InMemoryCrawlIntelligenceStore implements CrawlIntelligenceStore {
  private readonly jobs = new Map<string, CrawlJobRow>();
  private readonly versions = new Map<string, CrawlJobVersionRow[]>();

  insertJob(row: CrawlJobRow): void {
    if (this.jobs.has(row.id)) throw new Error(`Crawl job exists: ${row.id}`);
    this.jobs.set(row.id, row);
  }

  updateJob(row: CrawlJobRow): void {
    if (!this.jobs.has(row.id)) throw new Error(`Crawl job missing: ${row.id}`);
    this.jobs.set(row.id, row);
  }

  getJob(id: string): CrawlJobRow | undefined {
    return this.jobs.get(id);
  }

  listJobsByTenant(tenantId: string): CrawlJobRow[] {
    return [...this.jobs.values()].filter((row) => row.tenantId === tenantId);
  }

  insertVersion(row: CrawlJobVersionRow): void {
    const list = this.versions.get(row.jobId) ?? [];
    list.push(row);
    this.versions.set(row.jobId, list);
  }

  listVersions(jobId: string): CrawlJobVersionRow[] {
    return [...(this.versions.get(jobId) ?? [])];
  }
}
