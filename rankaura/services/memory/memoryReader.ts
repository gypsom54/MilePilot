/**
 * Read-only memory accessor for AI employees.
 */

import { learningEngine } from "@/services/memory/learningEngine";
import { memoryService } from "@/services/memory/memoryService";
import type { IMemoryReader } from "@/services/memory/types";

export const memoryReader: IMemoryReader = {
  retrieve: memoryService.retrieve.bind(memoryService),
  generateSummary: memoryService.generateSummary.bind(memoryService),
  generateTimeline: memoryService.generateTimeline.bind(memoryService),
  generateInsights: learningEngine.generateInsights.bind(learningEngine),
};
