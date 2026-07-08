import type { EmployeeId } from "@/types/models/ai-employee";

export const OPTIMISER_CONFIG = {
  id: "optimiser" as const satisfies EmployeeId,
  name: "Optimiser",
  role: "Improves pages",
  description: "Makes existing pages clearer and more effective.",
} as const;
