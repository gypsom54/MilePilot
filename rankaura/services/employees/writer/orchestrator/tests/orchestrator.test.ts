import { writerDepartmentOrchestrator } from "@/services/employees/writer/orchestrator/writerDepartmentOrchestrator";
import { MOCK_BUSINESS_ID } from "@/services/memory/mock/mockMemoryStore";

export async function runOrchestratorTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const draft = await writerDepartmentOrchestrator.receiveBrief({
    businessId: MOCK_BUSINESS_ID,
    title: "Test Page",
    contentType: "page",
    brief: "Test brief",
  });
  if (draft.status === "briefed") passed++; else failed++;

  const production = await writerDepartmentOrchestrator.runProduction(draft.id);
  if (production.draft.status === "drafted") passed++; else failed++;

  const review = await writerDepartmentOrchestrator.runReview(draft.id);
  if (review.contentQuality?.passed) passed++; else failed++;

  return { passed, failed };
}
