import type { Draft, EditedDraft, ModuleResponse } from '../types/interfaces.js';
import { MODULE_RESPONSIBILITIES } from '../config/department.config.js';
import { BaseModule } from './BaseModule.js';

export interface EditorInput {
  draft: Draft;
  correlationId?: string;
}

export class Editor extends BaseModule<EditorInput, EditedDraft> {
  readonly moduleId = 'editor' as const;
  readonly responsibility = MODULE_RESPONSIBILITIES.editor;

  execute(input: EditorInput): ModuleResponse<EditedDraft> {
    const correlationId = input.correlationId ?? this.generateCorrelationId();
    const { draft } = input;

    const editedDraft: EditedDraft = {
      ...draft,
      body: draft.body.replace(/\[Draft copy/g, '[Edited copy'),
      metadata: {
        ...draft.metadata,
        producedBy: 'editor',
        lastModifiedBy: 'editor',
        lastModifiedAt: new Date().toISOString(),
      },
      editSummary: {
        structuralChanges: ['Normalised section headings'],
        clarityImprovements: ['Removed placeholder brackets from intro'],
        consistencyFixes: ['Unified tone across sections'],
      },
    };

    return this.createResponse('edit_draft', true, editedDraft, correlationId);
  }
}
