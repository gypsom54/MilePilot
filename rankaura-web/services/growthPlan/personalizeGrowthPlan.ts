import type { GrowthPlanData, SiteStateFamily } from "@/types/growthPlan";
import type { OnboardingSession } from "@/types/onboarding";

/**
 * Apply sparse personalisation from onboarding session.
 * Uses the customer's first name once in the Growth Plan title.
 * Prefers business name for ongoing identity.
 */
export function personalizeGrowthPlan(
  data: GrowthPlanData,
  session: OnboardingSession | null,
  siteFamily: SiteStateFamily,
): GrowthPlanData {
  const firstName = session?.customerFirstName?.trim() || "";
  const businessName =
    session?.businessName?.trim() ||
    data.header.businessName ||
    "Your business";

  const title =
    siteFamily === "new"
      ? firstName
        ? `${firstName}, your Launch Plan is ready.`
        : "Your Launch Plan is ready."
      : firstName
        ? `${firstName}, your Growth Plan is ready.`
        : "Your Growth Plan is ready.";

  const support =
    siteFamily === "new"
      ? "We've researched your market and competitors, and prepared the foundations for your online growth."
      : "We've identified several opportunities to help your business grow.";

  return {
    ...data,
    header: {
      ...data.header,
      businessName,
      title,
      support,
    },
  };
}
