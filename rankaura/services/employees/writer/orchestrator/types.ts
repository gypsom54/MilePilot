/**
 * Shared module message envelope — all inter-module communication via orchestrator.
 */

import type { ContentDraft } from "@/services/employees/writer/models/content-draft";

export interface ModuleInput<TPayload = unknown> {
  draft: ContentDraft;
  payload?: TPayload;
}

export interface ModuleOutput<TPayload = unknown> {
  draft: ContentDraft;
  payload: TPayload;
  moduleId: string;
  completedAt: string;
}

export interface IWriterModule<TIn = unknown, TOut = unknown> {
  readonly moduleId: string;
  execute(input: ModuleInput<TIn>): Promise<ModuleOutput<TOut>>;
}
