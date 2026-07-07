import type { EmployeeId } from "@/types/models/ai-employee";

export const SCOUT_CONFIG = {
  id: "scout" as const satisfies EmployeeId,
  name: "Scout",
  role: "Research employee",
  description: "Discovers what customers are looking for and where growth exists.",
  capabilities: ["analyse", "discover", "prioritise", "summarise", "recommend"] as const,
} as const;
