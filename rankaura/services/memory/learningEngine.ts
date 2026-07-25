/**
 * Mock learning engine — records and surfaces insights without AI.
 */

import { buildMockInsights } from "@/services/memory/mock/mockInsights";
import type { MemoryInsight } from "@/services/memory/models/memory-store";
import type { ILearningEngine, MemoryContext } from "@/services/memory/types";

const insightRegistry = new Map<string, MemoryInsight[]>();

export const learningEngine: ILearningEngine = {
  async recordInsight(
    context: MemoryContext,
    insight: Omit<MemoryInsight, "id" | "generatedAt">,
  ): Promise<MemoryInsight> {
    const recorded: MemoryInsight = {
      ...insight,
      id: `insight-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    };

    const existing = insightRegistry.get(context.businessId) ?? [];
    insightRegistry.set(context.businessId, [recorded, ...existing]);

    return recorded;
  },

  async generateInsights(context: MemoryContext): Promise<MemoryInsight[]> {
    const recorded = insightRegistry.get(context.businessId) ?? [];
    const mock = buildMockInsights(context.businessId);
    return [...recorded, ...mock];
  },
};
