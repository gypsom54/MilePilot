import {
  approveDraft,
  approveMission,
  archiveMission,
  getMission,
  getMissionById,
  leaveFeedback,
  requestChanges,
  saveForLater,
} from "@/services/mission/missionService";
import { MOCK_MISSION_ID } from "@/lib/mock-mission";

export async function runMissionServiceTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(MOCK_MISSION_ID === "research-storage-conditions-guide");

  const mission = await getMission(MOCK_MISSION_ID);
  assert(mission !== null);
  assert(mission?.title === "Create Research Storage Conditions Guide");
  assert(mission?.workspaceStatus === "ready_for_approval");
  assert(mission?.scout.monthlySearches === 420);
  assert(mission?.guardian.score === 97);
  assert(mission?.departmentContributions.length === 5);
  assert(mission?.auraBrief.paragraphs.length >= 5);

  const byId = await getMissionById(MOCK_MISSION_ID);
  assert(byId?.id === MOCK_MISSION_ID);

  const draftApproved = await approveDraft(MOCK_MISSION_ID);
  assert(draftApproved?.writer.status === "approved");

  const withFeedback = await leaveFeedback(MOCK_MISSION_ID, "Looks great overall.");
  assert(withFeedback?.comments.length >= 1);

  const withChanges = await requestChanges(MOCK_MISSION_ID, "Add more humidity detail.");
  assert(withChanges?.workspaceStatus === "revision_requested");
  assert(withChanges?.writer.statusLabel === "Revision Requested");

  const approved = await approveMission(MOCK_MISSION_ID);
  assert(approved?.workspaceStatus === "approved");
  assert(approved?.timeline[0].title.includes("Mission approved"));
  assert(approved?.timeline[0].title.includes("Research Storage Conditions Guide"));

  const saved = await saveForLater(MOCK_MISSION_ID);
  assert(saved?.workspaceStatus === "saved_for_later");

  const archived = await archiveMission(MOCK_MISSION_ID);
  assert(archived?.workspaceStatus === "archived");

  return { passed, failed };
}
