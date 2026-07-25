/**
 * Scout search intent model.
 * Describes what customers are looking for — plain language, no SEO jargon.
 */

export type SearchIntentType = "informational" | "commercial" | "local" | "transactional";

export interface SearchIntent {
  id: string;
  label: string;
  description: string;
  type: SearchIntentType;
  estimatedMonthlySearches: number;
  relevanceScore: number;
  seasonality: string | null;
  discoveredAt: string;
}
