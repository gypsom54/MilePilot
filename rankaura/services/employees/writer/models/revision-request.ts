/**
 * Revision request from a reviewer via orchestrator.
 */

export type RevisionSeverity = "minor" | "moderate" | "major";

export interface RevisionRequest {
  id: string;
  draftId: string;
  requestedBy: string;
  severity: RevisionSeverity;
  summary: string;
  details: string[];
  resolved: boolean;
  createdAt: string;
}
