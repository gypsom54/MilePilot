import {
  AURA_MISSION_COMPLETE_MESSAGE,
  DEPLOYMENT_STEPS,
} from "@/components/mission-workspace/DeploymentAnimation";
import { MOCK_MISSION_ID, mockMissionWorkspace } from "@/lib/mock-mission";
import { mockTodayMission } from "@/lib/mock-dashboard";
import { buildMorningBrief } from "@/services/activity/activityEngine";
import type { Mission } from "@/types/mission";

export function getMissionWorkspaceSections(mission: Mission) {
  return {
    hasHeader: mission.workspaceStatusLabel.length > 0,
    hasAuraBrief: mission.auraBrief.paragraphs.length >= 5,
    departmentCount: mission.departmentContributions.length,
    hasDraftPreview: mission.draftPreview.sections.length >= 5,
    hasArchitecturePlan: mission.architecturePlan.suggestedInternalLinks.length >= 4,
    businessImpactVisitors: mission.businessImpact.estimatedMonthlyVisitors,
    preparedBy: mission.preparedByDepartments.join(","),
    scoutConfidence: mission.scout.confidence,
    guardianScore: mission.guardian.score,
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
  assert(sections.hasAuraBrief);
  assert(sections.departmentCount === 5);
  assert(sections.hasDraftPreview);
  assert(sections.hasArchitecturePlan);
  assert(sections.businessImpactVisitors === 420);
  assert(sections.preparedBy === "Scout,Writer,Architect,Guardian");
  assert(sections.scoutConfidence === 96);
  assert(sections.guardianScore === 97);
  assert(MOCK_MISSION_ID === "research-storage-conditions-guide");
  assert(DEPLOYMENT_STEPS.length === 6);
  assert(DEPLOYMENT_STEPS[0].label === "Preparing mission...");
  assert(DEPLOYMENT_STEPS[5].label === "Mission approved");
  assert(AURA_MISSION_COMPLETE_MESSAGE.title === "Mission Approved");

  const brief = buildMorningBrief(mockTodayMission, 12, 2.8);
  assert(brief.ctaHref === `/missions/${MOCK_MISSION_ID}`);
  assert(brief.ctaLabel === "Review Mission");

  return { passed, failed };
}
