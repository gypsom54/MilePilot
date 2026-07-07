import type { EmployeeId } from "@/types/models/ai-employee";

export const SCOUT_CONFIG = {
  id: "scout" as const satisfies EmployeeId,
  name: "Scout",
  role: "Finds opportunities",
  description: "Discovers what customers are searching for and where growth exists.",
} as const;
