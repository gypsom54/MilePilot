import { getStateLabel } from "@/services/activity/activityEngine";
import { mockMissionWorkspace } from "@/lib/mock-mission";
import { MissionStatusBadge } from "@/components/mission-workspace/MissionStatusBadge";
import { MetricBadge } from "@/components/mission-workspace/MetricBadge";

export function runMissionComponentTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(typeof MissionStatusBadge === "function");
  assert(typeof MetricBadge === "function");
  assert(mockMissionWorkspace.workspaceStatus === "ready_for_approval");
  assert(mockMissionWorkspace.scout.competitionLabel === "Medium");
  assert(mockMissionWorkspace.architect.structureScore >= 90);
  assert(getStateLabel("researching") === "Researching");

  return { passed, failed };
}
