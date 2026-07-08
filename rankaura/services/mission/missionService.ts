/**
 * Mission Workspace service — API-shaped, mock only.
 * Universal workflow engine for department reviews.
 */

import { MOCK_MISSION_ID } from "@/lib/mock-mission";
import {
  addMissionComment,
  getStoredMission,
  prependTimelineEvent,
  saveStoredMission,
} from "@/services/mission/mockMissionStore";
import type { Mission } from "@/types/mission";

export const MISSION_APPROVED_MESSAGE = "Aura has continued execution.";

export async function getMission(id: string): Promise<Mission | null> {
  return getStoredMission(id);
}

export async function getDefaultMission(): Promise<Mission | null> {
  return getMission(MOCK_MISSION_ID);
}

export async function approveMission(id: string): Promise<Mission | null> {
  const mission = await getMission(id);
  if (!mission) return null;

  let updated: Mission = {
    ...mission,
    workspaceStatus: "approved",
    workspaceStatusLabel: "APPROVED",
    approvalMessage: MISSION_APPROVED_MESSAGE,
    writer: { ...mission.writer, status: "approved", statusLabel: "Approved" },
  };

  updated = prependTimelineEvent(updated, {
    time: formatTimelineTime(),
    title: "Mission approved",
    type: "mission",
  });

  return saveStoredMission(updated);
}

export async function approveDraft(id: string): Promise<Mission | null> {
  const mission = await getMission(id);
  if (!mission) return null;

  const updated: Mission = {
    ...mission,
    writer: { ...mission.writer, status: "approved", statusLabel: "Draft Approved" },
  };

  return saveStoredMission(
    prependTimelineEvent(updated, {
      time: formatTimelineTime(),
      title: "Writer draft approved",
      type: "team",
    }),
  );
}

export async function requestChanges(
  id: string,
  commentText: string,
): Promise<Mission | null> {
  const mission = await getMission(id);
  if (!mission) return null;

  const comment = {
    id: `comment-${Date.now()}`,
    text: commentText,
    createdAt: new Date().toISOString(),
    author: "You",
  };

  let updated = addMissionComment(mission, comment);
  updated = {
    ...updated,
    workspaceStatus: "revision_requested",
    workspaceStatusLabel: "REVISION REQUESTED",
    writer: {
      ...updated.writer,
      status: "revision_requested",
      statusLabel: "Revision Requested",
    },
  };

  updated = prependTimelineEvent(updated, {
    time: formatTimelineTime(),
    title: "Changes requested — returned to Writer",
    type: "mission",
  });

  return saveStoredMission(updated);
}

export async function requestRewrite(id: string): Promise<Mission | null> {
  return requestChanges(id, "Please rewrite the draft with clearer language.");
}

export async function leaveFeedback(id: string, commentText: string): Promise<Mission | null> {
  const mission = await getMission(id);
  if (!mission) return null;

  const updated = addMissionComment(mission, {
    id: `feedback-${Date.now()}`,
    text: commentText,
    createdAt: new Date().toISOString(),
    author: "You",
  });

  return saveStoredMission(
    prependTimelineEvent(updated, {
      time: formatTimelineTime(),
      title: "Feedback received",
      type: "mission",
    }),
  );
}

export async function archiveMission(id: string): Promise<Mission | null> {
  const mission = await getMission(id);
  if (!mission) return null;

  const updated: Mission = {
    ...mission,
    workspaceStatus: "archived",
    workspaceStatusLabel: "ARCHIVED",
  };

  return saveStoredMission(
    prependTimelineEvent(updated, {
      time: formatTimelineTime(),
      title: "Mission archived",
      type: "mission",
    }),
  );
}

/** @deprecated Use archiveMission or leaveFeedback */
export async function saveMission(id: string): Promise<Mission | null> {
  const mission = await getMission(id);
  if (!mission) return null;

  const updated: Mission = {
    ...mission,
    workspaceStatus: "saved_for_later",
    workspaceStatusLabel: "SAVED FOR LATER",
  };

  return saveStoredMission(updated);
}

function formatTimelineTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
