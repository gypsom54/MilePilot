export type PageStatus = "published" | "draft" | "optimising" | "archived";

export interface Page {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  status: PageStatus;
  lastUpdatedAt: string;
  createdAt: string;
}
