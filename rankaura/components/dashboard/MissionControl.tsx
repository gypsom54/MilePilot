"use client";

import { useCallback, useState } from "react";
import { BusinessHealthCard } from "@/components/dashboard/BusinessHealthCard";
import { DailyBriefCard } from "@/components/dashboard/DailyBriefCard";
import { GrowthTeamCard } from "@/components/dashboard/GrowthTeamCard";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { MissionReviewModal } from "@/components/dashboard/mission-review";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TimelinePreview } from "@/components/dashboard/TimelinePreview";
import {
  approveMission,
  deferMission,
  MISSION_APPROVAL_CONFIRMATION,
} from "@/lib/mission-review";
import type { MissionControlData } from "@/types/dashboard";

interface MissionControlProps {
  data: MissionControlData;
}

/**
 * Aurora Mission Control — product loop with Mission Review experience.
 * Client state handles review, approval confirmation, and timeline updates (mock only).
 */
export function MissionControl({ data }: MissionControlProps) {
  const [mission, setMission] = useState(data.todayMission);
  const [timelineEvents, setTimelineEvents] = useState(data.timelineEvents);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSessionKey, setReviewSessionKey] = useState(0);

  const openReview = useCallback(() => {
    setReviewSessionKey((key) => key + 1);
    setReviewOpen(true);
  }, []);

  const handleApprove = useCallback(() => {
    setMission((prevMission) => {
      setTimelineEvents((prevTimeline) => {
        const result = approveMission(prevMission, prevTimeline);
        return result.timeline;
      });
      return { ...prevMission, status: "approved" };
    });
  }, []);

  const handleDefer = useCallback(() => {
    setMission((prev) => deferMission(prev));
    setReviewOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={data.business} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10 sm:px-10 sm:py-12">
          <DailyBriefCard
            greeting={data.greeting}
            dailyBrief={data.dailyBrief}
            showContinueGrowing={mission.status === "pending"}
            onContinueGrowing={openReview}
          />

          <div className="mt-8">
            <MissionCard mission={mission} onReview={openReview} />
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

      <MissionReviewModal
        key={reviewSessionKey}
        mission={mission}
        open={reviewOpen}
        confirmationMessage={MISSION_APPROVAL_CONFIRMATION}
        onClose={() => setReviewOpen(false)}
        onApprove={handleApprove}
        onDefer={handleDefer}
      />
    </div>
  );
}
