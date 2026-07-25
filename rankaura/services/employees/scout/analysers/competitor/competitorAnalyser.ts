/**
 * Mock competitor analyser — uses memory competitor data.
 */

import type {
  CompetitorAnalysisInput,
  CompetitorAnalysisResult,
  ICompetitorAnalyser,
} from "@/services/employees/scout/analysers/competitor/types";

export const competitorAnalyser: ICompetitorAnalyser = {
  async analyse(input: CompetitorAnalysisInput): Promise<CompetitorAnalysisResult> {
    return {
      businessId: input.businessId,
      competitorsReviewed: 2,
      summary: "Two local competitors reviewed. A service-plan gap was identified.",
      analysedAt: new Date().toISOString(),
      findings: [
        {
          id: "cf-1",
          competitorName: "Local Growth Co",
          title: "Missing service plan offering",
          description: "Competitor lacks annual maintenance packages — an area to differentiate.",
          opportunityType: "gap",
        },
        {
          id: "cf-2",
          competitorName: "Bright Marketing",
          title: "Premium positioning opportunity",
          description: "Competitor targets premium segment; local urgent-repair market is underserved.",
          opportunityType: "differentiation",
        },
      ],
    };
  },
};
