import {
  approveMission,
  getMission,
  requestChanges,
  saveMission,
} from "@/services/mission/missionService";
import { MOCK_MISSION_ID } from "@/lib/mock-mission";

export async function runMissionServiceTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const mission = await getMission(MOCK_MISSION_ID);
  assert(mission !== null);
  assert(mission?.title === "Research Storage Conditions Guide");
  assert(mission?.workspaceStatus === "in_review");
  assert(mission?.departments.length === 5);

  const approved = await approveMission(MOCK_MISSION_ID);
  assert(approved?.workspaceStatus === "approved");
  assert(approved?.timeline[0].title === "Mission approved");
  assert(approved?.approvalMessage !== undefined);

  const withChanges = await requestChanges(
    MOCK_MISSION_ID,
    "Please add more detail about humidity levels.",
  );
  assert(withChanges?.workspaceStatus === "revision_requested");
  const writer = withChanges?.departments.find((d) => d.id === "writer");
  assert(writer?.statusLabel === "Revision Requested");
  assert(withChanges?.comments.length === 1);

  const saved = await saveMission(MOCK_MISSION_ID);
  assert(saved?.workspaceStatus === "saved_for_later");

  return { passed, failed };
}
