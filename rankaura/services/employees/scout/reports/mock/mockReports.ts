/**
 * Mock research report data templates.
 */

export const REPORT_TEMPLATES: Record<string, { headline: string; summary: string; highlights: string[] }> = {
  daily: {
    headline: "Your market had a busy day",
    summary: "Scout reviewed customer demand and found 2 new opportunities worth your attention.",
    highlights: [
      "Emergency repair demand remains high in your area",
      "1 new opportunity added to your inbox",
      "Competitor gap identified in service plans",
    ],
  },
  weekly: {
    headline: "A strong week for growth opportunities",
    summary: "This week Scout identified 3 opportunities and 3 customer search trends.",
    highlights: [
      "Emergency repair searches up 18% this week",
      "2 competitors reviewed — differentiation opportunity found",
      "Contact page improvement still pending review",
    ],
  },
  monthly: {
    headline: "Your monthly growth research summary",
    summary: "This month showed rising demand for urgent services ahead of winter.",
    highlights: [
      "3 high-confidence opportunities discovered",
      "Winter seasonality pattern confirmed",
      "Website content gaps identified on 2 key pages",
      "Estimated 600+ potential visitors across top opportunities",
    ],
  },
};

export function buildReportId(period: string, businessId: string): string {
  return `report-${period}-${businessId}-${Date.now()}`;
}
