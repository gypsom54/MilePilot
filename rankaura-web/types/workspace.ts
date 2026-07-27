/**
 * RankAura Workspace domain types — Phase 4 static prototype.
 */

export type FeedItemType =
  | "competitor"
  | "research"
  | "opportunity"
  | "content"
  | "monitoring";

export interface WorkspaceWelcome {
  firstName: string;
  businessName: string;
  greeting: string;
  support: string;
  activitySummary: string;
}

export interface BiggestOpportunity {
  title: string;
  support: string;
  actionLabel: string;
  href?: string;
}

export interface CompletedActivity {
  id: string;
  text: string;
  completedAtLabel: string;
}

export interface WorkspaceGrowthArea {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  impact: string;
  href: string;
}

export interface BusinessFeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  body: string;
  timestampLabel: string;
}

export interface WorkspaceData {
  welcome: WorkspaceWelcome;
  biggestOpportunity: BiggestOpportunity;
  sinceLastVisit: CompletedActivity[];
  growthAreas: WorkspaceGrowthArea[];
  businessFeed: BusinessFeedItem[];
}

export interface WorkspaceDataProvider {
  getWorkspaceData(): Promise<WorkspaceData> | WorkspaceData;
}

export const FEED_TYPE_LABELS: Record<FeedItemType, string> = {
  competitor: "Competitor update",
  research: "Research completed",
  opportunity: "New opportunity",
  content: "Content idea",
  monitoring: "Monitoring update",
};
