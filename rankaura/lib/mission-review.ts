/**
 * Mission Review — shared approval logic and copy (mock/local state only).
 */

import type { DashboardMission, DashboardTimelineEvent } from "@/types/dashboard";

export const MISSION_APPROVAL_CONFIRMATION =
  "Mission approved. Your Growth Team will continue the work.";

export function getApprovalTimelineTitle(mission: DashboardMission): string {
  const label = mission.timelineApprovalTitle ?? mission.title;
  return `Mission approved: ${label}`;
}

export function createApprovalTimelineEvent(
  mission: DashboardMission,
): DashboardTimelineEvent {
  return {
    id: `evt-approved-${Date.now()}`,
    title: getApprovalTimelineTitle(mission),
    timestamp: "Just now",
    type: "mission",
  };
}

export interface MissionApprovalResult {
  mission: DashboardMission;
  timeline: DashboardTimelineEvent[];
  confirmationMessage: string;
}

export function approveMission(
  mission: DashboardMission,
  timeline: DashboardTimelineEvent[],
): MissionApprovalResult {
  return {
    mission: { ...mission, status: "approved" },
    timeline: [createApprovalTimelineEvent(mission), ...timeline],
    confirmationMessage: MISSION_APPROVAL_CONFIRMATION,
  };
}

export function deferMission(mission: DashboardMission): DashboardMission {
  return { ...mission, status: "deferred" };
}
