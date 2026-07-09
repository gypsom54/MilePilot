/**
 * Website analyser types.
 */

export interface WebsiteAnalysisInput {
  businessId: string;
  websiteUrl: string;
}

export interface WebsiteAnalysisFinding {
  id: string;
  category: "content_gap" | "page_quality" | "structure" | "visibility";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
}

export interface WebsiteAnalysisResult {
  businessId: string;
  findings: WebsiteAnalysisFinding[];
  pagesReviewed: number;
  summary: string;
  analysedAt: string;
}

export interface IWebsiteAnalyser {
  analyse(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisResult>;
}
