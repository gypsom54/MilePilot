import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface ScoutTaskContext {
  businessId: string;
  market: string;
}

export type ScoutService = EmployeeServiceBase;