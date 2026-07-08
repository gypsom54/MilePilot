import { PLANNER_CONFIG } from "@/services/employees/writer/modules/planner/config";
import type { IWriterModule, ModuleInput, ModuleOutput } from "@/services/employees/writer/orchestrator/types";
import type { PlannerInput, PlannerOutput } from "@/services/employees/writer/modules/planner/types";

export const plannerModule: IWriterModule<PlannerInput, PlannerOutput> = {
  moduleId: PLANNER_CONFIG.moduleId,

  async execute(input: ModuleInput<PlannerInput>): Promise<ModuleOutput<PlannerOutput>> {
    const plan: PlannerOutput = {
      outline: ["Introduction", "Service overview", "Why choose us", "Call to action"],
      targetAudience: "Local homeowners needing urgent help",
      estimatedWordCount: 600,
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    };

    return {
      draft: {
        ...input.draft,
        planSummary: `Plan: ${plan.outline.join(" → ")}`,
        updatedAt: new Date().toISOString(),
      },
      payload: plan,
      moduleId: PLANNER_CONFIG.moduleId,
      completedAt: new Date().toISOString(),
    };
  },
};
