/**
 * Dashboard view models (presentation layer).
 * Maps from domain models via dashboardService — not used directly in UI logic.
 */

import type { EmployeeActivityStatus } from "@/types/models/ai-employee";

export type { EmployeeActivityStatus };

export interface DashboardBusinessProfile {
  name: string;
  industry: string;
  logoInitial: string;
}

export interface DashboardHero {
  headline: string;
  improvementsCount: number;
  hoursSaved: number;
}

export interface DashboardTeamMember {
  id: string;
  name: string;
  task: string;
  status: EmployeeActivityStatus;
  progress?: number;
}

export interface DashboardWin {
  id: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
}

export interface DashboardOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedVisitors: string;
  potentialLeads: string;
  confidence: number;
  priority: "low" | "medium" | "high";
}

export interface DashboardAutopilot {
  enabled: boolean;
  activities: string[];
  lastCompletedTask: string;
}

export interface DashboardMomentum {
  label: string;
  changePercent: number;
  progress: number;
  summary: string;
  detail: string;
}

export interface DashboardData {
  business: DashboardBusinessProfile;
  greeting: string;
  hero: DashboardHero;
  teamActivity: DashboardTeamMember[];
  momentum: DashboardMomentum;
  wins: DashboardWin[];
  opportunities: DashboardOpportunity[];
  autopilot: DashboardAutopilot;
}
