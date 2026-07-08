/**
 * Historical activity and decision memory.
 */

export interface HistoryMemory {
  entries: HistoryRecord[];
  updatedAt: string;
}

export interface HistoryRecord {
  id: string;
  summary: string;
  category: string;
  occurredAt: string;
}

export interface LearningRecord {
  id: string;
  insight: string;
  source: string;
  learnedAt: string;
}

export interface SeasonalityRecord {
  id: string;
  label: string;
  peakMonths: number[];
  notes: string;
}
