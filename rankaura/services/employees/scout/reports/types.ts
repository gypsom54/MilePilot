import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";
import type { SearchIntent } from "@/services/employees/scout/models/search-intent";
import type { ScoutRecommendation } from "@/services/employees/scout/recommendations/types";
import type { ReportPeriod } from "@/services/employees/scout/reports/config";

export interface ResearchReport {
  id: string;
  businessId: string;
  period: ReportPeriod;
  title: string;
  headline: string;
  summary: string;
  highlights: string[];
  opportunities: ScoutOpportunity[];
  searchIntents: SearchIntent[];
  recommendations: ScoutRecommendation[];
  generatedAt: string;
}

export interface IReportService {
  generateDaily(businessId: string): Promise<ResearchReport>;
  generateWeekly(businessId: string): Promise<ResearchReport>;
  generateMonthly(businessId: string): Promise<ResearchReport>;
}
