export type WebsiteStatus = "connected" | "pending" | "disconnected";

export interface Website {
  id: string;
  businessId: string;
  url: string;
  platform: string | null;
  status: WebsiteStatus;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
