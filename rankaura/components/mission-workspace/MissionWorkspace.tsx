"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  ApprovalPanel,
  ArchitectChecklist,
  BusinessImpactCard,
  GuardianChecklist,
  MissionHeader,
  MissionWorkspaceSkeleton,
  ScoutInsightCard,
  WriterDraftPreview,
} from "@/components/mission-workspace";
import { mockBusiness } from "@/lib/mock-dashboard";
import {
  approveDraft,
  approveMission as approveMissionService,
  archiveMission,
  leaveFeedback,
  requestChanges,
  requestRewrite,
} from "@/services/mission/missionService";
import type { Mission } from "@/types/mission";

interface MissionWorkspaceProps {
  initialMission: Mission;
}

/**
 * Mission Workspace — intelligence briefing for AI department output.
 * Universal layout: future departments (SEO, Ads, Email, etc.) plug into sections.
 */
export function MissionWorkspace({ initialMission }: MissionWorkspaceProps) {
  const [mission, setMission] = useState(initialMission);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const runAction = useCallback(async (action: () => Promise<Mission | null>) => {
    setLoading(true);
    const updated = await action();
    if (updated) {
      setMission(updated);
      if (updated.workspaceStatus === "approved") {
        setShowSuccess(true);
        window.setTimeout(() => setShowSuccess(false), 3000);
      }
    }
    setLoading(false);
  }, []);

  const openRequestChanges = useCallback(() => {
    const panel = document.getElementById("approval-panel");
    panel?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar business={mockBusiness} />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl px-8 py-10 sm:px-10 sm:py-12">
          {!isReady ? (
            <MissionWorkspaceSkeleton />
          ) : (
            <div className="space-y-8">
              {showSuccess && (
                <div className="animate-fade-in rounded-xl border border-[var(--color-emerald-muted)] bg-[var(--color-emerald-muted)]/30 px-5 py-4 text-center text-sm font-medium text-emerald-800">
                  Mission approved — Aura has continued execution.
                </div>
              )}

              <MissionHeader
                mission={mission}
                onApprove={() => runAction(() => approveMissionService(mission.id))}
                onRequestChanges={openRequestChanges}
                loading={loading}
              />

              <ScoutInsightCard report={mission.scout} />
              <WriterDraftPreview
                draft={mission.writer}
                onApproveDraft={() => runAction(() => approveDraft(mission.id))}
                onRequestRewrite={() => runAction(() => requestRewrite(mission.id))}
                loading={loading}
              />
              <ArchitectChecklist review={mission.architect} />
              <GuardianChecklist review={mission.guardian} />
              <BusinessImpactCard impact={mission.briefingImpact} />

              <div id="approval-panel">
                <ApprovalPanel
                  mission={mission}
                  onApprove={() => runAction(() => approveMissionService(mission.id))}
                  onRequestChanges={(c) => runAction(() => requestChanges(mission.id, c))}
                  onArchive={() => runAction(() => archiveMission(mission.id))}
                  onLeaveFeedback={(c) => runAction(() => leaveFeedback(mission.id, c))}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
