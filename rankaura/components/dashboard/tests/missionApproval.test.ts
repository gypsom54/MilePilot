/**
 * Mission approval state tests — validates timeline update on approve.
 */

import { mockTodayMission, mockTimelineEvents } from "@/lib/mock-dashboard";
import type { DashboardMission, DashboardTimelineEvent } from "@/types/dashboard";

export function approveMission(
  mission: DashboardMission,
  timeline: DashboardTimelineEvent[],
): { mission: DashboardMission; timeline: DashboardTimelineEvent[] } {
  const updatedMission: DashboardMission = { ...mission, status: "approved" };
  const approvalEvent: DashboardTimelineEvent = {
    id: `evt-approved-test`,
    title: `Mission approved: ${mission.title}`,
    timestamp: "Just now",
    type: "mission",
  };

  return {
    mission: updatedMission,
    timeline: [approvalEvent, ...timeline],
  };
}

export function runMissionApprovalTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const result = approveMission(mockTodayMission, mockTimelineEvents);
  assert(result.mission.status === "approved");
  assert(result.timeline[0].title.includes("Mission approved"));
  assert(result.timeline[0].type === "mission");
  assert(result.timeline.length === mockTimelineEvents.length + 1);

  return { passed, failed };
}
