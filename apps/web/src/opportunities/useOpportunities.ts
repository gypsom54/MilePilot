import { useMemo } from "react";
import {
  getGroupedOpportunities,
  getOpportunityBySlug,
  getTopOpportunities,
  resolvePriorityBand,
  PRIORITY_BAND_LABELS,
  type Opportunity,
  type PriorityBand,
} from "../content/opportunities";

export type OpportunityViewModel = Opportunity & {
  priorityBand: PriorityBand;
  priorityLabel: string;
};

function toViewModel(opportunity: Opportunity): OpportunityViewModel {
  const priorityBand = resolvePriorityBand(
    opportunity.impactLevel,
    opportunity.effortLevel,
  );
  return {
    ...opportunity,
    priorityBand,
    priorityLabel: PRIORITY_BAND_LABELS[priorityBand],
  };
}

/**
 * Sprint D6 opportunity helpers for UI.
 * Mock-only — ready to swap for a live Opportunity Engine adapter later.
 */
export function useOpportunities() {
  return useMemo(() => {
    const grouped = getGroupedOpportunities().map((group) => ({
      category: group.category,
      opportunities: group.opportunities.map(toViewModel),
    }));
    const top = getTopOpportunities(3).map(toViewModel);
    const firstPriority = top[0] ?? null;

    return {
      grouped,
      top,
      firstPriority,
      getBySlug: (slug: string) => {
        const found = getOpportunityBySlug(slug);
        return found ? toViewModel(found) : undefined;
      },
    };
  }, []);
}
