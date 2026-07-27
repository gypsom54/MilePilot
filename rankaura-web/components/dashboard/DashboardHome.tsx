import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { EveningBriefCard } from "@/components/dashboard/EveningBriefCard";
import { TodaysMissionCard } from "@/components/dashboard/TodaysMissionCard";
import type { DashboardData } from "@/types/dashboard";

interface DashboardHomeProps {
  data: DashboardData;
}

/**
 * Approved dashboard shell.
 * AI Team / Website health / Growth opportunities live on the shared data
 * object for coherence and future nav pages — home layout stays screenshot-locked.
 */
export function DashboardHome({ data }: DashboardHomeProps) {
  return (
    <div className="flex min-h-screen bg-[#f3f5f7] text-[#080f1a]">
      <DashboardSidebar
        business={data.business}
        navItems={data.navItems}
        activeNav={data.activeNav}
      />
      <main className="flex-1 px-8 py-8 lg:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <EveningBriefCard brief={data.brief} />
          <TodaysMissionCard mission={data.todaysMission} />
          {/*
            Coherent mock fields available via data.aiTeam / data.websiteHealth /
            data.growthOpportunities — rendered on dedicated nav destinations later
            without changing this locked home layout.
          */}
        </div>
      </main>
    </div>
  );
}
