import type { EmployeeId } from "@/types/models/ai-employee";

export interface ScoutTaskContext {
  businessId: string;
  market: string;
}

export interface ScoutService {
  id: EmployeeId;
}
