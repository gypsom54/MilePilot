import { seoReviewerModule } from "@/services/employees/writer/modules/seo-reviewer/seoReviewerService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runSEOReviewerTests(): Promise<{ passed: number; failed: number }> {
  const draft = { ...MOCK_CONTENT_DRAFT, status: "edited" as const, editedBody: "Content" };
  const result = await seoReviewerModule.execute({ draft });
  return { passed: result.payload.score.passed ? 1 : 0, failed: result.payload.score.passed ? 0 : 1 };
}
