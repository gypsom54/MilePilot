/**
 * Scout service — research employee implementing IAIEmployee.
 * Architecture only. Mock data. No AI, APIs, or scraping.
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
import { opportunityInbox } from "@/services/employees/scout/inbox";
import { MOCK_SCOUT_OPPORTUNITIES } from "@/services/employees/scout/mock";
import { researchPipeline } from "@/services/employees/scout/pipeline";
import { recommendationGenerator } from "@/services/employees/scout/recommendations";
import { reportService } from "@/services/employees/scout/reports";
import { scoringEngine } from "@/services/employees/scout/scoring";
import { SCOUT_CONFIG } from "@/services/employees/scout/config";

export const scoutService: IAIEmployee = {
  id: SCOUT_CONFIG.id,
  memory: employeeMemoryAccess,

  async analyse(context: EmployeeContext): Promise<AnalysisResult> {
    const memory = await this.memory.retrieve({
      businessId: context.businessId,
      requestedBy: "scout",
    });

    const pipeline = await researchPipeline.run({
      businessId: context.businessId,
      market: memory.business.location,
      websiteUrl: memory.website.url,
    });

    const findings = [
      ...pipeline.websiteAnalysis.findings.map((f) => f.title),
      ...pipeline.competitorAnalysis.findings.map((f) => f.title),
      ...pipeline.trendAnalysis.findings.map((f) => f.label),
    ];

    return {
      employeeId: "scout",
      summary: pipeline.websiteAnalysis.summary,
      findings,
      generatedAt: new Date().toISOString(),
    };
  },

  async discover(context: EmployeeContext): Promise<DiscoveryResult> {
    const inbox = await opportunityInbox.getInbox(context.businessId);
    const newItems = inbox.items.filter((i) => i.status === "new");

    return {
      employeeId: "scout",
      itemsDiscovered: newItems.length,
      summary: `Scout discovered ${newItems.length} new opportunities for your business.`,
      generatedAt: new Date().toISOString(),
    };
  },

  async prioritise(context: EmployeeContext, itemIds?: string[]): Promise<PrioritisationResult> {
    let opportunities = MOCK_SCOUT_OPPORTUNITIES.filter(
      (o) => o.businessId === context.businessId,
    );

    if (itemIds?.length) {
      opportunities = opportunities.filter((o) => itemIds.includes(o.id));
    }

    const scored = scoringEngine.scoreAll(opportunities);

    return {
      employeeId: "scout",
      items: scored.map((o) => ({
        id: o.id,
        title: o.title,
        score: o.score,
        priority: o.priority,
      })),
      generatedAt: new Date().toISOString(),
    };
  },

  async summarise(context: EmployeeContext): Promise<SummaryResult> {
    const report = await reportService.generateDaily(context.businessId);

    return {
      employeeId: "scout",
      headline: report.headline,
      body: report.summary,
      generatedAt: report.generatedAt,
    };
  },

  async recommend(context: EmployeeContext): Promise<RecommendationResult> {
    const scored = scoringEngine.scoreAll(
      MOCK_SCOUT_OPPORTUNITIES.filter((o) => o.businessId === context.businessId),
    );
    const output = await recommendationGenerator.generate({
      businessId: context.businessId,
      opportunities: scored,
    });

    return {
      employeeId: "scout",
      recommendations: output.recommendations.map((r) => `${r.title}: ${r.action}`),
      generatedAt: output.generatedAt,
    };
  },
};
