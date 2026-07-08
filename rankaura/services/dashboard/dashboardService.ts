/**
 * Dashboard data service (legacy + Mission Control).
 * Phase 1: mock data via lib/mock-dashboard.ts
 * Phase 2: AuraCore.generateBrief() + employee services
 */

import { MOCK_DASHBOARD_DATA } from "@/services/dashboard/mockData";
import { PLACEHOLDER_USER } from "@/config/placeholders";
import { getGreeting } from "@/utils/greeting";
import type { DashboardData } from "@/types/dashboard";

export {
  getBusinessHealth,
  getDailyBrief,
  getGrowthTeamStatus,
  getMissionControlData,
  getTimelinePreview,
  getTodayMission,
} from "@/services/dashboard/dashboard.service";

export async function getDashboardData(): Promise<DashboardData> {
  const greeting = `${getGreeting()} ${PLACEHOLDER_USER.firstName} 👋`;

  return {
    ...MOCK_DASHBOARD_DATA,
    greeting,
  };
}

export async function getAITeam(): Promise<DashboardData["teamActivity"]> {
  const data = await getDashboardData();
  return data.teamActivity;
}

export async function getWins(): Promise<DashboardData["wins"]> {
  const data = await getDashboardData();
  return data.wins;
}

export async function getOpportunities(): Promise<DashboardData["opportunities"]> {
  const data = await getDashboardData();
  return data.opportunities;
}

export async function getGrowthMomentum(): Promise<DashboardData["momentum"]> {
  const data = await getDashboardData();
  return data.momentum;
}

export async function getAutopilotStatus(): Promise<DashboardData["autopilot"]> {
  const data = await getDashboardData();
  return data.autopilot;
}
