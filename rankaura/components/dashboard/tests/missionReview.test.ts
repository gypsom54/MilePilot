/**
 * Mission Review content tests — validates review sections render from mission data.
 */

import { mockTodayMission } from "@/lib/mock-dashboard";

export interface MissionReviewSections {
  title: string;
  whyThisMatters: string;
  expectedImpact: string;
  confidence: number;
  timeRequiredMinutes: number;
  departmentNames: string[];
  onApproveSummary: string;
}

export function getMissionReviewSections(
  mission: typeof mockTodayMission,
): MissionReviewSections {
  return {
    title: mission.title,
    whyThisMatters: mission.reason,
    expectedImpact: mission.expectedOutcome,
    confidence: mission.confidence,
    timeRequiredMinutes: mission.timeRequiredMinutes,
    departmentNames: mission.departments.map((d) => d.name),
    onApproveSummary: mission.onApproveSummary,
  };
}

export function runMissionReviewTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const sections = getMissionReviewSections(mockTodayMission);
  assert(sections.title === "Create Research Storage Conditions Guide");
  assert(sections.whyThisMatters.includes("storage guidance"));
  assert(sections.expectedImpact.length > 0);
  assert(sections.confidence === 94);
  assert(sections.timeRequiredMinutes === 2);
  assert(sections.departmentNames.join(",") === "Scout,Writer,Architect,Guardian");
  assert(sections.onApproveSummary.length > 0);

  return { passed, failed };
}
