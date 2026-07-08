/**
 * Onboarding service — local persistence only (Phase 1).
 */

import type { OnboardingData } from "@/types/onboarding";

const STORAGE_KEY = "rankaura-onboarding";

export function getStoredOnboarding(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markOnboardingComplete(data: OnboardingData): OnboardingData {
  const completed: OnboardingData = {
    ...data,
    completedAt: new Date().toISOString(),
  };
  saveOnboardingData(completed);
  document.cookie = "aura-onboarded=1; path=/; max-age=31536000; SameSite=Lax";
  return completed;
}

export async function simulateAnalysis(
  onStepComplete: (index: number) => void,
  stepDurationMs = 700,
): Promise<void> {
  for (let i = 0; i < 6; i++) {
    await new Promise((resolve) => setTimeout(resolve, stepDurationMs));
    onStepComplete(i);
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
}
