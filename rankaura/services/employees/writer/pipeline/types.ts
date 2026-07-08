import type { ContentDraft } from "@/services/employees/writer/models/content-draft";
import type { ContentQualityScore } from "@/services/employees/writer/models/content-quality";
import type { RevisionRequest } from "@/services/employees/writer/models/revision-request";

export interface ReviewPipelineInput {
  draft: ContentDraft;
}

export interface ReviewPipelineStageResult {
  reviewerId: string;
  score: ContentQualityScore;
  revisionRequest: RevisionRequest | null;
  completedAt: string;
}

export interface ReviewPipelineResult {
  draftId: string;
  stages: ReviewPipelineStageResult[];
  overallPassed: boolean;
  completedAt: string;
}

export interface IReviewPipeline {
  run(input: ReviewPipelineInput, executeStage: (reviewerId: string, draft: ContentDraft) => Promise<ReviewPipelineStageResult>): Promise<ReviewPipelineResult>;
}
