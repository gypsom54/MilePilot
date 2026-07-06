/**
 * Dashboard types for RankAura.
 * These will be populated by AuraCore and module services.
 */

export type ActivityStatus = "working" | "idle" | "complete";

export interface BusinessProfile {
  name: string;
  industry: string;
  logoInitial: string;
}

export interface HeroSummary {
  headline: string;
  improvementsCount: number;
  hoursSaved: number;
}

export interface TeamMemberActivity {
  id: string;
  name: string;
  task: string;
  status: ActivityStatus;
  /** 0–100, shown as a subtle progress indicator when active */
  progress?: number;
}

export interface Win {
  id: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  estimatedVisitors: string;
  potentialLeads: string;
  confidence: number;
  priority: "low" | "medium" | "high";
}

export interface AutopilotState {
  enabled: boolean;
  activities: string[];
  lastCompletedTask: string;
}

export interface GrowthMomentum {
  label: string;
  changePercent: number;
  progress: number;
  summary: string;
  detail: string;
}

export interface DashboardData {
  business: BusinessProfile;
  greeting: string;
  hero: HeroSummary;
  teamActivity: TeamMemberActivity[];
  momentum: GrowthMomentum;
  wins: Win[];
  opportunities: Opportunity[];
  autopilot: AutopilotState;
}
