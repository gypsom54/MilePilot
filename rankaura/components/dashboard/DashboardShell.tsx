import { AiTeamActivity } from "@/components/dashboard/AiTeamActivity";
import { AutopilotStatus } from "@/components/dashboard/AutopilotStatus";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { GrowthMomentum } from "@/components/dashboard/GrowthMomentum";
import { Opportunities } from "@/components/dashboard/Opportunities";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TodaysWins } from "@/components/dashboard/TodaysWins";
import type { DashboardData } from "@/types/dashboard";

interface DashboardShellProps {
  data: DashboardData;
}

/**
 * Main dashboard layout shell.
 * AuraCore will eventually provide unified state to all sections below.
 */
export function DashboardShell({ data }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={data.business} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:px-10 sm:py-12">
          <GreetingHeader greeting={data.greeting} hero={data.hero} />

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Primary column */}
            <div className="space-y-8 lg:col-span-2">
              <AiTeamActivity activities={data.teamActivity} />
              <TodaysWins wins={data.wins} />
              <Opportunities opportunities={data.opportunities} />
            </div>

            {/* Secondary column */}
            <div className="space-y-8">
              <AutopilotStatus autopilot={data.autopilot} />
              <GrowthMomentum momentum={data.momentum} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
