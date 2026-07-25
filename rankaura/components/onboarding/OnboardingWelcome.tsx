"use client";

import { RankAuraLogo } from "@/components/brand/RankAuraLogo";
import { OnboardingPrimaryButton } from "@/components/onboarding/OnboardingFields";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

interface OnboardingWelcomeProps {
  onGetStarted: () => void;
}

/**
 * Screen 1 — RankAura brand welcome (locked brand direction).
 */
export function OnboardingWelcome({ onGetStarted }: OnboardingWelcomeProps) {
  return (
    <OnboardingShell stepIndex={0} showProgress={false} animate={false}>
      <div className="relative flex flex-col items-center text-center">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(79, 142, 247, 0.18) 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="onboarding-brand-logo">
          <RankAuraLogo />
        </div>

        <h1 className="onboarding-brand-headline mt-12 max-w-md text-4xl font-semibold leading-[1.12] tracking-tight text-[#080f1a] sm:mt-14 sm:text-5xl sm:leading-[1.08]">
          We Help Grow Businesses.
        </h1>

        <p className="onboarding-brand-support mt-6 max-w-md text-lg leading-relaxed text-[#5b6b7c] sm:mt-8 sm:text-xl">
          RankAura quietly improves your online presence while you focus on running your business.
        </p>

        <div className="onboarding-brand-cta w-full max-w-md">
          <OnboardingPrimaryButton onClick={onGetStarted}>Get Started</OnboardingPrimaryButton>
        </div>
      </div>
    </OnboardingShell>
  );
}
