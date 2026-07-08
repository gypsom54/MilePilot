import {
  AURA_MISSION_COMPLETE_MESSAGE,
  DEPLOYMENT_STEPS,
} from "@/components/mission-workspace/DeploymentAnimation";
import { mockMissionWorkspace } from "@/lib/mock-mission";
import type { Mission } from "@/types/mission";

export function getMissionWorkspaceSections(mission: Mission) {
  return {
    hasHeader: mission.workspaceStatusLabel.length > 0,
    hasScoutReport: mission.scout.monthlySearches > 0,
    hasWriterDraft: mission.writer.sections.length > 0,
    hasArchitectReview: mission.architect.checklist.length > 0,
    hasGuardianReview: mission.guardian.checks.every((c) => c.passed),
    guardianScore: mission.guardian.score,
    briefingImpactVisitors: mission.briefingImpact.estimatedMonthlyVisitors,
    preparedBy: mission.preparedByDepartments.join(","),
    scoutConfidence: mission.scout.confidence,
  };
}

export function runMissionWorkspaceTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const sections = getMissionWorkspaceSections(mockMissionWorkspace);
  assert(sections.hasHeader);
  assert(sections.hasScoutReport);
  assert(sections.hasWriterDraft);
  assert(sections.hasArchitectReview);
  assert(sections.hasGuardianReview);
  assert(sections.guardianScore === 97);
  assert(sections.briefingImpactVisitors === "420");
  assert(sections.preparedBy === "Scout,Writer,Architect,Guardian");
  assert(sections.scoutConfidence === 94);
  assert(DEPLOYMENT_STEPS.length === 4);
  assert(DEPLOYMENT_STEPS[3].label === "Website Updated");
  assert(AURA_MISSION_COMPLETE_MESSAGE.title === "Mission Complete.");

  return { passed, failed };
}
