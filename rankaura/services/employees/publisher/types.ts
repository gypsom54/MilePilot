import type { EmployeeId } from "@/types/models/ai-employee";

export interface PublisherTaskContext {
  businessId: string;
  contentId: string;
}

export interface PublisherService {
  id: EmployeeId;
}
