/**
 * @deprecated Import from `@/services/memory` instead.
 * Re-exports for backward compatibility with Phase 1 database contracts.
 */

export type {
  BrandMemory as BrandVoice,
  BusinessMemory,
  BusinessProduct as Product,
  BusinessService as Service,
  CompetitorRecord as Competitor,
  HistoryRecord as HistoryEntry,
  LearningRecord as LearningEntry,
  MemoryStore,
  PreferenceMemory as BusinessPreferences,
  SeasonalityRecord as SeasonalityPattern,
} from "@/services/memory/models";

/** @deprecated Use BrandMemory fields directly */
export interface WritingStyle {
  tone: string;
  readingLevel: string;
  sentenceLength: "short" | "medium" | "long";
  useContractions: boolean;
}
