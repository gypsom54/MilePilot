/**
 * Chronological view of memory changes.
 */

import type { MemoryEvent } from "@/services/memory/models/memory-event";

export interface MemoryTimeline {
  businessId: string;
  events: MemoryEvent[];
  generatedAt: string;
}
