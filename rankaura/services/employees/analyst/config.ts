import type { EmployeeId } from "@/types/models/ai-employee";

export const ANALYST_CONFIG = {
  id: "analyst" as const satisfies EmployeeId,
  name: "Analyst",
  role: "Tracks growth",
  description: "Reviews performance and surfaces what is working.",
} as const;
