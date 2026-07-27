import type { OnboardingData, OnboardingSession } from "@/types/onboarding";
import { EMPTY_ONBOARDING_DATA } from "@/types/onboarding";

const STORAGE_KEY = "rankaura.onboarding.session.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveOnboardingData(data: OnboardingData): OnboardingSession {
  const session: OnboardingSession = {
    ...data,
    completed: false,
    updatedAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function markOnboardingComplete(data: OnboardingData): OnboardingSession {
  const session: OnboardingSession = {
    ...data,
    completed: true,
    updatedAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function loadOnboardingSession(): OnboardingSession | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as OnboardingSession;
    return {
      ...EMPTY_ONBOARDING_DATA,
      ...parsed,
      customerFirstName: parsed.customerFirstName?.trim() ?? "",
      website: parsed.website?.trim() ?? "",
      businessName: parsed.businessName?.trim() ?? "",
      businessDescription: parsed.businessDescription?.trim() ?? "",
    };
  } catch {
    return null;
  }
}

export function clearOnboardingSession(): void {
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/** Infer site family from website presence for Growth Plan handoff. */
export function inferSiteFamily(
  website: string,
): "existing" | "new" {
  const value = website.trim().toLowerCase();
  if (!value) return "new";
  if (
    value === "n/a" ||
    value === "none" ||
    value === "no website" ||
    value.includes("no-website")
  ) {
    return "new";
  }
  return "existing";
}

export function simulateAnalysis(
  onStep: (index: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    let index = -1;
    const tick = () => {
      index += 1;
      onStep(index);
      if (index >= 5) {
        window.setTimeout(resolve, 600);
        return;
      }
      window.setTimeout(tick, 550);
    };
    window.setTimeout(tick, 400);
  });
}
