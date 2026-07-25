export const REVIEW_PIPELINE_CONFIG = {
  id: "writer-review-pipeline",
  reviewers: [
    "editor",
    "seo-reviewer",
    "brand-reviewer",
    "readability-reviewer",
    "qa-reviewer",
  ] as const,
  passThreshold: 70,
} as const;

export type ReviewPipelineStage = (typeof REVIEW_PIPELINE_CONFIG.reviewers)[number];
