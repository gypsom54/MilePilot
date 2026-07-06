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
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-10">
          <GreetingHeader greeting={data.greeting} subheading={data.subheading} />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Primary column */}
            <div className="space-y-6 lg:col-span-2">
              <AiTeamActivity activities={data.teamActivity} />
              <TodaysWins wins={data.wins} />
              <Opportunities opportunities={data.opportunities} />
            </div>

            {/* Secondary column */}
            <div className="space-y-6">
              <AutopilotStatus autopilot={data.autopilot} />
              <GrowthMomentum momentum={data.momentum} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
