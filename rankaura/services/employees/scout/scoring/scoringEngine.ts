/**
 * Opportunity scoring engine — ranks research findings by business impact.
 * No AI. Deterministic weighted scoring.
 */

import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";
import { SCORING_ENGINE_CONFIG } from "@/services/employees/scout/scoring/config";
import type {
  IOpportunityScoringEngine,
  ScoringFactor,
  ScoringResult,
} from "@/services/employees/scout/scoring/types";

function normalise(value: number, max: number): number {
  return Math.min(100, Math.round((value / max) * 100));
}

function resolvePriority(score: number): "low" | "medium" | "high" {
  if (score >= SCORING_ENGINE_CONFIG.priorityThresholds.high) return "high";
  if (score >= SCORING_ENGINE_CONFIG.priorityThresholds.medium) return "medium";
  return "low";
}

export const scoringEngine: IOpportunityScoringEngine = {
  score(opportunity: ScoutOpportunity): ScoringResult {
    const { weights } = SCORING_ENGINE_CONFIG;

    const factors: ScoringFactor[] = [
      { label: "Confidence", value: opportunity.confidence, weight: weights.confidence },
      {
        label: "Estimated visitors",
        value: normalise(opportunity.estimatedVisitors, 500),
        weight: weights.visitors,
      },
      {
        label: "Potential leads",
        value: normalise(opportunity.potentialLeads, 20),
        weight: weights.leads,
      },
    ];

    const score = Math.round(
      factors.reduce((total, f) => total + f.value * f.weight, 0),
    );

    return {
      opportunityId: opportunity.id,
      score,
      priority: resolvePriority(score),
      factors,
    };
  },

  scoreAll(opportunities: ScoutOpportunity[]): ScoutOpportunity[] {
    return opportunities
      .map((opp) => {
        const result = this.score(opp);
        return { ...opp, score: result.score, priority: result.priority };
      })
      .sort((a, b) => b.score - a.score);
  },
};
