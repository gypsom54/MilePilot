import { GrowthPlanPage } from "@/components/growth-plan/GrowthPlanPage";
import { getGrowthPlan } from "@/services/growthPlan";
import { parseSiteQuery } from "@/types/growthPlan";

interface GrowthPlanRouteProps {
  searchParams: Promise<{
    site?: string;
    expand?: string;
  }>;
}

/**
 * Growth Plan / Launch Plan review route.
 * Dev switches: /growth-plan?site=existing | /growth-plan?site=new
 * Optional: ?expand=reddit_community for screenshot review of expanded state.
 */
export default async function GrowthPlanRoute({
  searchParams,
}: GrowthPlanRouteProps) {
  const params = await searchParams;
  const siteFamily = parseSiteQuery(params.site);
  const data = await getGrowthPlan(siteFamily);

  return (
    <GrowthPlanPage data={data} expandCategoryId={params.expand} />
  );
}
