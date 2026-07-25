import { STRATEGIST_CONFIG } from "@/services/employees/writer/modules/strategist/config";
import type { StrategistOutput } from "@/services/employees/writer/modules/strategist/types";
import type { IWriterModule, ModuleInput, ModuleOutput } from "@/services/employees/writer/orchestrator/types";

export const strategistModule: IWriterModule<void, StrategistOutput> = {
  moduleId: STRATEGIST_CONFIG.moduleId,

  async execute(input: ModuleInput): Promise<ModuleOutput<StrategistOutput>> {
    const strategy: StrategistOutput = {
      angle: "Reassuring local expert available when it matters most",
      keyMessages: ["Fast response", "Trusted local service", "Clear pricing"],
      callToAction: "Call now for same-day repair",
      toneGuidance: "Calm, confident, plain English",
    };

    return {
      draft: { ...input.draft, strategySummary: strategy.angle, updatedAt: new Date().toISOString() },
      payload: strategy,
      moduleId: STRATEGIST_CONFIG.moduleId,
      completedAt: new Date().toISOString(),
    };
  },
};
