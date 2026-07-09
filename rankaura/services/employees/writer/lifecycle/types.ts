import type { ContentDraft, DraftStatus } from "@/services/employees/writer/models/content-draft";
import type { VersionEntry } from "@/services/employees/writer/models/version-history";

export interface LifecycleTransitionResult {
  draft: ContentDraft;
  versionEntry: VersionEntry;
  previousStatus: DraftStatus;
  newStatus: DraftStatus;
}

export interface IDraftLifecycle {
  canTransition(from: DraftStatus, to: DraftStatus): boolean;
  transition(draft: ContentDraft, to: DraftStatus, changedBy: string, summary: string): LifecycleTransitionResult;
}
