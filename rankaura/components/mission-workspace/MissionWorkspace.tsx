"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  ApprovalFooter,
  AuraConfirmation,
  DeploymentAnimation,
  MissionHeader,
  MissionWorkspaceSkeleton,
} from "@/components/mission-workspace";
import {
  ArchitectSection,
  GuardianSection,
  ScoutSection,
  WriterSection,
} from "@/components/mission-workspace/MissionDepartmentSections";
import { mockBusiness } from "@/lib/mock-dashboard";
import {
  approveMission as approveMissionService,
  requestChanges,
} from "@/services/mission/missionService";
import type { Mission } from "@/types/mission";

type WorkspacePhase = "review" | "deploying" | "complete";

interface MissionWorkspaceProps {
  initialMission: Mission;
}

/**
 * Mission Workspace — primary Vector OS workflow.
 * Mission-centric intelligence briefing with deployment animation on approve.
 */
export function MissionWorkspace({ initialMission }: MissionWorkspaceProps) {
  const [mission, setMission] = useState(initialMission);
  const [phase, setPhase] = useState<WorkspacePhase>("review");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 350);
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
    },
    [mission.id],
  );

  const isReviewable =
    phase === "review" &&
    (mission.workspaceStatus === "ready_for_approval" ||
      mission.workspaceStatus === "in_review" ||
      mission.workspaceStatus === "pending");

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={mockBusiness} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl px-8 py-12 sm:px-12 sm:py-16">
          {!isReady ? (
            <MissionWorkspaceSkeleton />
          ) : phase === "complete" ? (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
              <AuraConfirmation />
              <Link
                href="/"
                className="mt-10 text-sm font-medium text-[var(--color-aura)] transition-colors hover:underline"
              >
                Return to Mission Control
              </Link>
            </div>
          ) : (
            <div className="space-y-16 pb-24">
              <MissionHeader mission={mission} />
              <ScoutSection report={mission.scout} />
              <WriterSection draft={mission.writer} />
              <ArchitectSection review={mission.architect} />
              <GuardianSection review={mission.guardian} />
              {isReviewable && (
                <ApprovalFooter
                  onApprove={handleApprove}
                  onRequestChanges={handleRequestChanges}
                  loading={loading}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {phase === "deploying" && <DeploymentAnimation onComplete={handleDeploymentComplete} />}
    </div>
  );
}
