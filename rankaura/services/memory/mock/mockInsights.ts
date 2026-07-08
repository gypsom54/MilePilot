/**
 * Mock memory insights — no AI generation.
 */

import type { MemoryInsight } from "@/services/memory/models/memory-store";

export const MOCK_MEMORY_INSIGHTS: MemoryInsight[] = [
  {
    id: "insight-1",
    title: "Winter demand opportunity",
    description: "Emergency repair interest peaks November–February. Visibility now could capture early demand.",
    category: "seasonality",
    confidence: 84,
    generatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "insight-2",
    title: "Homepage clarity working",
    description: "Simplified welcome message correlates with improved engagement signals.",
    category: "performance",
    confidence: 79,
    generatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "insight-3",
    title: "Competitor content gap",
    description: "Local Growth Co lacks service-specific landing pages — an area to differentiate.",
    category: "competitor",
    confidence: 71,
    generatedAt: "2026-07-07T00:00:00.000Z",
  },
];

export function buildMockInsights(businessId: string): MemoryInsight[] {
  return MOCK_MEMORY_INSIGHTS.map((insight) => ({ ...insight, id: `${insight.id}-${businessId}` }));
}
