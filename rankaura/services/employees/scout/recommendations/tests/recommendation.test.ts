import { recommendationGenerator } from "@/services/employees/scout/recommendations/recommendationGenerator";
import { MOCK_SCOUT_OPPORTUNITIES } from "@/services/employees/scout/mock";

export async function runRecommendationTests(): Promise<{ passed: number; failed: number }> {
  const result = await recommendationGenerator.generate({
    businessId: "test",
    opportunities: MOCK_SCOUT_OPPORTUNITIES,
  });

  return {
    passed: result.recommendations.length > 0 ? 1 : 0,
    failed: result.recommendations.length > 0 ? 0 : 1,
  };
}
