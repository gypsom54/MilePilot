import { readabilityReviewerModule } from "@/services/employees/writer/modules/readability-reviewer/readabilityReviewerService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runReadabilityReviewerTests(): Promise<{ passed: number; failed: number }> {
  const result = await readabilityReviewerModule.execute({ draft: { ...MOCK_CONTENT_DRAFT, status: "edited", editedBody: "x" } });
  return { passed: result.payload.score.passed ? 1 : 0, failed: result.payload.score.passed ? 0 : 1 };
}
