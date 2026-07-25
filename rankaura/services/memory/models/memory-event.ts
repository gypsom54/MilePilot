/**
 * Individual memory change events for timeline and audit.
 */

import type { EmployeeId } from "@/types/models/ai-employee";
import type { MemoryConfidence } from "@/services/memory/models/memory-confidence";

export type MemoryEventType =
  | "created"
  | "updated"
  | "archived"
  | "versioned"
  | "insight_generated";

export type MemoryCategory =
  | "business"
  | "brand"
  | "website"
  | "competitor"
  | "performance"
  | "preference"
  | "history"
  | "learning";

export type MemoryActor = EmployeeId | "auracore" | "system";

export interface MemoryEvent {
  id: string;
  businessId: string;
  type: MemoryEventType;
  category: MemoryCategory;
  summary: string;
  actor: MemoryActor;
  confidence: MemoryConfidence;
  version: number;
  occurredAt: string;
  archived: boolean;
}
