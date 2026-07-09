import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface ArchitectTaskContext {
  businessId: string;
  websiteId: string;
}

export type ArchitectService = EmployeeServiceBase;