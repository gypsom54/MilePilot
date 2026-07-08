import type { EmployeeId } from "@/types/models/ai-employee";
import type { IMemoryReader } from "@/services/memory/types";

/**
 * Base contract for all AI employee services.
 * Every employee receives read-only memory access.
 * Writes must pass through AuraCore.
 */
export interface EmployeeServiceBase {
  id: EmployeeId;
  memory: IMemoryReader;
}
