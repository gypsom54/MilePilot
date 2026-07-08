import type { EmployeeId } from "@/types/models/ai-employee";

export const PUBLISHER_CONFIG = {
  id: "publisher" as const satisfies EmployeeId,
  name: "Publisher",
  role: "Keeps you visible",
  description: "Publishes approved content and manages visibility.",
} as const;
