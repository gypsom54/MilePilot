/**
 * In-memory mission store — mock persistence for Sprint 003.
 */

import { mockMissionWorkspace } from "@/lib/mock-mission";
import type { Mission, MissionComment, MissionTimelineEvent } from "@/types/mission";

const store = new Map<string, Mission>();

function cloneMission(mission: Mission): Mission {
  return structuredClone(mission);
}

export function initMissionStore(): void {
  if (!store.has(mockMissionWorkspace.id)) {
    store.set(mockMissionWorkspace.id, cloneMission(mockMissionWorkspace));
  }
}

export function getStoredMission(id: string): Mission | null {
  initMissionStore();
  const mission = store.get(id);
  return mission ? cloneMission(mission) : null;
}

export function saveStoredMission(mission: Mission): Mission {
  const updated = cloneMission(mission);
  store.set(mission.id, updated);
  return cloneMission(updated);
}

export function prependTimelineEvent(
  mission: Mission,
  event: Omit<MissionTimelineEvent, "id">,
): Mission {
  const timelineEvent: MissionTimelineEvent = {
    ...event,
    id: `tl-${Date.now()}`,
  };
  return {
    ...mission,
    timeline: [timelineEvent, ...mission.timeline],
  };
}

export function addMissionComment(mission: Mission, comment: MissionComment): Mission {
  return {
    ...mission,
    comments: [comment, ...mission.comments],
  };
}
