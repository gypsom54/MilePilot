"use client";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

interface OnboardingWelcomeProps {
  onGetStarted: () => void;
}

export function OnboardingWelcome({ onGetStarted }: OnboardingWelcomeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ra-ink">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-10 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-medium text-ra-ink">
          RankAura{" "}
          <span className="font-normal text-ra-muted">
            — We Help Grow Businesses.
          </span>
        </p>
        <div className="mt-auto flex flex-col pb-6 sm:pb-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            We Help Grow Businesses.
          </h1>
          <p className="mt-5 max-w-md text-base font-normal leading-relaxed text-ra-muted sm:text-lg">
            RankAura quietly improves your online presence while you focus on
            running your business.
          </p>
          <ButtonPrimary
            type="button"
            onClick={onGetStarted}
            className="mt-12 h-12 w-full rounded-full sm:w-auto"
          >
            Get Started
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
