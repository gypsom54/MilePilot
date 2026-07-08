import type { DraftId, ReviewerModuleId } from '../types/index.js';
import type { ContentQuality, ContentQualityScores, ReviewResult } from '../types/interfaces.js';
import { QUALITY_THRESHOLDS } from '../config/department.config.js';

export function createEmptyQualityScores(): ContentQualityScores {
  return { seo: 0, brand: 0, readability: 0, qa: 0, overall: 0 };
}

export function createContentQuality(draftId: DraftId, version: number): ContentQuality {
  return {
    draftId,
    version,
    scores: createEmptyQualityScores(),
    passedReviewers: [],
    failedReviewers: [],
    revisionCount: 0,
    assessedAt: new Date().toISOString(),
  };
}

export function applyReviewResult(
  quality: ContentQuality,
  result: ReviewResult,
): ContentQuality {
  const scores = { ...quality.scores };
  const dimension = result.stage as keyof Omit<ContentQualityScores, 'overall'>;

  if (result.qualityDelta[dimension] !== undefined) {
    scores[dimension] = result.qualityDelta[dimension]!;
  }

  const passed = result.outcome === 'pass';
  const passedReviewers = passed
    ? [...quality.passedReviewers, result.reviewerId]
    : quality.passedReviewers;
  const failedReviewers = !passed
    ? [...quality.failedReviewers, result.reviewerId]
    : quality.failedReviewers;

  const dimensionValues = [scores.seo, scores.brand, scores.readability, scores.qa];
  scores.overall = Math.round(
    dimensionValues.reduce((sum, v) => sum + v, 0) / dimensionValues.length,
  );

  return {
    ...quality,
    scores,
    passedReviewers,
    failedReviewers,
    assessedAt: new Date().toISOString(),
  };
}

export function isQualityPassing(quality: ContentQuality): boolean {
  return quality.scores.overall >= QUALITY_THRESHOLDS.pass;
}

export function incrementRevisionCount(quality: ContentQuality): ContentQuality {
  return {
    ...quality,
    revisionCount: quality.revisionCount + 1,
    assessedAt: new Date().toISOString(),
  };
}

export function scoreFromFindings(
  errorCount: number,
  warningCount: number,
  infoCount: number,
): number {
  const penalty = errorCount * 20 + warningCount * 10 + infoCount * 2;
  return Math.max(0, Math.min(100, 100 - penalty));
}
