import { AnalysisConfirmation } from "@/components/growth-plan/AnalysisConfirmation";
import { CategoryList } from "@/components/growth-plan/CategoryList";
import { ContinueToWorkspace } from "@/components/growth-plan/ContinueToWorkspace";
import { FeaturedCategories } from "@/components/growth-plan/FeaturedCategories";
import { FinalReassurance } from "@/components/growth-plan/FinalReassurance";
import { GrowthPlanHeader } from "@/components/growth-plan/GrowthPlanHeader";
import { GrowthTeamReady } from "@/components/growth-plan/GrowthTeamReady";
import { KeyDiscoveries } from "@/components/growth-plan/KeyDiscoveries";
import { PrimaryOpportunityCard } from "@/components/growth-plan/PrimaryOpportunityCard";
import { WhatHappensNext } from "@/components/growth-plan/WhatHappensNext";
import type { GrowthPlanData } from "@/types/growthPlan";
import {
  featuredCategories,
  remainingCategories,
} from "@/types/growthPlan";

interface GrowthPlanPageProps {
  data: GrowthPlanData;
  expandCategoryId?: string;
}

/**
 * Hierarchy (confidence polish):
 * Header → Analysis → Key discoveries → Growth Team ready → Primary opportunity
 * → What happens next → Featured → Remaining → Final reassurance → Continue
 */
export function GrowthPlanPage({
  data,
  expandCategoryId,
}: GrowthPlanPageProps) {
  const featured = featuredCategories(data.categories);
  const remaining = remainingCategories(data.categories);

  const featuredExpand =
    expandCategoryId && featured.some((c) => c.id === expandCategoryId)
      ? expandCategoryId
      : undefined;
  const remainingExpand =
    expandCategoryId && remaining.some((c) => c.id === expandCategoryId)
      ? expandCategoryId
      : undefined;

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-[#080f1a]">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-7">
          <GrowthPlanHeader header={data.header} />
          <AnalysisConfirmation items={data.confirmations} />
          <KeyDiscoveries discoveries={data.keyDiscoveries} />
          <GrowthTeamReady content={data.growthTeam} />
          <PrimaryOpportunityCard opportunity={data.primaryOpportunity} />
          <WhatHappensNext items={data.whatHappensNext} />
          <FeaturedCategories
            categories={featured}
            initiallyExpandedId={featuredExpand}
          />
          <CategoryList
            categories={remaining}
            initiallyExpandedId={remainingExpand}
          />
          <FinalReassurance content={data.finalReassurance} />
          <ContinueToWorkspace />
        </div>
      </main>
    </div>
  );
}
