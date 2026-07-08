/**
 * Core employee identifiers used across AuraCore and AI services.
 */

export type EmployeeId =
  | "scout"
  | "writer"
  | "architect"
  | "optimiser"
  | "publisher"
  | "analyst"
  | "guardian";

export type EmployeeActivityStatus = "working" | "idle" | "complete";

export interface AIEmployee {
  id: EmployeeId;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: EmployeeActivityStatus;
}
