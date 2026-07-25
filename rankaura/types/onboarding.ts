/**
 * Onboarding types — Phase 1 Magic Moment.
 */

export type OnboardingStep =
  | "welcome"
  | "website"
  | "business-name"
  | "business-description"
  | "analysis";

export interface OnboardingData {
  website: string;
  businessName: string;
  businessDescription: string;
  completedAt?: string;
}

export const ONBOARDING_COOKIE = "aura-onboarded";

export const ANALYSIS_STEPS = [
  { id: "reading", label: "Reading website" },
  { id: "understanding", label: "Understanding business" },
  { id: "opportunities", label: "Finding opportunities" },
  { id: "planning", label: "Planning improvements" },
  { id: "team", label: "Building your Growth Team" },
  { id: "mission", label: "Preparing first mission" },
] as const;
