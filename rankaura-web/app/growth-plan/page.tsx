import { GrowthPlanPersonalized } from "@/components/growth-plan/GrowthPlanPersonalized";
import { getGrowthPlan } from "@/services/growthPlan";
import { parseSiteQuery } from "@/types/growthPlan";

interface GrowthPlanRouteProps {
  searchParams: Promise<{
    site?: string;
    expand?: string;
  }>;
}

/**
 * Growth Plan / Launch Plan.
 * Personalisation (customer first name once + business name) comes from
 * onboarding session storage when present.
 */
export default async function GrowthPlanRoute({
  searchParams,
}: GrowthPlanRouteProps) {
  const params = await searchParams;
  const siteFamily = parseSiteQuery(params.site);
  const data = await getGrowthPlan(siteFamily);

  return (
    <GrowthPlanPersonalized
      data={data}
      siteFamily={siteFamily}
      expandCategoryId={params.expand}
    />
  );
}
