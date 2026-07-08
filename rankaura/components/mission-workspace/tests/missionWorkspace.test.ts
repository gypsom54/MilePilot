import { mockMissionWorkspace } from "@/lib/mock-mission";
import type { Mission } from "@/types/mission";

export function getMissionWorkspaceSections(mission: Mission) {
  return {
    hasHeader: mission.workspaceStatusLabel.length > 0,
    departmentCount: mission.departments.length,
    departmentNames: mission.departments.map((d) => d.name),
    previewBlockCount: mission.preview.blocks.length,
    timelineCount: mission.timeline.length,
    impactVisitors: mission.impact.estimatedVisitors,
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
  assert(sections.departmentCount === 5);
  assert(sections.departmentNames.join(",") === "Scout,Writer,Architect,Guardian,Publisher");
  assert(sections.previewBlockCount >= 5);
  assert(sections.timelineCount >= 3);
  assert(sections.impactVisitors === "420 visitors/month");

  return { passed, failed };
}
