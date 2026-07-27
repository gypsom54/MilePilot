/**
 * RankAura Workspace domain types — final polish.
 */

export type FeaturedItemVariant =
  | "opportunity"
  | "review"
  | "approval"
  | "celebration"
  | "reminder"
  | "milestone";

export type ProgressItemType =
  | "opportunity"
  | "completed"
  | "research"
  | "competitor"
  | "recommendation"
  | "approval"
  | "milestone";

export interface WorkspaceWelcome {
  firstName: string;
  businessName: string;
  greeting: string;
  support: string;
  /** Quiet secondary reassurance — not a metric wall */
  monitoringLine: string;
  activitySummary: string;
}

export interface BiggestOpportunity {
  variant: FeaturedItemVariant;
  title: string;
  support: string;
  actionLabel: string;
  href?: string;
}

export interface RecentWin {
  id: string;
  text: string;
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
  actionLabel: string;
  href: string;
}

export interface RecentProgressItem {
  id: string;
  type: ProgressItemType;
  title: string;
  body: string;
  timestampLabel: string;
  actionLabel?: string;
  href?: string;
}

export interface WorkspaceData {
  welcome: WorkspaceWelcome;
  biggestOpportunity: BiggestOpportunity;
  recentWins: RecentWin[];
  sinceLastVisit: CompletedActivity[];
  growthAreas: WorkspaceGrowthArea[];
  recentProgress: RecentProgressItem[];
}

export interface WorkspaceDataProvider {
  getWorkspaceData(): Promise<WorkspaceData> | WorkspaceData;
}

export const FEATURED_VARIANT_LABELS: Record<FeaturedItemVariant, string> = {
  opportunity: "Today's biggest opportunity",
  review: "Worth reviewing",
  approval: "Ready for your approval",
  celebration: "A win worth noticing",
  reminder: "Gentle reminder",
  milestone: "Milestone reached",
};

export const PROGRESS_TYPE_LABELS: Record<ProgressItemType, string> = {
  opportunity: "New opportunity",
  completed: "Work completed",
  research: "Research completed",
  competitor: "Competitor update",
  recommendation: "Recommendation prepared",
  approval: "Approval needed",
  milestone: "Milestone reached",
};
