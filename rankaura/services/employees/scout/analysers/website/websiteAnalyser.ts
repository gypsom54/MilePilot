/**
 * Mock website analyser — reads from memory, returns static findings.
 */

import { WEBSITE_ANALYSER_CONFIG } from "@/services/employees/scout/analysers/website/config";
import type {
  IWebsiteAnalyser,
  WebsiteAnalysisInput,
  WebsiteAnalysisResult,
} from "@/services/employees/scout/analysers/website/types";

export const websiteAnalyser: IWebsiteAnalyser = {
  async analyse(input: WebsiteAnalysisInput): Promise<WebsiteAnalysisResult> {
    return {
      businessId: input.businessId,
      pagesReviewed: WEBSITE_ANALYSER_CONFIG.maxPagesReviewed,
      summary: "Your website has strong foundations with a few content gaps to address.",
      analysedAt: new Date().toISOString(),
      findings: [
        {
          id: "wf-1",
          category: "content_gap",
          title: "No dedicated emergency repair page",
          description: "Customers searching for urgent help cannot find a specific landing page.",
          impact: "high",
        },
        {
          id: "wf-2",
          category: "page_quality",
          title: "Contact page could be warmer",
          description: "The welcome message is functional but does not invite conversation.",
          impact: "medium",
        },
        {
          id: "wf-3",
          category: "structure",
          title: "Service pages lack cross-linking",
          description: "Related services are not connected, making navigation harder.",
          impact: "medium",
        },
      ],
    };
  },
};
