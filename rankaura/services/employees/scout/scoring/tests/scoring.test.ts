import { scoringEngine } from "@/services/employees/scout/scoring/scoringEngine";
import { MOCK_SCOUT_OPPORTUNITIES } from "@/services/employees/scout/mock";

export function runScoringTests(): { passed: number; failed: number } {
  const scored = scoringEngine.scoreAll(MOCK_SCOUT_OPPORTUNITIES);
  const top = scored[0];

  return {
    passed: top && top.score >= top.confidence * 0.3 ? 1 : 0,
    failed: top && top.score >= top.confidence * 0.3 ? 0 : 1,
  };
}
