/**
 * Shared reviewer module factory — each reviewer has exactly one responsibility.
 */

import type { ContentQualityScore } from "@/services/employees/writer/models/content-quality";
import type { RevisionRequest } from "@/services/employees/writer/models/revision-request";
import type { IWriterModule, ModuleInput, ModuleOutput } from "@/services/employees/writer/orchestrator/types";
import type { ReviewPipelineStageResult } from "@/services/employees/writer/pipeline/types";

export interface ReviewerConfig {
  moduleId: string;
  name: string;
  responsibility: string;
  defaultScore: number;
  defaultPassed: boolean;
  defaultNotes: string;
  revisionSummary?: string;
}

export function createReviewerModule(config: ReviewerConfig): IWriterModule<void, ReviewPipelineStageResult> {
  return {
    moduleId: config.moduleId,

    async execute(input: ModuleInput): Promise<ModuleOutput<ReviewPipelineStageResult>> {
      const score: ContentQualityScore = {
        reviewerId: config.moduleId,
        score: config.defaultScore,
        passed: config.defaultPassed,
        notes: config.defaultNotes,
      };

      const revisionRequest: RevisionRequest | null =
        !config.defaultPassed && config.revisionSummary
          ? {
              id: `rev-${config.moduleId}-${Date.now()}`,
              draftId: input.draft.id,
              requestedBy: config.moduleId,
              severity: "moderate",
              summary: config.revisionSummary,
              details: [`${config.name} requested changes`],
              resolved: false,
              createdAt: new Date().toISOString(),
            }
          : null;

      const payload: ReviewPipelineStageResult = {
        reviewerId: config.moduleId,
        score,
        revisionRequest,
        completedAt: new Date().toISOString(),
      };

      return {
        draft: input.draft,
        payload,
        moduleId: config.moduleId,
        completedAt: new Date().toISOString(),
      };
    },
  };
}
