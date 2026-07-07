/**
 * Memory framework — interfaces only.
 * Stores persistent business context for AI employees.
 */

export interface BusinessPreferences {
  autopilotEnabled: boolean;
  approvalRequiredForPublishing: boolean;
  preferredLanguage: string;
  timezone: string;
}

export interface WritingStyle {
  tone: string;
  readingLevel: string;
  sentenceLength: "short" | "medium" | "long";
  useContractions: boolean;
}

export interface BrandVoice {
  personality: string[];
  values: string[];
  wordsToUse: string[];
  wordsToAvoid: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface Competitor {
  id: string;
  name: string;
  websiteUrl: string;
  notes: string;
}

export interface HistoryEntry {
  id: string;
  summary: string;
  occurredAt: string;
}

export interface LearningEntry {
  id: string;
  insight: string;
  source: string;
  learnedAt: string;
}

export interface SeasonalityPattern {
  id: string;
  label: string;
  peakMonths: number[];
  notes: string;
}

export interface MemoryStore {
  businessId: string;
  businessPreferences: BusinessPreferences;
  writingStyle: WritingStyle;
  brandVoice: BrandVoice;
  products: Product[];
  services: Service[];
  competitors: Competitor[];
  history: HistoryEntry[];
  learning: LearningEntry[];
  seasonality: SeasonalityPattern[];
  updatedAt: string;
}
