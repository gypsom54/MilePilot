/**
 * AuraCore type definitions.
 * Orchestration contracts — no AI implementation.
 */

import type { EmployeeId } from "@/types/models/ai-employee";
import type { GrowthMetric } from "@/types/models/growth-metric";
import type { Task } from "@/types/models/task";

export interface DailyBrief {
  greeting: string;
  headline: string;
  improvementsCount: number;
  hoursSaved: number;
  generatedAt: string;
}

export interface AuraCoreContext {
  businessId: string;
  userId: string;
}

export interface AssignEmployeeInput {
  taskId: string;
  employeeId: EmployeeId;
}

export interface CompleteTaskInput {
  taskId: string;
  completedAt: string;
}

/**
 * AuraCore orchestration interface.
 * Implementation will coordinate all AI employees in a future phase.
 */
export interface IAuraCore {
  startDay(context: AuraCoreContext): Promise<DailyBrief>;
  processTasks(context: AuraCoreContext): Promise<Task[]>;
  assignEmployee(context: AuraCoreContext, input: AssignEmployeeInput): Promise<Task>;
  prioritiseTasks(context: AuraCoreContext, tasks: Task[]): Promise<Task[]>;
  completeTask(context: AuraCoreContext, input: CompleteTaskInput): Promise<Task>;
  generateBrief(context: AuraCoreContext): Promise<DailyBrief>;
  getGrowthMetric(context: AuraCoreContext): Promise<GrowthMetric>;
}
