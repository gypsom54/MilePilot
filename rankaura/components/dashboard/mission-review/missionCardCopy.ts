import { MISSION_APPROVAL_CONFIRMATION } from "@/lib/mission-review";

interface MissionCardProps {
  mission: import("@/types/dashboard").DashboardMission;
}

export function getMissionCardConfirmationCopy(
  mission: MissionCardProps["mission"],
): string | null {
  if (mission.status !== "approved") return null;
  return MISSION_APPROVAL_CONFIRMATION;
}
