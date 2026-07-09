"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AuraAssistant } from "@/components/mission-mode/AuraAssistant";
import { LiveAIFeed } from "@/components/mission-mode/LiveAIFeed";
import { MissionDocument } from "@/components/mission-mode/MissionDocument";
import { MissionModeBackground } from "@/components/mission-mode/MissionModeBackground";
import { MissionModeDeployment } from "@/components/mission-mode/MissionModeDeployment";
import { MissionPipeline } from "@/components/mission-mode/MissionPipeline";
import { useMissionModeEngine } from "@/hooks/useMissionModeEngine";
import { approveMission as approveMissionService } from "@/services/mission/missionService";
import type { MissionModePhase } from "@/types/mission-mode";
import type { Mission } from "@/types/mission";

interface MissionModeProps {
  mission: Mission;
}

export function MissionMode({ mission: initialMission }: MissionModeProps) {
  const [mission, setMission] = useState(initialMission);
  const [phase, setPhase] = useState<MissionModePhase>("entering");
  const engine = useMissionModeEngine(phase === "active");

  useEffect(() => {
    const fromDashboard = sessionStorage.getItem("rankaura-mission-mode-enter");
    sessionStorage.removeItem("rankaura-mission-mode-enter");
    document.documentElement.classList.remove("mission-mode-transitioning");

    const delay = fromDashboard ? 400 : 150;
    const timer = window.setTimeout(() => setPhase("active"), delay);
    return () => window.clearTimeout(timer);
  }, []);

  const handleDeployComplete = useCallback(async () => {
    const updated = await approveMissionService(mission.id);
    if (updated) setMission(updated);
  }, [mission.id]);

  const handleApprove = useCallback(() => {
    setPhase("deploying");
  }, []);

  const isReviewable =
    mission.workspaceStatus === "ready_for_approval" ||
    mission.workspaceStatus === "in_review" ||
    mission.workspaceStatus === "pending";

  return (
    <div
      className={`mission-mode relative min-h-screen overflow-hidden bg-[var(--mm-bg)] text-[var(--mm-text)] ${
        phase === "entering" ? "mission-mode-entering" : "mission-mode-active"
      } ${phase === "deploying" ? "mission-mode-fading" : ""}`}
    >
      <MissionModeBackground />

      <header className="relative z-20 flex items-center justify-between border-b border-[var(--mm-border)] bg-[var(--mm-surface)]/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs font-medium text-[var(--mm-text-muted)] transition-colors hover:text-[var(--mm-aura-soft)]"
          >
            ← Mission Control
          </Link>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--mm-aura-soft)]">
              Mission Mode
            </p>
            <h1 className="mt-0.5 text-sm font-semibold text-[var(--mm-text)] sm:text-base">
              {mission.title}
            </h1>
          </div>
        </div>

        {isReviewable && phase === "active" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="mission-mode-cta rounded-xl border border-[var(--mm-border)] px-5 py-2.5 text-xs font-semibold text-[var(--mm-text-secondary)] transition-all hover:border-[var(--mm-aura)] hover:text-[var(--mm-text)]"
            >
              Request Changes
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="mission-mode-cta rounded-xl bg-gradient-to-r from-[var(--mm-aura)] to-[#3d7af5] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_4px_24px_rgba(47,111,237,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_6px_32px_rgba(47,111,237,0.45)]"
            >
              Approve Mission
            </button>
          </div>
        )}
      </header>

      <div className="relative z-10 grid h-[calc(100vh-65px)] grid-cols-1 lg:grid-cols-[minmax(220px,260px)_1fr_minmax(240px,280px)]">
        <MissionPipeline employees={engine.employees} missionProgress={engine.missionProgress} />
        <MissionDocument mission={mission} />
        <LiveAIFeed events={engine.feed} />
      </div>

      {phase === "active" && <AuraAssistant insight={engine.auraInsight} />}

      {phase === "deploying" && <MissionModeDeployment onComplete={handleDeployComplete} />}
    </div>
  );
}
