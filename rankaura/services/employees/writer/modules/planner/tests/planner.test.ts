import { plannerModule } from "@/services/employees/writer/modules/planner/plannerService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runPlannerTests(): Promise<{ passed: number; failed: number }> {
  const result = await plannerModule.execute({ draft: MOCK_CONTENT_DRAFT, payload: { brief: MOCK_CONTENT_DRAFT.brief } });
  return { passed: result.draft.status === "planned" ? 1 : 0, failed: result.draft.status === "planned" ? 0 : 1 };
}
