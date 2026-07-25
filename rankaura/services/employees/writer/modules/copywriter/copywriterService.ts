import { COPYWRITER_CONFIG } from "@/services/employees/writer/modules/copywriter/config";
import type { CopywriterOutput } from "@/services/employees/writer/modules/copywriter/types";
import type { IWriterModule, ModuleInput, ModuleOutput } from "@/services/employees/writer/orchestrator/types";

const MOCK_BODY = `When your boiler breaks down, you need help fast.

We provide same-day emergency boiler repair for homeowners across Manchester. Our experienced team arrives quickly, explains the problem in plain English, and gets your heating back on.

Call us today — we're here when you need us most.`;

export const copywriterModule: IWriterModule<void, CopywriterOutput> = {
  moduleId: COPYWRITER_CONFIG.moduleId,

  async execute(input: ModuleInput): Promise<ModuleOutput<CopywriterOutput>> {
    const payload: CopywriterOutput = {
      body: MOCK_BODY,
      wordCount: MOCK_BODY.split(/\s+/).length,
    };

    return {
      draft: { ...input.draft, body: payload.body, updatedAt: new Date().toISOString() },
      payload,
      moduleId: COPYWRITER_CONFIG.moduleId,
      completedAt: new Date().toISOString(),
    };
  },
};
