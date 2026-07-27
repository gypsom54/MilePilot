import { AskRankAuraCard } from "@/components/ask-rankaura/AskRankAuraCard";
import { BiggestOpportunityCard } from "@/components/workspace/BiggestOpportunityCard";
import { RecentProgress } from "@/components/workspace/RecentProgress";
import { RecentWins } from "@/components/workspace/RecentWins";
import { SinceLastVisit } from "@/components/workspace/SinceLastVisit";
import { WorkspaceGrowthAreas } from "@/components/workspace/WorkspaceGrowthAreas";
import { WorkspaceWelcomeSection } from "@/components/workspace/WorkspaceWelcome";
import type { AskRankAuraData } from "@/types/askRankAura";
import type { WorkspaceData } from "@/types/workspace";

interface WorkspacePageProps {
  data: WorkspaceData;
  askData: AskRankAuraData;
}

/**
 * Locked Workspace hierarchy (Phase B):
 * Greeting → Ask RankAura → Biggest Opportunity → Recent Wins
 * → Since Your Last Visit → Growth Areas → Recent Progress
 */
export function WorkspacePage({ data, askData }: WorkspacePageProps) {
  return (
    <div className="min-h-screen bg-ra-canvas text-ra-ink">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-7">
          <WorkspaceWelcomeSection welcome={data.welcome} />
          <AskRankAuraCard data={askData} />
          <BiggestOpportunityCard opportunity={data.biggestOpportunity} />
          <RecentWins wins={data.recentWins} />
          <SinceLastVisit items={data.sinceLastVisit} />
          <WorkspaceGrowthAreas areas={data.growthAreas} />
          <RecentProgress items={data.recentProgress} />
        </div>
      </main>
    </div>
  );
}
