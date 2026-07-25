import { brandReviewerModule } from "@/services/employees/writer/modules/brand-reviewer/brandReviewerService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runBrandReviewerTests(): Promise<{ passed: number; failed: number }> {
  const result = await brandReviewerModule.execute({ draft: { ...MOCK_CONTENT_DRAFT, status: "edited", editedBody: "x" } });
  return { passed: result.payload.score.passed ? 1 : 0, failed: result.payload.score.passed ? 0 : 1 };
}
