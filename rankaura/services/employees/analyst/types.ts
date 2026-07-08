import type { EmployeeId } from "@/types/models/ai-employee";

export interface AnalystTaskContext {
  businessId: string;
  period: string;
}

export interface AnalystService {
  id: EmployeeId;
}
