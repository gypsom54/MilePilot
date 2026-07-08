/**
 * Mission approval state tests — validates timeline update on approve.
 */

import { approveMission, MISSION_APPROVAL_CONFIRMATION } from "@/lib/mission-review";
import { mockTodayMission, mockTimelineEvents } from "@/lib/mock-dashboard";

export function runMissionApprovalTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const result = approveMission(mockTodayMission, mockTimelineEvents);
  assert(result.mission.status === "approved");
  assert(result.timeline[0].title === "Mission approved: Research Storage Conditions Guide");
  assert(result.timeline[0].type === "mission");
  assert(result.timeline[0].timestamp === "Just now");
  assert(result.timeline.length === mockTimelineEvents.length + 1);
  assert(result.confirmationMessage === MISSION_APPROVAL_CONFIRMATION);

  return { passed, failed };
}
