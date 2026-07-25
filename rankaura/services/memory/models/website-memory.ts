/**
 * Website structure and platform memory.
 */

export interface WebsiteMemory {
  websiteId: string;
  url: string;
  platform: string | null;
  pageCount: number;
  primaryPages: WebsitePageSummary[];
  lastSyncedAt: string | null;
  updatedAt: string;
}

export interface WebsitePageSummary {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "optimising";
}
