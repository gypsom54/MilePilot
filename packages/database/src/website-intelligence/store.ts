import type { WebsiteRow, WebsiteVersionRow } from "./schema.js";

export interface WebsiteIntelligenceStore {
  insertWebsite(row: WebsiteRow): void;
  updateWebsite(row: WebsiteRow): void;
  getWebsite(id: string): WebsiteRow | undefined;
  listWebsitesByTenant(tenantId: string): WebsiteRow[];
  insertVersion(row: WebsiteVersionRow): void;
  listVersions(websiteId: string): WebsiteVersionRow[];
}

export class InMemoryWebsiteIntelligenceStore
  implements WebsiteIntelligenceStore
{
  private readonly websites = new Map<string, WebsiteRow>();
  private readonly versions = new Map<string, WebsiteVersionRow[]>();

  insertWebsite(row: WebsiteRow): void {
    if (this.websites.has(row.id)) {
      throw new Error(`Website already exists: ${row.id}`);
    }
    this.websites.set(row.id, row);
  }

  updateWebsite(row: WebsiteRow): void {
    if (!this.websites.has(row.id)) {
      throw new Error(`Website not found: ${row.id}`);
    }
    this.websites.set(row.id, row);
  }

  getWebsite(id: string): WebsiteRow | undefined {
    return this.websites.get(id);
  }

  listWebsitesByTenant(tenantId: string): WebsiteRow[] {
    return [...this.websites.values()].filter(
      (row) => row.tenantId === tenantId,
    );
  }

  insertVersion(row: WebsiteVersionRow): void {
    const list = this.versions.get(row.websiteId) ?? [];
    list.push(row);
    this.versions.set(row.websiteId, list);
  }

  listVersions(websiteId: string): WebsiteVersionRow[] {
    return [...(this.versions.get(websiteId) ?? [])];
  }
}
