/**
 * Mock memory service — in-memory only, no persistence.
 * Write operations simulate AuraCore-gated updates.
 */

import { buildMockInsights } from "@/services/memory/mock/mockInsights";
import { MOCK_MEMORY_EVENTS } from "@/services/memory/mock/mockTimeline";
import { MOCK_MEMORY_STORE } from "@/services/memory/mock/mockMemoryStore";
import type { MemoryEvent } from "@/services/memory/models/memory-event";
import type {
  MemoryInsight,
  MemoryStore,
  MemorySummary,
  MemoryUpdatePatch,
  MemoryVersion,
} from "@/services/memory/models/memory-store";
import type { MemoryTimeline } from "@/services/memory/models/memory-timeline";
import type {
  IMemoryService,
  MemoryContext,
  MemoryStoreInput,
} from "@/services/memory/types";

/** In-memory store keyed by businessId */
const memoryRegistry = new Map<string, MemoryStore>(
  Object.entries({ [MOCK_MEMORY_STORE.businessId]: structuredClone(MOCK_MEMORY_STORE) }),
);

/** In-memory event log keyed by businessId */
const eventRegistry = new Map<string, MemoryEvent[]>(
  Object.entries({ [MOCK_MEMORY_STORE.businessId]: [...MOCK_MEMORY_EVENTS] }),
);

function assertWriteAccess(context: MemoryContext): void {
  if (context.requestedBy !== "auracore" && context.requestedBy !== "system") {
    throw new Error(
      `Memory write denied for '${context.requestedBy}'. All updates must pass through AuraCore.`,
    );
  }
}

function getOrThrow(businessId: string): MemoryStore {
  const store = memoryRegistry.get(businessId);
  if (!store) {
    throw new Error(`Memory not found for business: ${businessId}`);
  }
  return store;
}

function appendEvent(businessId: string, event: MemoryEvent): void {
  const events = eventRegistry.get(businessId) ?? [];
  events.unshift(event);
  eventRegistry.set(businessId, events);
}

export const memoryService: IMemoryService = {
  async store(input: MemoryStoreInput): Promise<MemoryStore> {
    assertWriteAccess({ businessId: input.businessId, requestedBy: input.actor });
    const stored = structuredClone(input.data);
    memoryRegistry.set(input.businessId, stored);
    return structuredClone(stored);
  },

  async retrieve(context: MemoryContext): Promise<MemoryStore> {
    return structuredClone(getOrThrow(context.businessId));
  },

  async update(context: MemoryContext, patch: MemoryUpdatePatch): Promise<MemoryStore> {
    assertWriteAccess(context);
    const current = getOrThrow(context.businessId);
    const updated: MemoryStore = {
      ...current,
      ...patch,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    };
    memoryRegistry.set(context.businessId, updated);

    appendEvent(context.businessId, {
      id: `evt-${Date.now()}`,
      businessId: context.businessId,
      type: "updated",
      category: "business",
      summary: "Memory updated via AuraCore",
      actor: context.requestedBy,
      confidence: { score: 90, level: "high", source: "auracore", lastValidatedAt: new Date().toISOString() },
      version: updated.version,
      occurredAt: new Date().toISOString(),
      archived: false,
    });

    return structuredClone(updated);
  },

  async archive(context: MemoryContext, eventId: string): Promise<MemoryEvent> {
    assertWriteAccess(context);
    const events = eventRegistry.get(context.businessId) ?? [];
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Memory event not found: ${eventId}`);
    }
    event.archived = true;
    event.type = "archived";
    return { ...event };
  },

  async version(context: MemoryContext): Promise<MemoryVersion> {
    const store = getOrThrow(context.businessId);
    return {
      businessId: context.businessId,
      version: store.version,
      updatedAt: store.updatedAt,
      updatedBy: "auracore",
    };
  },

  async generateSummary(context: MemoryContext): Promise<MemorySummary> {
    const store = getOrThrow(context.businessId);
    return {
      businessId: context.businessId,
      headline: `${store.business.name} is growing with ${store.performance.momentumLabel.toLowerCase()} momentum.`,
      highlights: [
        `${store.performance.changePercent}% growth this period`,
        `${store.history.entries.length} recent activities recorded`,
        `${store.competitors.competitors.length} competitors tracked`,
        `${store.learning.length} insights learned`,
      ],
      generatedAt: new Date().toISOString(),
    };
  },

  async generateTimeline(context: MemoryContext): Promise<MemoryTimeline> {
    const events = eventRegistry.get(context.businessId) ?? [];
    return {
      businessId: context.businessId,
      events: structuredClone(events),
      generatedAt: new Date().toISOString(),
    };
  },

  async generateInsights(context: MemoryContext): Promise<MemoryInsight[]> {
    return buildMockInsights(context.businessId);
  },
};
