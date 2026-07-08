/**
 * Aurora Mission Control — API-shaped dashboard service.
 * Simulates future API calls; reads from mock data only.
 */

import { PLACEHOLDER_USER } from "@/config/placeholders";
import {
  mockBusiness,
  mockBusinessHealth,
  mockDailyBrief,
  mockGrowthTeam,
  mockTimelineEvents,
  mockTodayMission,
} from "@/lib/mock-dashboard";
import { getGreeting } from "@/utils/greeting";
import type {
  DashboardBusinessHealth,
  DashboardDailyBrief,
  DashboardGrowthTeamMember,
  DashboardMission,
  DashboardTimelineEvent,
  MissionControlData,
} from "@/types/dashboard";

async function simulateLatency<T>(data: T): Promise<T> {
  return data;
}

export async function getGreetingMessage(): Promise<string> {
  return `${getGreeting()} ${PLACEHOLDER_USER.firstName} 👋`;
}

export async function getDailyBrief(): Promise<DashboardDailyBrief & { greeting: string }> {
  const greeting = await getGreetingMessage();
  const dailyBrief = await simulateLatency(mockDailyBrief);
  return { ...dailyBrief, greeting };
}

export async function getTodayMission(): Promise<DashboardMission> {
  return simulateLatency({ ...mockTodayMission });
}

export async function getGrowthTeamStatus(): Promise<DashboardGrowthTeamMember[]> {
  return simulateLatency([...mockGrowthTeam]);
}

export async function getBusinessHealth(): Promise<DashboardBusinessHealth> {
  return simulateLatency({ ...mockBusinessHealth });
}

export async function getTimelinePreview(): Promise<DashboardTimelineEvent[]> {
  return simulateLatency([...mockTimelineEvents]);
}

/** @see services/mission/missionService.ts — Mission Workspace data */
export { getMission } from "@/services/mission/missionService";

export async function getMissionControlData(): Promise<MissionControlData> {
  const [greeting, dailyBrief, todayMission, growthTeam, businessHealth, timelineEvents] =
    await Promise.all([
      getGreetingMessage(),
      simulateLatency(mockDailyBrief),
      getTodayMission(),
      getGrowthTeamStatus(),
      getBusinessHealth(),
      getTimelinePreview(),
    ]);

  return {
    business: mockBusiness,
    greeting,
    dailyBrief,
    todayMission,
    growthTeam,
    businessHealth,
    timelineEvents,
  };
}
