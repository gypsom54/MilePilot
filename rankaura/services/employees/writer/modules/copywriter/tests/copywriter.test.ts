import { copywriterModule } from "@/services/employees/writer/modules/copywriter/copywriterService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runCopywriterTests(): Promise<{ passed: number; failed: number }> {
  const draft = { ...MOCK_CONTENT_DRAFT, status: "strategised" as const, strategySummary: "Strategy ready" };
  const result = await copywriterModule.execute({ draft });
  return { passed: result.draft.body !== null ? 1 : 0, failed: result.draft.body !== null ? 0 : 1 };
}
