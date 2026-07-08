import { describe, it, expect } from 'vitest';
import {
  createReviewPipeline,
  startPipeline,
  applyStageResult,
  isPipelineComplete,
} from '../src/models/ReviewPipeline.js';
import type { ReviewResult } from '../src/types/interfaces.js';

describe('ReviewPipeline', () => {
  const draftId = 'draft-001';
  const briefId = 'brief-001';

  it('creates pipeline with four stages in order', () => {
    const pipeline = createReviewPipeline(briefId, draftId);
    expect(pipeline.stages).toHaveLength(4);
    expect(pipeline.stages.map((s) => s.stage)).toEqual(['seo', 'brand', 'readability', 'qa']);
    expect(pipeline.status).toBe('pending');
  });

  it('starts with first stage in progress', () => {
    const pipeline = startPipeline(createReviewPipeline(briefId, draftId));
    expect(pipeline.status).toBe('in_progress');
    expect(pipeline.stages[0]?.status).toBe('in_progress');
  });

  it('advances on pass', () => {
    let pipeline = startPipeline(createReviewPipeline(briefId, draftId));
    const passResult: ReviewResult = {
      id: 'review-001',
      draftId,
      draftVersion: 1,
      reviewerId: 'seo-reviewer',
      stage: 'seo',
      outcome: 'pass',
      findings: [],
      qualityDelta: { seo: 85 },
      completedAt: new Date().toISOString(),
    };

    pipeline = applyStageResult(pipeline, 'review-001', passResult);
    expect(pipeline.stages[0]?.status).toBe('passed');
    expect(pipeline.currentStageIndex).toBe(1);
    expect(pipeline.stages[1]?.status).toBe('in_progress');
  });

  it('completes after all stages pass', () => {
    let pipeline = startPipeline(createReviewPipeline(briefId, draftId));
    const stages = ['seo', 'brand', 'readability', 'qa'] as const;

    for (const stage of stages) {
      const result: ReviewResult = {
        id: `review-${stage}`,
        draftId,
        draftVersion: 1,
        reviewerId: `${stage}-reviewer` as ReviewResult['reviewerId'],
        stage,
        outcome: 'pass',
        findings: [],
        qualityDelta: { [stage]: 80 },
        completedAt: new Date().toISOString(),
      };
      pipeline = applyStageResult(pipeline, result.id, result);
    }

    expect(isPipelineComplete(pipeline)).toBe(true);
  });

  it('blocks on failure', () => {
    let pipeline = startPipeline(createReviewPipeline(briefId, draftId));
    const failResult: ReviewResult = {
      id: 'review-fail',
      draftId,
      draftVersion: 1,
      reviewerId: 'seo-reviewer',
      stage: 'seo',
      outcome: 'needs_revision',
      findings: [{ severity: 'error', category: 'keyword', message: 'Missing keyword' }],
      qualityDelta: { seo: 40 },
      completedAt: new Date().toISOString(),
    };

    pipeline = applyStageResult(pipeline, 'review-fail', failResult);
    expect(pipeline.status).toBe('blocked');
  });
});
