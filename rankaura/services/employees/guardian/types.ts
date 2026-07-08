import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface GuardianTaskContext {
  businessId: string;
  taskId: string;
}

export type GuardianService = EmployeeServiceBase;