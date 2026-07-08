/**
 * Draft lifecycle manager — governs draft state transitions.
 */

import { DRAFT_TRANSITIONS } from "@/services/employees/writer/lifecycle/config";
import type {
  IDraftLifecycle,
  LifecycleTransitionResult,
} from "@/services/employees/writer/lifecycle/types";
import type { ContentDraft, DraftStatus } from "@/services/employees/writer/models/content-draft";

export const draftLifecycle: IDraftLifecycle = {
  canTransition(from: DraftStatus, to: DraftStatus): boolean {
    return DRAFT_TRANSITIONS[from]?.includes(to) ?? false;
  },

  transition(
    draft: ContentDraft,
    to: DraftStatus,
    changedBy: string,
    summary: string,
  ): LifecycleTransitionResult {
    if (!this.canTransition(draft.status, to)) {
      throw new Error(`Invalid lifecycle transition: ${draft.status} → ${to}`);
    }

    const previousStatus = draft.status;
    const newVersion = draft.version + 1;
    const now = new Date().toISOString();

    const updated: ContentDraft = {
      ...draft,
      status: to,
      version: newVersion,
      updatedAt: now,
    };

    return {
      draft: updated,
      versionEntry: {
        version: newVersion,
        changedBy,
        summary,
        changedAt: now,
      },
      previousStatus,
      newStatus: to,
    };
  },
};
