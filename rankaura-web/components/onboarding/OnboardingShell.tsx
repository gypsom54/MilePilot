"use client";

import { cn } from "@/utils/cn";

interface OnboardingShellProps {
  stepIndex: number;
  totalSteps?: number;
  showProgress?: boolean;
  children: React.ReactNode;
}

export function OnboardingShell({
  stepIndex,
  totalSteps = 4,
  showProgress = true,
  children,
}: OnboardingShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#080f1a]">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-10 pt-8 sm:px-8 sm:pt-12">
        {showProgress ? (
          <div
            className="mb-10 flex gap-2"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-valuenow={stepIndex + 1}
            aria-label="Onboarding progress"
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  index <= stepIndex ? "bg-[#080f1a]" : "bg-[#e5e7eb]",
                )}
              />
            ))}
          </div>
        ) : (
          <div className="mb-10 h-1" aria-hidden="true" />
        )}
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
