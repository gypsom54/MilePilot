"use client";

import { MissionMode } from "@/components/mission-mode/MissionMode";
import type { Mission } from "@/types/mission";

interface MissionWorkspacePageProps {
  initialMission: Mission;
}

/**
 * Mission Workspace — immersive Mission Mode (AI Business OS).
 */
export function MissionWorkspacePage({ initialMission }: MissionWorkspacePageProps) {
  return <MissionMode mission={initialMission} />;
}
