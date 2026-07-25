import type { IMemoryReader } from "@/services/memory/types";
import { employeeMemoryAccess } from "@/services/employees/shared/memoryAccess";

export { MEMORY_CONFIG } from "@/services/employees/memory/config";
export type { MemoryEmployeeService } from "@/services/employees/memory/types";

/**
 * Memory employee module — provides read/write gateway via AuraCore.
 * Direct writes are blocked at the memoryService layer for non-AuraCore actors.
 */
export const memoryEmployeeService = {
  serviceId: "memory" as const,
  reader: employeeMemoryAccess satisfies IMemoryReader,
};
