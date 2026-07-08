import { draftLifecycle } from "@/services/employees/writer/lifecycle/draftLifecycle";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export function runLifecycleTests(): { passed: number; failed: number } {
  const result = draftLifecycle.transition(
    { ...MOCK_CONTENT_DRAFT },
    "planned",
    "planner",
    "Content plan created",
  );

  return {
    passed: result.newStatus === "planned" ? 1 : 0,
    failed: result.newStatus === "planned" ? 0 : 1,
  };
}
