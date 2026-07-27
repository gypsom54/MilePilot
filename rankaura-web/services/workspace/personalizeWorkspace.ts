import type { OnboardingSession } from "@/types/onboarding";
import type { WorkspaceData } from "@/types/workspace";

function timeOfDayGreeting(date = new Date()): "morning" | "afternoon" | "evening" {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/**
 * Sparse personalisation from onboarding session.
 * First name in greeting only; business name for identity.
 */
export function personalizeWorkspace(
  data: WorkspaceData,
  session: OnboardingSession | null,
): WorkspaceData {
  const firstName = session?.customerFirstName?.trim() || "";
  const businessName =
    session?.businessName?.trim() || data.welcome.businessName || "Your business";
  const period = timeOfDayGreeting();

  const greeting = firstName
    ? `Good ${period}, ${firstName}.`
    : `Good ${period}.`;

  return {
    ...data,
    welcome: {
      ...data.welcome,
      firstName,
      businessName,
      greeting,
      support: "RankAura has been working on your business.",
      monitoringLine:
        data.welcome.monitoringLine ||
        "RankAura is actively monitoring your business across 13 growth areas.",
    },
  };
}
