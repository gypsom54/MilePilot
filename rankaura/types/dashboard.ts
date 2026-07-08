/**
 * Dashboard view models (presentation layer).
 * Maps from domain models via dashboard service — not used directly in UI logic.
 */

import type { EmployeeActivityStatus } from "@/types/models/ai-employee";

export type { EmployeeActivityStatus };

export interface DashboardBusinessProfile {
  name: string;
  industry: string;
  logoInitial: string;
}

/** @deprecated Use DashboardDailyBrief for Aurora Mission Control */
export interface DashboardHero {
  headline: string;
  improvementsCount: number;
  hoursSaved: number;
}

export interface DashboardDailyBrief {
  headline: string;
  summary: string;
  improvementsCount: number;
  managementTimeMinutes: number;
  hoursSaved: number;
}

export type MissionImpact = "high" | "medium" | "low";
export type MissionStatus = "pending" | "approved" | "deferred";

export interface DashboardMissionDepartment {
  id: string;
  name: string;
  contribution: string;
}

export interface DashboardMission {
  id: string;
  title: string;
  reason: string;
  impact: MissionImpact;
  confidence: number;
  timeRequiredMinutes: number;
  ctaLabel: string;
  status: MissionStatus;
  departments: DashboardMissionDepartment[];
  expectedOutcome: string;
  onApproveSummary: string;
}

export interface DashboardTeamMember {
  id: string;
  name: string;
  task: string;
  status: EmployeeActivityStatus;
  progress?: number;
}

export type DashboardGrowthTeamMember = DashboardTeamMember;

export type BusinessHealthStatus = "healthy" | "attention" | "critical";

export interface DashboardBusinessHealth {
  status: BusinessHealthStatus;
  label: string;
  summary: string;
  detail: string;
  changePercent: number;
}

export type TimelineEventType = "mission" | "team" | "system";

export interface DashboardTimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  type: TimelineEventType;
}

/** @deprecated Legacy dashboard sections — retained for backward compatibility */
export interface DashboardWin {
  id: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
}

/** @deprecated Legacy dashboard sections */
export interface DashboardOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedVisitors: string;
  potentialLeads: string;
  confidence: number;
  priority: "low" | "medium" | "high";
}

/** @deprecated Legacy dashboard sections */
export interface DashboardAutopilot {
  enabled: boolean;
  activities: string[];
  lastCompletedTask: string;
}

/** @deprecated Use DashboardBusinessHealth for Aurora Mission Control */
export interface DashboardMomentum {
  label: string;
  changePercent: number;
  progress: number;
  summary: string;
  detail: string;
}

/** Aurora Mission Control — primary dashboard payload */
export interface MissionControlData {
  business: DashboardBusinessProfile;
  greeting: string;
  dailyBrief: DashboardDailyBrief;
  todayMission: DashboardMission;
  growthTeam: DashboardGrowthTeamMember[];
  businessHealth: DashboardBusinessHealth;
  timelineEvents: DashboardTimelineEvent[];
}

/** @deprecated Use MissionControlData for Aurora Sprint 001+ */
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
