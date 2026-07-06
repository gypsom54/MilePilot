/**
 * Dashboard types for RankAura.
 * These will be populated by AuraCore and module services.
 */

export type ActivityStatus = "idle" | "working" | "complete";

export interface TeamMemberActivity {
  id: string;
  name: string;
  role: string;
  status: ActivityStatus;
  summary: string;
}

export interface Win {
  id: string;
  title: string;
  description: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface AutopilotState {
  enabled: boolean;
  label: string;
  description: string;
}

export interface GrowthMomentum {
  score: number;
  trend: "up" | "steady" | "down";
  summary: string;
}

export interface DashboardData {
  greeting: string;
  subheading: string;
  teamActivity: TeamMemberActivity[];
  momentum: GrowthMomentum;
  wins: Win[];
  opportunities: Opportunity[];
  autopilot: AutopilotState;
}
