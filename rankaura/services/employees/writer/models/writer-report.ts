/**
 * Writer Department activity report.
 */

export interface WriterReport {
  id: string;
  businessId: string;
  period: "daily" | "weekly";
  headline: string;
  draftsInProgress: number;
  draftsApproved: number;
  revisionsRequested: number;
  highlights: string[];
  generatedAt: string;
}
