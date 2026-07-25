/**
 * Version history for content drafts.
 */

export interface VersionEntry {
  version: number;
  changedBy: string;
  summary: string;
  changedAt: string;
}

export interface VersionHistory {
  draftId: string;
  entries: VersionEntry[];
  currentVersion: number;
}
