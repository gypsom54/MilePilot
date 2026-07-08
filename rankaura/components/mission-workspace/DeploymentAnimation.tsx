"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export const DEPLOYMENT_STEPS = [
  { id: "writer", label: "Writer" },
  { id: "architect", label: "Architect" },
  { id: "publisher", label: "Publisher" },
  { id: "website", label: "Website Updated" },
] as const;

const STEP_INTERVAL_MS = 900;

interface DeploymentAnimationProps {
  onComplete: () => void;
}

export function DeploymentAnimation({ onComplete }: DeploymentAnimationProps) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    DEPLOYMENT_STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setCompletedCount(index + 1);
        }, (index + 1) * STEP_INTERVAL_MS),
      );
    });

    timers.push(
      setTimeout(() => {
        onComplete();
      }, DEPLOYMENT_STEPS.length * STEP_INTERVAL_MS + 600),
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="w-full max-w-md px-8 animate-fade-in">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          Deploying mission
        </p>
        <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          Your Growth Team is publishing
        </h2>

        <ul className="mt-12 space-y-5">
          {DEPLOYMENT_STEPS.map((step, index) => {
            const isComplete = index < completedCount;
            const isActive = index === completedCount - 1 && completedCount > 0;
            const isPending = index >= completedCount;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center justify-between rounded-xl px-6 py-4 transition-all duration-500",
                  isComplete && "bg-[var(--color-emerald-muted)]/30",
                  isActive && "scale-[1.02] bg-[var(--color-emerald-muted)]/20",
                  isPending && "opacity-40",
                )}
              >
                <span className="text-base font-medium text-[var(--color-text-primary)]">
                  {step.label}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                    isComplete
                      ? "bg-[var(--color-emerald)] text-white animate-deployment-check"
                      : "bg-[var(--color-border-subtle)] text-transparent",
                  )}
                >
                  ✓
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export const AURA_MISSION_COMPLETE_MESSAGE = {
  title: "Mission Complete.",
  body: "Your business has been improved.",
  footer: "Next mission is already being prepared.",
};

interface AuraConfirmationProps {
  className?: string;
}

export function AuraConfirmation({ className }: AuraConfirmationProps) {
  return (
    <div
      className={cn(
        "animate-fade-in rounded-2xl bg-[var(--color-surface)] px-10 py-12 text-center shadow-[var(--shadow-md)] sm:px-16 sm:py-16",
        className,
      )}
    >
      <span
        aria-hidden
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-emerald-muted)] text-2xl text-emerald-700"
      >
        ✓
      </span>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {AURA_MISSION_COMPLETE_MESSAGE.title}
      </h2>
      <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
        {AURA_MISSION_COMPLETE_MESSAGE.body}
      </p>
      <p className="mt-6 text-sm font-medium text-[var(--color-aura)]">
        {AURA_MISSION_COMPLETE_MESSAGE.footer}
      </p>
    </div>
  );
}
