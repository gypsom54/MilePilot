import type { IMemoryReader } from "@/services/memory/types";

export interface MemoryEmployeeService {
  serviceId: "memory";
  reader: IMemoryReader;
}
