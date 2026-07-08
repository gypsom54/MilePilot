import type { EmployeeId } from "@/types/models/ai-employee";

export interface OptimiserTaskContext {
  businessId: string;
  pageId: string;
}

export interface OptimiserService {
  id: EmployeeId;
}
