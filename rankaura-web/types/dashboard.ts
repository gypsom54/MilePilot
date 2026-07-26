/**
 * RankAura dashboard domain types.
 * Shared by mock and future live providers.
 */

export type NavId =
  | "dashboard"
  | "ai-team"
  | "growth"
  | "content"
  | "website"
  | "settings";

export interface BusinessIdentity {
  name: string;
  industry: string;
  ownerFirstName: string;
  ownerInitial: string;
}

export interface PriorityMission {
  label: string;
  title: string;
  ctaLabel: string;
}

export interface TodaysMission {
  title: string;
  support: string;
  description: string;
}

export interface AiTeamStatus {
  statusLabel: string;
  summary: string;
  agentsActive: number;
}

export interface WebsiteHealth {
  statusLabel: string;
  summary: string;
  score: number;
}

export interface GrowthOpportunity {
  title: string;
  summary: string;
}

export interface GrowthOpportunities {
  count: number;
  highlight: GrowthOpportunity;
  items: GrowthOpportunity[];
}

export interface EveningBrief {
  /** e.g. "Good evening Jonathan" — time-of-day handled by provider */
  greeting: string;
  improvementsToday: number;
  hoursSaved: number;
  /** Preformatted stats line matching locked UI */
  statsLine: string;
  priorityMission: PriorityMission;
}

export interface DashboardData {
  business: BusinessIdentity;
  brief: EveningBrief;
  todaysMission: TodaysMission;
  aiTeam: AiTeamStatus;
  websiteHealth: WebsiteHealth;
  growthOpportunities: GrowthOpportunities;
  activeNav: NavId;
  navItems: { id: NavId; label: string }[];
}

export interface DashboardDataProvider {
  getDashboardData(): Promise<DashboardData> | DashboardData;
}
