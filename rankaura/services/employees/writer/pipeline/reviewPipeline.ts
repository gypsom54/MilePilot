/**
 * Review pipeline — runs reviewers sequentially via orchestrator callbacks.
 * Reviewers never communicate directly with each other.
 */

import { REVIEW_PIPELINE_CONFIG } from "@/services/employees/writer/pipeline/config";
import type {
  IReviewPipeline,
  ReviewPipelineInput,
  ReviewPipelineResult,
  ReviewPipelineStageResult,
} from "@/services/employees/writer/pipeline/types";

export const reviewPipeline: IReviewPipeline = {
  async run(
    input: ReviewPipelineInput,
    executeStage: (reviewerId: string, draft: typeof input.draft) => Promise<ReviewPipelineStageResult>,
  ): Promise<ReviewPipelineResult> {
    const stages: ReviewPipelineStageResult[] = [];
    const currentDraft = input.draft;

    for (const reviewerId of REVIEW_PIPELINE_CONFIG.reviewers) {
      const result = await executeStage(reviewerId, currentDraft);
      stages.push(result);
      if (result.revisionRequest && !result.score.passed) {
        break;
      }
    }

    const overallPassed = stages.every((s) => s.score.passed);

    return {
      draftId: input.draft.id,
      stages,
      overallPassed,
      completedAt: new Date().toISOString(),
    };
  },
};
