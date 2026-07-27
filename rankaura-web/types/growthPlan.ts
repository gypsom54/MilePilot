/**
 * RankAura Growth Plan / Launch Plan domain types.
 * Extensible site-state model — UI currently exposes only existing | new.
 */

export type SiteStateFamily = "existing" | "new";

export type SiteState =
  | "existing"
  | "existing_needs_access"
  | "existing_limited_scan"
  | "new"
  | "new_pre_launch"
  | "new_site_live";

export interface SiteContext {
  family: SiteStateFamily;
  state: SiteState;
  flags?: {
    hasWebsiteAccess?: boolean;
    scanDepth?: "full" | "limited" | "none";
    siteLive?: boolean;
  };
}

export type CategoryStatus =
  | "complete"
  | "in_progress"
  | "planned"
  | "monitoring"
  | "waiting_for_approval";

export type CategoryId =
  | "website_health"
  | "keyword_strategy"
  | "competitor_intelligence"
  | "content_strategy"
  | "reddit_community"
  | "local_seo"
  | "authority_building"
  | "digital_pr"
  | "social_media"
  | "reviews_reputation"
  | "analytics_tracking"
  | "ai_monitoring"
  | "business_intelligence";

export const CATEGORY_STATUS_LABELS: Record<CategoryStatus, string> = {
  complete: "Complete",
  in_progress: "In Progress",
  planned: "Planned",
  monitoring: "Monitoring",
  waiting_for_approval: "Waiting for Approval",
};

export interface GrowthCategory {
  id: CategoryId;
  name: string;
  /** One short plain-English summary for collapsed card */
  summary: string;
  status: CategoryStatus;
  /** Optional meaningful count (opportunities, findings, etc.) */
  count?: number;
  relevanceScore: number;
  /** Lower = earlier in display order */
  displayPriority: number;
  featured: boolean;
  applicable: boolean;
  discovered: string;
  completed: string;
  next: string;
  /** Only when genuine customer input is required */
  yourAction?: string;
  primaryAction?: string;
}

export interface AnalysisConfirmationItem {
  id: string;
  label: string;
  done: boolean;
}

export interface PrimaryOpportunity {
  title: string;
  support: string;
  actionLabel: string;
}

export interface GrowthPlanHeaderContent {
  businessName: string;
  title: string;
  support: string;
}

export interface GrowthPlanData {
  site: SiteContext;
  header: GrowthPlanHeaderContent;
  confirmations: AnalysisConfirmationItem[];
  primaryOpportunity: PrimaryOpportunity;
  whatHappensNext: string[];
  categories: GrowthCategory[];
}

export interface GrowthPlanDataProvider {
  getGrowthPlan(siteFamily: SiteStateFamily): Promise<GrowthPlanData> | GrowthPlanData;
}

/** Map coarse review query to family; default existing. */
export function parseSiteQuery(value: string | string[] | undefined): SiteStateFamily {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "new") return "new";
  return "existing";
}

export function sortCategories(categories: GrowthCategory[]): GrowthCategory[] {
  return [...categories].sort((a, b) => {
    if (a.applicable !== b.applicable) return a.applicable ? -1 : 1;
    if (a.displayPriority !== b.displayPriority) {
      return a.displayPriority - b.displayPriority;
    }
    return b.relevanceScore - a.relevanceScore;
  });
}

export function featuredCategories(categories: GrowthCategory[]): GrowthCategory[] {
  return sortCategories(categories.filter((c) => c.featured && c.applicable));
}

export function remainingCategories(categories: GrowthCategory[]): GrowthCategory[] {
  return sortCategories(categories.filter((c) => !c.featured || !c.applicable));
}
