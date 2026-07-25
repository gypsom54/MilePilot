export const SCORING_ENGINE_CONFIG = {
  id: "opportunity-scoring-engine",
  weights: {
    confidence: 0.4,
    visitors: 0.3,
    leads: 0.3,
  },
  priorityThresholds: {
    high: 80,
    medium: 60,
  },
} as const;
