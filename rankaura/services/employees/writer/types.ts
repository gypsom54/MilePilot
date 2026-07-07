import type { EmployeeId } from "@/types/models/ai-employee";

export interface WriterTaskContext {
  businessId: string;
  contentType: string;
}

export interface WriterService {
  id: EmployeeId;
}
