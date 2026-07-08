/**
 * Root memory store — composed from domain memory segments.
 */

import type { BrandMemory } from "@/services/memory/models/brand-memory";
import type { BusinessMemory } from "@/services/memory/models/business-memory";
import type { CompetitorMemory } from "@/services/memory/models/competitor-memory";
import type {
  HistoryMemory,
  LearningRecord,
  SeasonalityRecord,
} from "@/services/memory/models/history-memory";
import type { PerformanceMemory } from "@/services/memory/models/performance-memory";
import type { PreferenceMemory } from "@/services/memory/models/preference-memory";
import type { WebsiteMemory } from "@/services/memory/models/website-memory";

export interface MemoryStore {
  businessId: string;
  version: number;
  business: BusinessMemory;
  brand: BrandMemory;
  website: WebsiteMemory;
  competitors: CompetitorMemory;
  performance: PerformanceMemory;
  preferences: PreferenceMemory;
  history: HistoryMemory;
  learning: LearningRecord[];
  seasonality: SeasonalityRecord[];
  updatedAt: string;
}

export interface MemoryVersion {
  businessId: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface MemorySummary {
  businessId: string;
  headline: string;
  highlights: string[];
  generatedAt: string;
}

export interface MemoryInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  generatedAt: string;
}

export type MemoryUpdatePatch = Partial<
  Pick<MemoryStore, "business" | "brand" | "website" | "competitors" | "performance" | "preferences" | "history" | "learning" | "seasonality">
>;
