"use client";

import { cn } from "@/utils/cn";
import { ANALYSIS_STEPS } from "@/types/onboarding";

interface OnboardingAnalysisProps {
  completedSteps: number;
  businessName: string;
}

export function OnboardingAnalysis({ completedSteps, businessName }: OnboardingAnalysisProps) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-sm font-medium tracking-wide text-[#8b95a5]">Aura goes to work</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#080f1a] sm:text-4xl">
        Setting up {businessName || "your business"}
      </h1>

      <ul className="mt-14 space-y-5 sm:mt-16">
        {ANALYSIS_STEPS.map((step, index) => {
          const isComplete = index <= completedSteps;
          const isActive = index === completedSteps;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-4 transition-all duration-500",
                !isComplete && !isActive && index > completedSteps + 1 && "opacity-30",
                isActive && "scale-[1.01]",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-500",
                  isComplete
                    ? "bg-[#2eb88a] text-white onboarding-check"
                    : "border-2 border-[#e5e7eb] bg-white text-transparent",
                )}
              >
                ✓
              </span>
              <span
                className={cn(
                  "text-lg font-medium transition-colors duration-500 sm:text-xl",
                  isComplete ? "text-[#080f1a]" : "text-[#8b95a5]",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
