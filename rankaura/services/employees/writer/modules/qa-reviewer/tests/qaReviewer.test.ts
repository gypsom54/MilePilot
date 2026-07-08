import { qaReviewerModule } from "@/services/employees/writer/modules/qa-reviewer/qaReviewerService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runQAReviewerTests(): Promise<{ passed: number; failed: number }> {
  const result = await qaReviewerModule.execute({ draft: { ...MOCK_CONTENT_DRAFT, status: "edited", editedBody: "x" } });
  return { passed: result.payload.score.passed ? 1 : 0, failed: result.payload.score.passed ? 0 : 1 };
}
