import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";

export interface RecommendationInput {
  businessId: string;
  opportunities: ScoutOpportunity[];
}

export interface ScoutRecommendation {
  id: string;
  opportunityId: string;
  title: string;
  action: string;
  rationale: string;
  priority: "low" | "medium" | "high";
}

export interface RecommendationOutput {
  businessId: string;
  recommendations: ScoutRecommendation[];
  generatedAt: string;
}

export interface IRecommendationGenerator {
  generate(input: RecommendationInput): Promise<RecommendationOutput>;
}
