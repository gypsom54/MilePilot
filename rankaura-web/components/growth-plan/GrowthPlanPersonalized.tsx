"use client";

import { useEffect, useMemo, useState } from "react";
import { GrowthPlanPage } from "@/components/growth-plan/GrowthPlanPage";
import { personalizeGrowthPlan } from "@/services/growthPlan/personalizeGrowthPlan";
import { loadOnboardingSession } from "@/services/onboarding/session";
import type { GrowthPlanData, SiteStateFamily } from "@/types/growthPlan";
import type { OnboardingSession } from "@/types/onboarding";

interface GrowthPlanPersonalizedProps {
  data: GrowthPlanData;
  siteFamily: SiteStateFamily;
  expandCategoryId?: string;
}

export function GrowthPlanPersonalized({
  data,
  siteFamily,
  expandCategoryId,
}: GrowthPlanPersonalizedProps) {
  const [session, setSession] = useState<OnboardingSession | null>(null);

  useEffect(() => {
    setSession(loadOnboardingSession());
  }, []);

  const personalized = useMemo(
    () => personalizeGrowthPlan(data, session, siteFamily),
    [data, session, siteFamily],
  );

  return (
    <GrowthPlanPage data={personalized} expandCategoryId={expandCategoryId} />
  );
}
