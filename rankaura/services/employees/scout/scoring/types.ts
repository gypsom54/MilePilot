import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";

export interface ScoringInput {
  opportunity: ScoutOpportunity;
}

export interface ScoringResult {
  opportunityId: string;
  score: number;
  priority: "low" | "medium" | "high";
  factors: ScoringFactor[];
}

export interface ScoringFactor {
  label: string;
  value: number;
  weight: number;
}

export interface IOpportunityScoringEngine {
  score(opportunity: ScoutOpportunity): ScoringResult;
  scoreAll(opportunities: ScoutOpportunity[]): ScoutOpportunity[];
}
