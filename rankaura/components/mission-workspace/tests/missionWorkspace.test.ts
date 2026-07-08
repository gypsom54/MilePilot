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
    missionType: mission.missionTypeLabel,
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
  assert(sections.missionType === "Content Guide");
  assert(mockMissionWorkspace.scout.customerQuestions.length >= 3);
  assert(mockMissionWorkspace.writer.callToAction.length > 0);

  return { passed, failed };
}
