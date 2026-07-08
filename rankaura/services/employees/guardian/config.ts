import type { EmployeeId } from "@/types/models/ai-employee";

export const GUARDIAN_CONFIG = {
  id: "guardian" as const satisfies EmployeeId,
  name: "Guardian",
  role: "Protects quality",
  description: "Ensures everything meets your brand and quality standards.",
} as const;
