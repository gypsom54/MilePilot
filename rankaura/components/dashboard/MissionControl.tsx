"use client";

import { BusinessHealthCard } from "@/components/dashboard/BusinessHealthCard";
import { DailyBriefCard } from "@/components/dashboard/DailyBriefCard";
import { GrowthTeamCard } from "@/components/dashboard/GrowthTeamCard";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TimelinePreview } from "@/components/dashboard/TimelinePreview";
import type { MissionControlData } from "@/types/dashboard";

interface MissionControlProps {
  data: MissionControlData;
}

/**
 * Aurora Mission Control — dashboard entry point.
 * Review Mission navigates to Mission Workspace (/missions/[id]).
 */
export function MissionControl({ data }: MissionControlProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={data.business} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:px-10 sm:py-12">
          <DailyBriefCard
            greeting={data.greeting}
            dailyBrief={data.dailyBrief}
            showContinueGrowing={data.todayMission.status === "pending"}
            missionHref={`/missions/${data.todayMission.id}`}
          />

          <div className="mt-8">
            <MissionCard mission={data.todayMission} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GrowthTeamCard team={data.growthTeam} />
            </div>
            <div className="space-y-8">
              <BusinessHealthCard health={data.businessHealth} />
              <TimelinePreview events={data.timelineEvents} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
