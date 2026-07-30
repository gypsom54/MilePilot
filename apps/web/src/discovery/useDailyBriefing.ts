import { useMemo } from "react";
import { MOCK_DAILY_BRIEFING, type DailyBriefing } from "../content/briefing";
import { useDiscovery } from "./DiscoveryContext";

/**
 * Resolves the daily Business Briefing for the personal workspace.
 * Uses typed mock briefing data; ready to replace with live adapters later.
 * Follows DiscoveryProvider so D3 profile/summary remain available to sections.
 */
export function useDailyBriefing(): DailyBriefing {
  // Discovery context kept in the dependency graph for future live wiring.
  useDiscovery();

  return useMemo(() => MOCK_DAILY_BRIEFING, []);
}
