import type { EmployeeId } from "@/types/models/ai-employee";

export interface GuardianTaskContext {
  businessId: string;
  taskId: string;
}

export interface GuardianService {
  id: EmployeeId;
}
