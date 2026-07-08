/**
 * Writer Department configuration.
 * All thresholds and pipeline order are defined here — not hardcoded in modules.
 */

import type { ReviewStage, ReviewerModuleId } from '../types/index.js';

export const DEPARTMENT_ID = 'writer-department' as const;
export const DEPARTMENT_VERSION = '0.1.0' as const;

/** Ordered review pipeline — reviewers run in this sequence via orchestrator */
export const REVIEW_PIPELINE_ORDER: readonly ReviewStage[] = [
  'seo',
  'brand',
  'readability',
  'qa',
] as const;

/** Maps review stages to reviewer module IDs */
export const STAGE_TO_REVIEWER: Record<ReviewStage, ReviewerModuleId> = {
  seo: 'seo-reviewer',
  brand: 'brand-reviewer',
  readability: 'readability-reviewer',
  qa: 'qa-reviewer',
};

/** Single responsibility statement per module */
export const MODULE_RESPONSIBILITIES: Record<string, string> = {
  planner: 'Transform briefs into structured content plans with outlines and key messages',
  strategist: 'Define narrative angle, positioning, and strategic messaging framework',
  copywriter: 'Produce draft copy aligned to plan, strategy, and brief constraints',
  editor: 'Apply structural, clarity, and consistency edits to draft copy',
  'seo-reviewer': 'Evaluate keyword usage, meta structure, and search optimisation only',
  'brand-reviewer': 'Evaluate brand voice, tone adherence, and messaging alignment only',
  'readability-reviewer': 'Evaluate reading level, sentence structure, and clarity only',
  'qa-reviewer': 'Evaluate factual consistency, completeness, and publish-readiness only',
};

/** Quality score thresholds */
export const QUALITY_THRESHOLDS = {
  pass: 70,
  excellent: 90,
  revision: 50,
} as const;

/** Maximum revision cycles before pipeline blocks */
export const MAX_REVISION_CYCLES = 3;

/** Mock processing delay (ms) — simulates module work in examples */
export const MOCK_PROCESSING_DELAY_MS = 0;
