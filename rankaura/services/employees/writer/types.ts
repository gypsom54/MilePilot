import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface WriterTaskContext {
  businessId: string;
  contentType: string;
}

export type WriterService = EmployeeServiceBase;