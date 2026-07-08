"use client";

import { useCallback, useState } from "react";
import { BusinessHealthCard } from "@/components/dashboard/BusinessHealthCard";
import { DailyBriefCard } from "@/components/dashboard/DailyBriefCard";
import { GrowthTeamCard } from "@/components/dashboard/GrowthTeamCard";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { MissionReviewPanel } from "@/components/dashboard/MissionReviewPanel";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TimelinePreview } from "@/components/dashboard/TimelinePreview";
import type { DashboardMission, DashboardTimelineEvent, MissionControlData } from "@/types/dashboard";

interface MissionControlProps {
  data: MissionControlData;
}

function createApprovalEvent(mission: DashboardMission): DashboardTimelineEvent {
  return {
    id: `evt-approved-${Date.now()}`,
    title: `Mission approved: ${mission.title}`,
    timestamp: "Just now",
    type: "mission",
  };
}

/**
 * Aurora Mission Control — first product loop.
 * Client state handles mission review and timeline updates (mock only).
 */
export function MissionControl({ data }: MissionControlProps) {
  const [mission, setMission] = useState(data.todayMission);
  const [timelineEvents, setTimelineEvents] = useState(data.timelineEvents);
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleApprove = useCallback(() => {
    setMission((prev) => {
      setTimelineEvents((events) => [createApprovalEvent(prev), ...events]);
      return { ...prev, status: "approved" };
    });
    setReviewOpen(false);
  }, []);

  const handleDefer = useCallback(() => {
    setMission((prev) => ({ ...prev, status: "deferred" }));
    setReviewOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={data.business} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:px-10 sm:py-12">
          <DailyBriefCard greeting={data.greeting} dailyBrief={data.dailyBrief} />

          <div className="mt-8">
            <MissionCard mission={mission} onReview={() => setReviewOpen(true)} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GrowthTeamCard team={data.growthTeam} />
            </div>
            <div className="space-y-8">
              <BusinessHealthCard health={data.businessHealth} />
              <TimelinePreview events={timelineEvents} />
            </div>
          </div>
        </div>
      </main>

      <MissionReviewPanel
        mission={mission}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onApprove={handleApprove}
        onDefer={handleDefer}
      />
    </div>
  );
}
