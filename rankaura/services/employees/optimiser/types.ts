import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface OptimiserTaskContext {
  businessId: string;
  pageId: string;
}

export type OptimiserService = EmployeeServiceBase;