"use client";

import {
  ActivityTimeline,
  BusinessSnapshot,
  DepartmentActivityPanel,
  MissionCard,
  MissionControlSkeleton,
  MorningBrief,
} from "@/components/mission-control";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  buildBusinessSnapshot,
  buildMorningBrief,
} from "@/services/activity/activityEngine";
import { useActivityEngine } from "@/hooks/useActivityEngine";
import type { MissionControlData } from "@/types/dashboard";

interface MissionControlProps {
  data: MissionControlData;
}

/**
 * Aurora Mission Control — living AI Operating System dashboard.
 * Layout locked; behaviour driven by activityEngine mock service.
 */
export function MissionControl({ data }: MissionControlProps) {
  const { activity, isReady } = useActivityEngine();

  const morningBrief = buildMorningBrief(
    data.todayMission,
    data.dailyBrief.improvementsCount,
    data.dailyBrief.hoursSaved,
  );

  const businessSnapshot = buildBusinessSnapshot(
    data.businessHealth.changePercent,
    data.dailyBrief.hoursSaved,
    data.todayMission.status === "pending" ? 1 : 0,
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={data.business} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:px-10 sm:py-12">
          {!isReady || !activity ? (
            <MissionControlSkeleton />
          ) : (
            <>
              <MorningBrief brief={morningBrief} />

              <div className="mt-8">
                <MissionCard mission={data.todayMission} />
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <DepartmentActivityPanel departments={activity.departments} />
                </div>
                <div className="space-y-8">
                  <BusinessSnapshot snapshot={businessSnapshot} />
                  <ActivityTimeline events={activity.timeline} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
