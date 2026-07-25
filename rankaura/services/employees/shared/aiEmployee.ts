/**
 * Standard AI employee interface.
 * All employees implement these five core capabilities.
 */

import type { EmployeeId } from "@/types/models/ai-employee";
import type { IMemoryReader } from "@/services/memory/types";

export interface EmployeeContext {
  businessId: string;
  requestedBy: EmployeeId | "auracore";
}

export interface AnalysisResult {
  employeeId: EmployeeId;
  summary: string;
  findings: string[];
  generatedAt: string;
}

export interface DiscoveryResult {
  employeeId: EmployeeId;
  itemsDiscovered: number;
  summary: string;
  generatedAt: string;
}

export interface PrioritisedItem {
  id: string;
  title: string;
  score: number;
  priority: "low" | "medium" | "high";
}

export interface PrioritisationResult {
  employeeId: EmployeeId;
  items: PrioritisedItem[];
  generatedAt: string;
}

export interface SummaryResult {
  employeeId: EmployeeId;
  headline: string;
  body: string;
  generatedAt: string;
}

export interface RecommendationResult {
  employeeId: EmployeeId;
  recommendations: string[];
  generatedAt: string;
}

/**
 * Standard contract for all RankAura AI employees.
 */
export interface IAIEmployee {
  id: EmployeeId;
  memory: IMemoryReader;
  analyse(context: EmployeeContext): Promise<AnalysisResult>;
  discover(context: EmployeeContext): Promise<DiscoveryResult>;
  prioritise(context: EmployeeContext, itemIds?: string[]): Promise<PrioritisationResult>;
  summarise(context: EmployeeContext): Promise<SummaryResult>;
  recommend(context: EmployeeContext): Promise<RecommendationResult>;
}
