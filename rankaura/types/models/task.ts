/**
 * Core Task model — the heart of AuraCore orchestration.
 */

import type { EmployeeId } from "@/types/models/ai-employee";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "awaiting_approval"
  | "completed"
  | "cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  confidence: number;
  status: TaskStatus;
  assignedEmployee: EmployeeId | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  estimatedImpact: string;
  estimatedTime: string;
  approvalRequired: boolean;
}
