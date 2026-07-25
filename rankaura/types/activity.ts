/**
 * AI Activity Engine types — Aurora Sprint 004.
 */

export type DepartmentActivityState =
  | "idle"
  | "researching"
  | "writing"
  | "reviewing"
  | "waiting"
  | "complete";

export interface DepartmentActivity {
  id: string;
  name: string;
  state: DepartmentActivityState;
  stateLabel: string;
  activityText: string;
  progress: number;
  isActive: boolean;
  color: string;
}

export interface ActivityTimelineEvent {
  id: string;
  departmentId: string;
  departmentName: string;
  departmentColor: string;
  message: string;
  timestamp: string;
  createdAt: number;
}

export interface BusinessSnapshotData {
  growthPercent: number;
  estimatedLeads: string;
  visibilityTrend: string;
  hoursSaved: number;
  pendingReviews: number;
  statusLabel: string;
}

export type BriefPeriod = "morning" | "evening";

export interface MorningBriefData {
  period: BriefPeriod;
  title: string;
  greeting: string;
  improvementsCount: number;
  hoursSaved: number;
  priorityMissionTitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ActivityEngineState {
  departments: DepartmentActivity[];
  timeline: ActivityTimelineEvent[];
  tick: number;
}
