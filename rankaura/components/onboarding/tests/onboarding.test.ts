import { ANALYSIS_STEPS } from "@/types/onboarding";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { simulateAnalysis } from "@/services/onboarding/onboardingService";

export async function runOnboardingTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(typeof OnboardingFlow === "function");
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
