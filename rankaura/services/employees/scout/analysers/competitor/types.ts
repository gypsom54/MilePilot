/**
 * Competitor analyser types.
 */

export interface CompetitorAnalysisInput {
  businessId: string;
}

export interface CompetitorAnalysisFinding {
  id: string;
  competitorName: string;
  title: string;
  description: string;
  opportunityType: "differentiation" | "gap" | "threat";
}

export interface CompetitorAnalysisResult {
  businessId: string;
  findings: CompetitorAnalysisFinding[];
  competitorsReviewed: number;
  summary: string;
  analysedAt: string;
}

export interface ICompetitorAnalyser {
  analyse(input: CompetitorAnalysisInput): Promise<CompetitorAnalysisResult>;
}
