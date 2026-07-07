import type { EmployeeServiceBase } from "@/services/employees/shared/types";

export interface PublisherTaskContext {
  businessId: string;
  contentId: string;
}

export type PublisherService = EmployeeServiceBase;