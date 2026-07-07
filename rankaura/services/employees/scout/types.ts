import type { IAIEmployee } from "@/services/employees/shared/aiEmployee";

export interface ScoutTaskContext {
  businessId: string;
  market: string;
}

export type ScoutService = IAIEmployee;
