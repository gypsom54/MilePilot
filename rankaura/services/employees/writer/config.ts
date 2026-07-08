import type { EmployeeId } from "@/types/models/ai-employee";

export const WRITER_CONFIG = {
  id: "writer" as const satisfies EmployeeId,
  name: "Writer",
  role: "Editorial department",
  description: "Production-ready editorial department for content creation and review.",
  capabilities: ["analyse", "discover", "prioritise", "summarise", "recommend"] as const,
  department: "writer-department",
} as const;
