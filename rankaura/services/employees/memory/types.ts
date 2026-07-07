import type { MemoryStore } from "@/types/models/memory";

export interface MemoryService {
  serviceId: "memory";
  getStore(businessId: string): Promise<MemoryStore | null>;
}
