import type { BusinessRow, ProfileVersionRow } from "./schema.js";

export interface BusinessDiscoveryStore {
  insertBusiness(row: BusinessRow): void;
  updateBusiness(row: BusinessRow): void;
  getBusiness(id: string): BusinessRow | undefined;
  listBusinesses(): BusinessRow[];
  insertVersion(row: ProfileVersionRow): void;
  listVersions(businessId: string): ProfileVersionRow[];
}

/**
 * In-memory Business Discovery store implementing the Sprint 1 schema.
 */
export class InMemoryBusinessDiscoveryStore implements BusinessDiscoveryStore {
  private readonly businesses = new Map<string, BusinessRow>();
  private readonly versions = new Map<string, ProfileVersionRow[]>();

  insertBusiness(row: BusinessRow): void {
    if (this.businesses.has(row.id)) {
      throw new Error(`Business already exists: ${row.id}`);
    }
    this.businesses.set(row.id, row);
  }

  updateBusiness(row: BusinessRow): void {
    if (!this.businesses.has(row.id)) {
      throw new Error(`Business not found: ${row.id}`);
    }
    this.businesses.set(row.id, row);
  }

  getBusiness(id: string): BusinessRow | undefined {
    return this.businesses.get(id);
  }

  listBusinesses(): BusinessRow[] {
    return [...this.businesses.values()];
  }

  insertVersion(row: ProfileVersionRow): void {
    const list = this.versions.get(row.businessId) ?? [];
    list.push(row);
    this.versions.set(row.businessId, list);
  }

  listVersions(businessId: string): ProfileVersionRow[] {
    return [...(this.versions.get(businessId) ?? [])];
  }
}
