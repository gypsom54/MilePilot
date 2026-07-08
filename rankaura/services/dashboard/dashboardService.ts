/**
 * Dashboard data service.
 * Returns presentation-layer data for the home screen.
 *
 * Phase 1: mock data via mockData.ts
 * Phase 2: AuraCore.generateBrief() + employee services
 */

import { PLACEHOLDER_USER } from "@/config/placeholders";
import { MOCK_DASHBOARD_DATA } from "@/services/dashboard/mockData";
import { getGreeting } from "@/utils/greeting";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const greeting = getGreeting();

  return {
    ...MOCK_DASHBOARD_DATA,
    greeting: `${greeting} ${PLACEHOLDER_USER.firstName} 👋`,
  };
}

export async function getDailyBrief(): Promise<Pick<DashboardData, "greeting" | "hero">> {
  const data = await getDashboardData();
  return { greeting: data.greeting, hero: data.hero };
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
