/**
 * Mock memory events for timeline generation.
 */

import type { MemoryEvent } from "@/services/memory/models/memory-event";
import { MOCK_BUSINESS_ID } from "@/services/memory/mock/mockMemoryStore";

export const MOCK_MEMORY_EVENTS: MemoryEvent[] = [
  {
    id: "evt-1",
    businessId: MOCK_BUSINESS_ID,
    type: "created",
    category: "business",
    summary: "Business profile initialised",
    actor: "system",
    confidence: { score: 100, level: "high", source: "onboarding", lastValidatedAt: "2026-07-01T09:00:00.000Z" },
    version: 1,
    occurredAt: "2026-07-01T09:00:00.000Z",
    archived: false,
  },
  {
    id: "evt-2",
    businessId: MOCK_BUSINESS_ID,
    type: "updated",
    category: "brand",
    summary: "Brand voice preferences captured",
    actor: "auracore",
    confidence: { score: 92, level: "high", source: "onboarding", lastValidatedAt: "2026-07-02T11:00:00.000Z" },
    version: 2,
    occurredAt: "2026-07-02T11:00:00.000Z",
    archived: false,
  },
  {
    id: "evt-3",
    businessId: MOCK_BUSINESS_ID,
    type: "updated",
    category: "performance",
    summary: "Growth momentum updated to Strong (+18%)",
    actor: "analyst",
    confidence: { score: 88, level: "high", source: "analyst", lastValidatedAt: "2026-07-06T20:00:00.000Z" },
    version: 3,
    occurredAt: "2026-07-06T20:00:00.000Z",
    archived: false,
  },
  {
    id: "evt-4",
    businessId: MOCK_BUSINESS_ID,
    type: "insight_generated",
    category: "learning",
    summary: "Winter heating demand pattern identified",
    actor: "analyst",
    confidence: { score: 76, level: "medium", source: "analyst", lastValidatedAt: "2026-07-05T10:00:00.000Z" },
    version: 3,
    occurredAt: "2026-07-05T10:00:00.000Z",
    archived: false,
  },
];
