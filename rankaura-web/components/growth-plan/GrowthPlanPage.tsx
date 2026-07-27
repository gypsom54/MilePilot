import { AnalysisConfirmation } from "@/components/growth-plan/AnalysisConfirmation";
import { CategoryList } from "@/components/growth-plan/CategoryList";
import { ContinueToWorkspace } from "@/components/growth-plan/ContinueToWorkspace";
import { FeaturedCategories } from "@/components/growth-plan/FeaturedCategories";
import { GrowthPlanHeader } from "@/components/growth-plan/GrowthPlanHeader";
import { PrimaryOpportunityCard } from "@/components/growth-plan/PrimaryOpportunityCard";
import { WhatHappensNext } from "@/components/growth-plan/WhatHappensNext";
import type { GrowthPlanData } from "@/types/growthPlan";
import {
  featuredCategories,
  remainingCategories,
} from "@/types/growthPlan";

interface GrowthPlanPageProps {
  data: GrowthPlanData;
  /** Review helper: expand a category by id (e.g. reddit_community) */
  expandCategoryId?: string;
}

/**
 * Locked page hierarchy:
 * Header → Analysis confirmation → Primary opportunity → What happens next
 * → Featured categories → Remaining categories → Continue to Workspace
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
          <ContinueToWorkspace />
        </div>
      </main>
    </div>
  );
}
