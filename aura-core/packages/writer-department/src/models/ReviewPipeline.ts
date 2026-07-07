import type { BriefId, DraftId, ReviewId, ReviewStage } from '../types/index.js';
import type { ReviewPipeline, ReviewPipelineStage, ReviewResult } from '../types/interfaces.js';
import { REVIEW_PIPELINE_ORDER, STAGE_TO_REVIEWER } from '../config/department.config.js';

export function createReviewPipeline(briefId: BriefId, draftId: DraftId): ReviewPipeline {
  const stages: ReviewPipelineStage[] = REVIEW_PIPELINE_ORDER.map((stage) => ({
    stage,
    reviewerId: STAGE_TO_REVIEWER[stage],
    status: 'pending',
  }));

  return {
    draftId,
    briefId,
    stages,
    currentStageIndex: 0,
    status: 'pending',
    startedAt: new Date().toISOString(),
  };
}

export function startPipeline(pipeline: ReviewPipeline): ReviewPipeline {
  const stages = [...pipeline.stages];
  if (stages[0]) {
    stages[0] = { ...stages[0], status: 'in_progress' };
  }

  return {
    ...pipeline,
    stages,
    status: 'in_progress',
    currentStageIndex: 0,
  };
}

export function applyStageResult(
  pipeline: ReviewPipeline,
  reviewId: ReviewId,
  result: ReviewResult,
): ReviewPipeline {
  const stages = [...pipeline.stages];
  const index = pipeline.currentStageIndex;
  const current = stages[index];

  if (!current) {
    throw new Error(`No stage at index ${index}`);
  }

  const stageStatus = result.outcome === 'pass' ? 'passed' : 'failed';
  stages[index] = {
    ...current,
    status: stageStatus,
    reviewId,
    result,
  };

  if (result.outcome !== 'pass') {
    return {
      ...pipeline,
      stages,
      status: 'blocked',
    };
  }

  const nextIndex = index + 1;
  if (nextIndex >= stages.length) {
    return {
      ...pipeline,
      stages,
      currentStageIndex: nextIndex,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  }

  stages[nextIndex] = { ...stages[nextIndex]!, status: 'in_progress' };

  return {
    ...pipeline,
    stages,
    currentStageIndex: nextIndex,
  };
}

export function getCurrentStage(pipeline: ReviewPipeline): ReviewPipelineStage | null {
  return pipeline.stages[pipeline.currentStageIndex] ?? null;
}

export function isPipelineComplete(pipeline: ReviewPipeline): boolean {
  return pipeline.status === 'completed';
}

export function isPipelineBlocked(pipeline: ReviewPipeline): boolean {
  return pipeline.status === 'blocked';
}

export function getCompletedStages(pipeline: ReviewPipeline): ReviewStage[] {
  return pipeline.stages
    .filter((s) => s.status === 'passed')
    .map((s) => s.stage);
}
