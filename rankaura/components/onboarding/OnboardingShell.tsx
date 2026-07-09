"use client";

import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface OnboardingShellProps {
  children: ReactNode;
  stepIndex?: number;
  totalSteps?: number;
  showProgress?: boolean;
  animate?: boolean;
}

export function OnboardingShell({
  children,
  stepIndex = 0,
  totalSteps = 4,
  showProgress = true,
  animate = true,
}: OnboardingShellProps) {
  return (
    <div className="onboarding-root flex min-h-screen flex-col bg-[#fafafa]">
      {showProgress && (
        <div className="flex justify-center gap-2 pt-12">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === stepIndex
                  ? "w-8 bg-[#080f1a]"
                  : i < stepIndex
                    ? "w-1.5 bg-[#080f1a]/40"
                    : "w-1.5 bg-[#080f1a]/10",
              )}
            />
          ))}
        </div>
      )}

      <main className="flex flex-1 flex-col items-center justify-center px-8 py-16 sm:px-12">
        <div className={`w-full max-w-lg ${animate ? "onboarding-enter" : ""}`}>{children}</div>
      </main>
    </div>
  );
}
