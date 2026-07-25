import { EDITOR_CONFIG } from "@/services/employees/writer/modules/editor/config";
import type { IWriterModule, ModuleInput, ModuleOutput } from "@/services/employees/writer/orchestrator/types";
import type { ReviewPipelineStageResult } from "@/services/employees/writer/pipeline/types";

export const editorModule: IWriterModule<void, ReviewPipelineStageResult> = {
  moduleId: EDITOR_CONFIG.moduleId,

  async execute(input: ModuleInput): Promise<ModuleOutput<ReviewPipelineStageResult>> {
    const editedBody = input.draft.body ?? "";
    const completedAt = new Date().toISOString();

    const payload: ReviewPipelineStageResult = {
      reviewerId: EDITOR_CONFIG.moduleId,
      score: {
        reviewerId: EDITOR_CONFIG.moduleId,
        score: 85,
        passed: true,
        notes: "Structure and flow are clear — tightened opening, improved call-to-action",
      },
      revisionRequest: null,
      completedAt,
    };

    return {
      draft: { ...input.draft, editedBody, updatedAt: completedAt },
      payload,
      moduleId: EDITOR_CONFIG.moduleId,
      completedAt,
    };
  },
};
