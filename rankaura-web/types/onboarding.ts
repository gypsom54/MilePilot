export type OnboardingStep =
  | "welcome"
  | "name"
  | "nice-to-meet-you"
  | "website"
  | "business-name"
  | "business-description"
  | "analysis";

export interface OnboardingData {
  customerFirstName: string;
  website: string;
  businessName: string;
  businessDescription: string;
}

export interface OnboardingSession extends OnboardingData {
  completed: boolean;
  updatedAt: string;
}

export const ANALYSIS_STEPS = [
  { id: "business", label: "Understanding your business" },
  { id: "market", label: "Researching your market" },
  { id: "competitors", label: "Analysing competitors" },
  { id: "website", label: "Reviewing your online presence" },
  { id: "opportunities", label: "Finding growth opportunities" },
  { id: "plan", label: "Building your Growth Plan" },
] as const;

export const EMPTY_ONBOARDING_DATA: OnboardingData = {
  customerFirstName: "",
  website: "",
  businessName: "",
  businessDescription: "",
};
