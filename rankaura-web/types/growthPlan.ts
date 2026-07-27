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

/** Customer-facing status labels — richer than generic software wording. */
export const CATEGORY_STATUS_LABELS: Record<CategoryStatus, string> = {
  complete: "Research completed",
  in_progress: "Recommendations prepared",
  planned: "Coming next",
  monitoring: "Currently monitoring",
  waiting_for_approval: "Awaiting your approval",
};

export interface GrowthCategory {
  id: CategoryId;
  name: string;
  /** Subtle purpose line under the name */
  subtitle: string;
  /** Why this matters for the business */
  whyItMatters: string;
  /** Featured cards: one calm business outcome */
  businessImpact?: string;
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

export interface KeyDiscovery {
  id: string;
  text: string;
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

export interface GrowthTeamReadyContent {
  title: string;
  support: string;
  quietWork: string;
  strategyLine: string;
  promise: string;
  /** Reassurance checklist labels — human names, not technical IDs */
  checklist: string[];
}

export interface FinalReassuranceContent {
  title: string;
  support: string;
  closing: string;
}

export interface GrowthPlanData {
  site: SiteContext;
  header: GrowthPlanHeaderContent;
  confirmations: AnalysisConfirmationItem[];
  keyDiscoveries: KeyDiscovery[];
  growthTeam: GrowthTeamReadyContent;
  primaryOpportunity: PrimaryOpportunity;
  whatHappensNext: string[];
  categories: GrowthCategory[];
  finalReassurance: FinalReassuranceContent;
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
