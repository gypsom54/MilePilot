import type { DashboardData, DashboardDataProvider } from "@/types/dashboard";
import { mockDashboardProvider } from "@/services/dashboard/mockDashboardProvider";

/**
 * Single data-layer swap point.
 * Replace `activeProvider` with a live backend provider later — call sites stay the same.
 */
let activeProvider: DashboardDataProvider = mockDashboardProvider;

export function setDashboardDataProvider(provider: DashboardDataProvider): void {
  activeProvider = provider;
}

export async function getDashboardData(): Promise<DashboardData> {
  return activeProvider.getDashboardData();
}

export { mockDashboardProvider };
