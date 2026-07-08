import type { EmployeeId } from "@/types/models/ai-employee";

export const ARCHITECT_CONFIG = {
  id: "architect" as const satisfies EmployeeId,
  name: "Architect",
  role: "Structures your site",
  description: "Strengthens how your website is organised and connected.",
} as const;
