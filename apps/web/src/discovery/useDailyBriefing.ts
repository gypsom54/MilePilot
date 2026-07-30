import { useMemo } from "react";
import {
  MOCK_DAILY_BRIEFING,
  greetingForHour,
  type DailyBriefing,
} from "../content/briefing";
import { useDiscovery } from "./DiscoveryContext";

/**
 * Resolves the daily briefing for the personal workspace.
 * Uses typed mock briefing data; ready to replace with live adapters later.
 * Follows DiscoveryProvider so profile/summary remain available to sections.
 */
export function useDailyBriefing(): DailyBriefing {
  const { profile } = useDiscovery();

  return useMemo(() => {
    const hour = new Date().getHours();
    return {
      ...MOCK_DAILY_BRIEFING,
      greeting: greetingForHour(hour),
      statusLines: MOCK_DAILY_BRIEFING.statusLines.map((line) =>
        line.id === "monitoring"
          ? {
              ...line,
              text: `Monitoring continues for ${profile.businessName}`,
            }
          : line,
      ),
    };
  }, [profile.businessName]);
}
