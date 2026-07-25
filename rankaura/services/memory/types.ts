/**
 * Memory framework service contracts.
 *
 * Read access: all AI employees via IMemoryReader
 * Write access: AuraCore only via IMemoryService (updates pass through orchestration)
 */

import type { EmployeeId } from "@/types/models/ai-employee";
import type { MemoryEvent } from "@/services/memory/models/memory-event";
import type {
  MemoryInsight,
  MemoryStore,
  MemorySummary,
  MemoryUpdatePatch,
  MemoryVersion,
} from "@/services/memory/models/memory-store";
import type { MemoryTimeline } from "@/services/memory/models/memory-timeline";

export interface MemoryContext {
  businessId: string;
  requestedBy: EmployeeId | "auracore" | "system";
}

export interface MemoryStoreInput {
  businessId: string;
  data: MemoryStore;
  actor: MemoryContext["requestedBy"];
}

/**
 * Read-only memory access for AI employees.
 * Employees may NOT write directly — all updates pass through AuraCore.
 */
export interface IMemoryReader {
  retrieve(context: MemoryContext): Promise<MemoryStore>;
  generateSummary(context: MemoryContext): Promise<MemorySummary>;
  generateTimeline(context: MemoryContext): Promise<MemoryTimeline>;
  generateInsights(context: MemoryContext): Promise<MemoryInsight[]>;
}

/**
 * Full memory service — write operations restricted to AuraCore in production.
 */
export interface IMemoryService extends IMemoryReader {
  store(input: MemoryStoreInput): Promise<MemoryStore>;
  update(context: MemoryContext, patch: MemoryUpdatePatch): Promise<MemoryStore>;
  archive(context: MemoryContext, eventId: string): Promise<MemoryEvent>;
  version(context: MemoryContext): Promise<MemoryVersion>;
}

/**
 * Learning engine contract — records and surfaces insights from memory.
 * No AI implementation in Phase 1.
 */
export interface ILearningEngine {
  recordInsight(
    context: MemoryContext,
    insight: Omit<MemoryInsight, "id" | "generatedAt">,
  ): Promise<MemoryInsight>;
  generateInsights(context: MemoryContext): Promise<MemoryInsight[]>;
}

/**
 * AuraCore memory gateway — sole write path for employee-initiated changes.
 */
export interface IAuraCoreMemoryGateway {
  requestMemoryUpdate(
    context: MemoryContext,
    patch: MemoryUpdatePatch,
  ): Promise<MemoryStore>;
  requestMemoryArchive(context: MemoryContext, eventId: string): Promise<MemoryEvent>;
}
