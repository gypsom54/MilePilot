/**
 * Writer service — IAIEmployee facade delegating to Writer Department orchestrator.
 * AuraCore communicates with Writer only through this service → orchestrator.
 */

import { employeeMemoryAccess } from "@/services/employees/shared/memoryAccess";
import type {
  AnalysisResult,
  DiscoveryResult,
  EmployeeContext,
  IAIEmployee,
  PrioritisationResult,
  RecommendationResult,
  SummaryResult,
} from "@/services/employees/shared/aiEmployee";
import { WRITER_CONFIG } from "@/services/employees/writer/config";
import { writerDepartmentOrchestrator } from "@/services/employees/writer/orchestrator";
import { MOCK_DRAFT_ID } from "@/services/employees/writer/mock";

export const writerService: IAIEmployee = {
  id: WRITER_CONFIG.id,
  memory: employeeMemoryAccess,

  async analyse(context: EmployeeContext): Promise<AnalysisResult> {
    const draft = await writerDepartmentOrchestrator.getDraft(MOCK_DRAFT_ID);
    return {
      employeeId: "writer",
      summary: `Reviewing content for ${context.businessId}: ${draft.title}`,
      findings: [draft.planSummary, draft.strategySummary].filter(Boolean) as string[],
      generatedAt: new Date().toISOString(),
    };
  },

  async discover(context: EmployeeContext): Promise<DiscoveryResult> {
    const report = await writerDepartmentOrchestrator.generateReport(context.businessId);
    return {
      employeeId: "writer",
      itemsDiscovered: report.draftsInProgress,
      summary: report.headline,
      generatedAt: report.generatedAt,
    };
  },

  async prioritise(): Promise<PrioritisationResult> {
    return {
      employeeId: "writer",
      items: [{ id: MOCK_DRAFT_ID, title: "Emergency Boiler Repair", score: 92, priority: "high" }],
      generatedAt: new Date().toISOString(),
    };
  },

  async summarise(context: EmployeeContext): Promise<SummaryResult> {
    const report = await writerDepartmentOrchestrator.generateReport(context.businessId);
    return {
      employeeId: "writer",
      headline: report.headline,
      body: report.highlights.join(". "),
      generatedAt: report.generatedAt,
    };
  },

  async recommend(context: EmployeeContext): Promise<RecommendationResult> {
    const report = await writerDepartmentOrchestrator.generateReport(context.businessId);
    return {
      employeeId: "writer",
      recommendations: report.highlights,
      generatedAt: report.generatedAt,
    };
  },
};
