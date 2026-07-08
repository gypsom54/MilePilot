import type { EmployeeId } from "@/types/models/ai-employee";

export interface ArchitectTaskContext {
  businessId: string;
  websiteId: string;
}

export interface ArchitectService {
  id: EmployeeId;
}
