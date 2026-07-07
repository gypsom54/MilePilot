/**
 * Read-only memory access pattern for AI employees.
 * Employees must never write directly — all updates pass through AuraCore.
 */

import type { IMemoryReader } from "@/services/memory/types";
import { memoryReader } from "@/services/memory/memoryReader";

/**
 * Shared read-only memory accessor injected into employee services.
 */
export const employeeMemoryAccess: IMemoryReader = memoryReader;
