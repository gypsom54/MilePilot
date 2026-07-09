import { ANALYSIS_STEPS } from "@/types/onboarding";
import { RankAuraLogo } from "@/components/brand/RankAuraLogo";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { OnboardingWelcome } from "@/components/onboarding/OnboardingWelcome";
import { simulateAnalysis } from "@/services/onboarding/onboardingService";

export const BRAND_PROMISE = "We Help Grow Businesses.";

export async function runOnboardingTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(typeof OnboardingFlow === "function");
  assert(typeof OnboardingWelcome === "function");
  assert(typeof RankAuraLogo === "function");
  assert(BRAND_PROMISE === "We Help Grow Businesses.");
  assert(ANALYSIS_STEPS.length === 6);
  assert(ANALYSIS_STEPS[0].label === "Reading website");
  assert(ANALYSIS_STEPS[5].label === "Preparing first mission");

  let stepsCompleted = 0;
  await simulateAnalysis((index) => {
    stepsCompleted = index + 1;
  }, 10);
  assert(stepsCompleted === 6);

  return { passed, failed };
}
