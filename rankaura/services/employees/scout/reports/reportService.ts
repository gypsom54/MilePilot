/**
 * Research report service — daily, weekly, and monthly summaries.
 */

import { MOCK_SCOUT_OPPORTUNITIES, MOCK_SEARCH_INTENTS } from "@/services/employees/scout/mock";
import { recommendationGenerator } from "@/services/employees/scout/recommendations";
import { scoringEngine } from "@/services/employees/scout/scoring";
import { REPORT_CONFIG, type ReportPeriod } from "@/services/employees/scout/reports/config";
import { buildReportId, REPORT_TEMPLATES } from "@/services/employees/scout/reports/mock/mockReports";
import type { IReportService, ResearchReport } from "@/services/employees/scout/reports/types";

async function buildReport(businessId: string, period: ReportPeriod): Promise<ResearchReport> {
  const template = REPORT_TEMPLATES[period];
  const config = REPORT_CONFIG[period];
  const opportunities = scoringEngine.scoreAll(
    MOCK_SCOUT_OPPORTUNITIES.filter((o) => o.businessId === businessId),
  );
  const recommendations = await recommendationGenerator.generate({ businessId, opportunities });

  return {
    id: buildReportId(period, businessId),
    businessId,
    period,
    title: config.label,
    headline: template.headline,
    summary: template.summary,
    highlights: template.highlights,
    opportunities,
    searchIntents: MOCK_SEARCH_INTENTS,
    recommendations: recommendations.recommendations,
    generatedAt: new Date().toISOString(),
  };
}

export const reportService: IReportService = {
  generateDaily: (businessId) => buildReport(businessId, "daily"),
  generateWeekly: (businessId) => buildReport(businessId, "weekly"),
  generateMonthly: (businessId) => buildReport(businessId, "monthly"),
};
