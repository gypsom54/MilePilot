import { BiggestOpportunityCard } from "@/components/workspace/BiggestOpportunityCard";
import { BusinessFeed } from "@/components/workspace/BusinessFeed";
import { SinceLastVisit } from "@/components/workspace/SinceLastVisit";
import { WorkspaceGrowthAreas } from "@/components/workspace/WorkspaceGrowthAreas";
import { WorkspaceWelcomeSection } from "@/components/workspace/WorkspaceWelcome";
import type { WorkspaceData } from "@/types/workspace";

interface WorkspacePageProps {
  data: WorkspaceData;
}

/**
 * Locked Workspace hierarchy:
 * Welcome → Today's Biggest Opportunity → Since Your Last Visit
 * → Growth Areas → Business Feed
 */
export function WorkspacePage({ data }: WorkspacePageProps) {
  return (
    <div className="min-h-screen bg-[#f3f5f7] text-[#080f1a]">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-7">
          <WorkspaceWelcomeSection welcome={data.welcome} />
          <BiggestOpportunityCard opportunity={data.biggestOpportunity} />
          <SinceLastVisit items={data.sinceLastVisit} />
          <WorkspaceGrowthAreas areas={data.growthAreas} />
          <BusinessFeed items={data.businessFeed} />
        </div>
      </main>
    </div>
  );
}
