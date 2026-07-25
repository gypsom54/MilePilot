import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";
import type { SearchIntent } from "@/services/employees/scout/models/search-intent";
import type { CompetitorAnalysisResult } from "@/services/employees/scout/analysers/competitor/types";
import type { TrendAnalysisResult } from "@/services/employees/scout/analysers/trend/types";
import type { WebsiteAnalysisResult } from "@/services/employees/scout/analysers/website/types";

export interface ResearchPipelineInput {
  businessId: string;
  market: string;
  websiteUrl: string;
}

export interface ResearchPipelineStage {
  stage: string;
  status: "complete" | "skipped";
  completedAt: string;
}

export interface ResearchPipelineResult {
  businessId: string;
  stages: ResearchPipelineStage[];
  websiteAnalysis: WebsiteAnalysisResult;
  competitorAnalysis: CompetitorAnalysisResult;
  trendAnalysis: TrendAnalysisResult;
  searchIntents: SearchIntent[];
  opportunities: ScoutOpportunity[];
  completedAt: string;
}

export interface IResearchPipeline {
  run(input: ResearchPipelineInput): Promise<ResearchPipelineResult>;
}
