import { writerDepartmentOrchestrator } from "@/services/employees/writer/orchestrator";
import { writerService } from "@/services/employees/writer/writerService";
import { MOCK_BUSINESS_ID } from "@/services/memory/mock/mockMemoryStore";

export async function runWriterDepartmentTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const draft = await writerDepartmentOrchestrator.receiveBrief({
    businessId: MOCK_BUSINESS_ID,
    title: "Test",
    contentType: "page",
    brief: "Test",
  });
  if (draft.id) passed++; else failed++;

  const summary = await writerService.summarise({ businessId: MOCK_BUSINESS_ID, requestedBy: "auracore" });
  if (summary.headline) passed++; else failed++;

  return { passed, failed };
}
