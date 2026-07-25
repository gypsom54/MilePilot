/**
 * Confidence scoring for memory entries and insights.
 */

export type MemoryConfidenceLevel = "low" | "medium" | "high";

export interface MemoryConfidence {
  score: number;
  level: MemoryConfidenceLevel;
  source: string;
  lastValidatedAt: string;
}

export function resolveConfidenceLevel(score: number): MemoryConfidenceLevel {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}
