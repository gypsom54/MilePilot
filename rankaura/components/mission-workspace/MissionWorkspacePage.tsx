"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ApprovalPanel,
  ArchitecturePlan,
  AuraBrief,
  BusinessImpactGrid,
  DepartmentWorkflow,
  DeploymentAnimation,
  DraftPreview,
  MissionApprovedConfirmation,
  MissionHeader,
  MissionWorkspaceSkeleton,
} from "@/components/mission-workspace";
import {
  approveMission as approveMissionService,
  requestChanges,
  saveForLater,
} from "@/services/mission/missionService";
import type { Mission } from "@/types/mission";

type WorkspacePhase = "review" | "deploying" | "complete";

interface MissionWorkspacePageProps {
  initialMission: Mission;
}

/**
 * Sprint 015 — full-page intelligence briefing.
 * Substantially different from Mission Control dashboard.
 */
export function MissionWorkspacePage({ initialMission }: MissionWorkspacePageProps) {
  const [mission, setMission] = useState(initialMission);
  const [phase, setPhase] = useState<WorkspacePhase>("review");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showChangesPrompt, setShowChangesPrompt] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const handleDeploymentComplete = useCallback(async () => {
    const updated = await approveMissionService(mission.id);
    if (updated) setMission(updated);
    setPhase("complete");
    setLoading(false);
  }, [mission.id]);

  const handleApprove = useCallback(() => {
    setLoading(true);
    setPhase("deploying");
  }, []);

  const handleRequestChanges = useCallback(
    async (comment: string) => {
      setLoading(true);
      const updated = await requestChanges(mission.id, comment);
      if (updated) setMission(updated);
      setLoading(false);
      setShowChangesPrompt(false);
    },
    [mission.id],
  );

  const handleSaveForLater = useCallback(async () => {
    setLoading(true);
    const updated = await saveForLater(mission.id);
    if (updated) setMission(updated);
    setLoading(false);
  }, [mission.id]);

  const handleHeaderRequestChanges = useCallback(() => {
    setShowChangesPrompt(true);
    document.getElementById("approval-panel")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const isReviewable =
    phase === "review" &&
    (mission.workspaceStatus === "ready_for_approval" ||
      mission.workspaceStatus === "in_review" ||
      mission.workspaceStatus === "pending");

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
        {!isReady ? (
          <MissionWorkspaceSkeleton />
        ) : phase === "complete" ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center py-16">
            <MissionApprovedConfirmation />
            {mission.timeline[0] && (
              <p className="mt-8 text-sm text-[var(--color-text-muted)]">
                Latest timeline update: {mission.timeline[0].title}
              </p>
            )}
            <Link
              href="/"
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-[var(--color-midnight)] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[var(--color-midnight-soft)]"
            >
              Return to Mission Control
            </Link>
          </div>
        ) : (
          <div className="space-y-20 pb-20">
            <MissionHeader
              mission={mission}
              onApprove={isReviewable ? handleApprove : undefined}
              onRequestChanges={isReviewable ? handleHeaderRequestChanges : undefined}
              loading={loading}
              showActions={isReviewable}
            />

            <AuraBrief brief={mission.auraBrief} />
            <DepartmentWorkflow contributions={mission.departmentContributions} />
            <DraftPreview draft={mission.draftPreview} />
            <ArchitecturePlan plan={mission.architecturePlan} />
            <BusinessImpactGrid impact={mission.businessImpact} />

            {isReviewable && (
              <div id="approval-panel">
                <ApprovalPanel
                  mission={mission}
                  onApprove={handleApprove}
                  onRequestChanges={handleRequestChanges}
                  onSaveForLater={handleSaveForLater}
                  loading={loading}
                />
              </div>
            )}

            {showChangesPrompt && isReviewable && (
              <p className="text-center text-sm text-[var(--color-aura)]">
                Use the approval panel below to describe your requested changes.
              </p>
            )}

            {mission.workspaceStatus === "revision_requested" && (
              <div className="rounded-2xl bg-[var(--color-aura-glow)] px-8 py-6 text-center">
                <p className="font-medium text-[var(--color-text-primary)]">
                  Changes requested — your Growth Team is revising this mission.
                </p>
              </div>
            )}

            {mission.workspaceStatus === "saved_for_later" && (
              <div className="rounded-2xl bg-[var(--color-surface)] px-8 py-6 text-center shadow-[var(--shadow-sm)]">
                <p className="font-medium text-[var(--color-text-primary)]">
                  Mission saved for later. Return when you are ready to review.
                </p>
                <Link href="/" className="mt-4 inline-block text-sm font-medium text-[var(--color-aura)] hover:underline">
                  Back to Mission Control
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {phase === "deploying" && <DeploymentAnimation onComplete={handleDeploymentComplete} />}
    </div>
  );
}
