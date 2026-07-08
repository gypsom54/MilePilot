/**
 * Mission card logic tests — validates mission data shape used by MissionCard.
 */

import { mockTodayMission } from "@/lib/mock-dashboard";
import type { DashboardMission } from "@/types/dashboard";

export function getMissionCardDisplay(mission: DashboardMission) {
  return {
    title: mission.title,
    isActionable: mission.status === "pending",
    showApprovedMessage: mission.status === "approved",
    ctaLabel: mission.ctaLabel,
  };
}

export function runMissionCardTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const pending = getMissionCardDisplay(mockTodayMission);
  assert(pending.title === "Create Research Storage Conditions Guide");
  assert(pending.isActionable === true);
  assert(pending.ctaLabel === "Review Mission");

  const approved = getMissionCardDisplay({ ...mockTodayMission, status: "approved" });
  assert(approved.isActionable === false);
  assert(approved.showApprovedMessage === true);

  return { passed, failed };
}
