/**
 * Recommendation generator — turns scored opportunities into plain-English actions.
 */

import { RECOMMENDATION_CONFIG } from "@/services/employees/scout/recommendations/config";
import type {
  IRecommendationGenerator,
  RecommendationInput,
  RecommendationOutput,
  ScoutRecommendation,
} from "@/services/employees/scout/recommendations/types";

const ACTION_TEMPLATES: Record<string, string> = {
  high: "Prioritise this — strong customer demand in your area.",
  medium: "Worth exploring when your team has capacity.",
  low: "Keep on the radar for future growth.",
};

export const recommendationGenerator: IRecommendationGenerator = {
  async generate(input: RecommendationInput): Promise<RecommendationOutput> {
    const top = input.opportunities
      .sort((a, b) => b.score - a.score)
      .slice(0, RECOMMENDATION_CONFIG.maxRecommendations);

    const recommendations: ScoutRecommendation[] = top.map((opp, index) => ({
      id: `rec-${index + 1}`,
      opportunityId: opp.id,
      title: opp.title,
      action: `Review and approve a plan for "${opp.title}"`,
      rationale: ACTION_TEMPLATES[opp.priority],
      priority: opp.priority,
    }));

    return {
      businessId: input.businessId,
      recommendations,
      generatedAt: new Date().toISOString(),
    };
  },
};
