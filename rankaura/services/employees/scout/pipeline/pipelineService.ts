/**
 * Research pipeline — orchestrates analysers and opportunity discovery.
 */

import { competitorAnalyser } from "@/services/employees/scout/analysers/competitor";
import { trendAnalyser } from "@/services/employees/scout/analysers/trend";
import { websiteAnalyser } from "@/services/employees/scout/analysers/website";
import { MOCK_SCOUT_OPPORTUNITIES, MOCK_SEARCH_INTENTS } from "@/services/employees/scout/mock";
import { RESEARCH_PIPELINE_CONFIG } from "@/services/employees/scout/pipeline/config";
import { scoringEngine } from "@/services/employees/scout/scoring/scoringEngine";
import type {
  IResearchPipeline,
  ResearchPipelineInput,
  ResearchPipelineResult,
} from "@/services/employees/scout/pipeline/types";

export const researchPipeline: IResearchPipeline = {
  async run(input: ResearchPipelineInput): Promise<ResearchPipelineResult> {
    const now = new Date().toISOString();

    const websiteAnalysis = await websiteAnalyser.analyse({
      businessId: input.businessId,
      websiteUrl: input.websiteUrl,
    });

    const competitorAnalysis = await competitorAnalyser.analyse({
      businessId: input.businessId,
    });

    const trendAnalysis = await trendAnalyser.analyse({
      businessId: input.businessId,
      market: input.market,
    });

    const opportunities = scoringEngine.scoreAll(
      MOCK_SCOUT_OPPORTUNITIES.filter((o) => o.businessId === input.businessId),
    );

    return {
      businessId: input.businessId,
      stages: RESEARCH_PIPELINE_CONFIG.stages.map((stage) => ({
        stage,
        status: "complete" as const,
        completedAt: now,
      })),
      websiteAnalysis,
      competitorAnalysis,
      trendAnalysis,
      searchIntents: MOCK_SEARCH_INTENTS,
      opportunities,
      completedAt: now,
    };
  },
};
