import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface AnalystTaskContext {
  businessId: string;
  period: string;
}

export type AnalystService = EmployeeServiceBase;