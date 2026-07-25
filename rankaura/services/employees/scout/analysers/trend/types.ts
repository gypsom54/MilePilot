export interface TrendAnalysisInput {
  businessId: string;
  market: string;
}

export interface TrendAnalysisFinding {
  id: string;
  label: string;
  description: string;
  direction: "rising" | "steady" | "falling";
  confidence: number;
}

export interface TrendAnalysisResult {
  businessId: string;
  findings: TrendAnalysisFinding[];
  summary: string;
  analysedAt: string;
}

export interface ITrendAnalyser {
  analyse(input: TrendAnalysisInput): Promise<TrendAnalysisResult>;
}
