import type { EmployeeId } from "@/types/models/ai-employee";

export const WRITER_CONFIG = {
  id: "writer" as const satisfies EmployeeId,
  name: "Writer",
  role: "Creates content",
  description: "Drafts helpful content that speaks in your brand voice.",
} as const;
