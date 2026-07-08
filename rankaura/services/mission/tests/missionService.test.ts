import {
  approveDraft,
  approveMission,
  archiveMission,
  getMission,
  leaveFeedback,
  requestChanges,
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
  assert(mission?.workspaceStatus === "ready_for_approval");
  assert(mission?.scout.monthlySearches === 420);
  assert(mission?.guardian.score === 97);

  const draftApproved = await approveDraft(MOCK_MISSION_ID);
  assert(draftApproved?.writer.status === "approved");

  const withFeedback = await leaveFeedback(MOCK_MISSION_ID, "Looks great overall.");
  assert(withFeedback?.comments.length >= 1);

  const withChanges = await requestChanges(MOCK_MISSION_ID, "Add more humidity detail.");
  assert(withChanges?.workspaceStatus === "revision_requested");
  assert(withChanges?.writer.statusLabel === "Revision Requested");

  const approved = await approveMission(MOCK_MISSION_ID);
  assert(approved?.workspaceStatus === "approved");
  assert(approved?.timeline[0].title === "Mission approved");

  const archived = await archiveMission(MOCK_MISSION_ID);
  assert(archived?.workspaceStatus === "archived");

  return { passed, failed };
}
