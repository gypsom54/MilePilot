"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { MISSION_MODE_DEPLOYMENT_EMPLOYEES } from "@/types/mission-mode";

const DEPLOY_LABELS: Record<string, string> = {
  scout: "Scout",
  writer: "Writer",
  guardian: "Guardian",
  architect: "Architect",
  publisher: "Publisher",
};

const STEP_MS = 900;

interface MissionModeDeploymentProps {
  onComplete: () => void;
}

export function MissionModeDeployment({ onComplete }: MissionModeDeploymentProps) {
  const [phase, setPhase] = useState<"deploying" | "complete">("deploying");
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MISSION_MODE_DEPLOYMENT_EMPLOYEES.forEach((_, index) => {
      timers.push(
        setTimeout(() => setLitCount(index + 1), (index + 1) * STEP_MS),
      );
    });

    timers.push(
      setTimeout(() => setPhase("complete"), MISSION_MODE_DEPLOYMENT_EMPLOYEES.length * STEP_MS + 600),
    );

    timers.push(
      setTimeout(() => onComplete(), MISSION_MODE_DEPLOYMENT_EMPLOYEES.length * STEP_MS + 800),
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="mission-mode-deploy-overlay fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#060a12]/90 backdrop-blur-xl" />

      <div className="relative z-10 w-full max-w-lg px-8 text-center">
        {phase === "deploying" ? (
          <>
            <p className="mission-mode-deploy-text text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--mm-text-muted)]">
              Deploying Mission...
            </p>
            <ul className="mt-14 space-y-4">
              {MISSION_MODE_DEPLOYMENT_EMPLOYEES.map((id, index) => {
                const isLit = index < litCount;
                return (
                  <li
                    key={id}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-8 py-5 transition-all duration-700",
                      isLit
                        ? "mission-mode-deploy-lit scale-100 bg-white/[0.06] opacity-100"
                        : "scale-[0.98] opacity-25",
                    )}
                  >
                    <span className="text-lg font-medium text-[var(--mm-text)]">
                      {DEPLOY_LABELS[id]}
                    </span>
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-all duration-500",
                        isLit
                          ? "bg-[var(--mm-emerald)] text-white mission-mode-deploy-check"
                          : "bg-white/5 text-transparent",
                      )}
                    >
                      ✓
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="mission-mode-deploy-complete animate-fade-in">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--mm-emerald)]">
              Mission Deployed
            </p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--mm-text)] sm:text-5xl">
              MISSION DEPLOYED
            </h2>
            <p className="mt-6 text-lg text-[var(--mm-text-secondary)]">
              Aura has taken control.
            </p>
            <p className="mt-4 text-sm text-[var(--mm-text-muted)]">
              Estimated management time:{" "}
              <span className="font-semibold text-[var(--mm-text)]">0 minutes</span>
            </p>
            <Link
              href="/"
              className="mission-mode-cta mt-12 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--mm-aura)] to-[var(--mm-emerald)] px-10 py-4 text-sm font-semibold text-white"
            >
              Return to Mission Control
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
