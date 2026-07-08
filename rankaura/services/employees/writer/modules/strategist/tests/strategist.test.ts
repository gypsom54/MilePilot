import { strategistModule } from "@/services/employees/writer/modules/strategist/strategistService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runStrategistTests(): Promise<{ passed: number; failed: number }> {
  const draft = { ...MOCK_CONTENT_DRAFT, status: "planned" as const, planSummary: "Plan ready" };
  const result = await strategistModule.execute({ draft });
  return { passed: result.draft.status === "strategised" ? 1 : 0, failed: result.draft.status === "strategised" ? 0 : 1 };
}
