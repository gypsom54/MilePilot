import type {
  GrowthPlanData,
  GrowthPlanDataProvider,
  SiteStateFamily,
} from "@/types/growthPlan";
import { existingGrowthPlanMock } from "@/services/growthPlan/mockExistingGrowthPlan";
import { newLaunchPlanMock } from "@/services/growthPlan/mockNewLaunchPlan";

export const mockGrowthPlanProvider: GrowthPlanDataProvider = {
  getGrowthPlan(siteFamily: SiteStateFamily): GrowthPlanData {
    return siteFamily === "new" ? newLaunchPlanMock : existingGrowthPlanMock;
  },
};

/**
 * Single data-layer swap point for Growth Plan / Launch Plan.
 */
let activeProvider: GrowthPlanDataProvider = mockGrowthPlanProvider;

export function setGrowthPlanDataProvider(provider: GrowthPlanDataProvider): void {
  activeProvider = provider;
}

export async function getGrowthPlan(
  siteFamily: SiteStateFamily,
): Promise<GrowthPlanData> {
  return activeProvider.getGrowthPlan(siteFamily);
}

export { existingGrowthPlanMock, newLaunchPlanMock };
