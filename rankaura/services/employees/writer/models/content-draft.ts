/**
 * Content draft — central artefact moving through the Writer Department.
 */

export type DraftStatus =
  | "briefed"
  | "planned"
  | "strategised"
  | "drafted"
  | "edited"
  | "in_review"
  | "revision_requested"
  | "approved"
  | "archived";

export interface ContentDraft {
  id: string;
  businessId: string;
  title: string;
  contentType: "page" | "article" | "service" | "update";
  status: DraftStatus;
  brief: string;
  planSummary: string | null;
  strategySummary: string | null;
  body: string | null;
  editedBody: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}
