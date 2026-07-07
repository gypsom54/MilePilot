import type { BriefId, DraftId, DraftLifecycleState, WriterModuleId } from '../types/index.js';
import type { DraftLifecycle, LifecycleTransition } from '../types/interfaces.js';

const VALID_TRANSITIONS: Record<DraftLifecycleState, DraftLifecycleState[]> = {
  brief_received: ['planned'],
  planned: ['strategized'],
  strategized: ['drafted'],
  drafted: ['edited'],
  edited: ['in_review'],
  in_review: ['revision_requested', 'approved'],
  revision_requested: ['drafted', 'edited', 'in_review'],
  approved: ['published'],
  published: ['archived'],
  archived: [],
};

export function createDraftLifecycle(briefId: BriefId): DraftLifecycle {
  const now = new Date().toISOString();
  return {
    briefId,
    currentState: 'brief_received',
    stateHistory: [
      {
        from: 'brief_received',
        to: 'brief_received',
        triggeredBy: 'aura-core',
        reason: 'Brief submitted to Writer Department',
        timestamp: now,
      },
    ],
    startedAt: now,
  };
}

export function canTransition(
  from: DraftLifecycleState,
  to: DraftLifecycleState,
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionLifecycle(
  lifecycle: DraftLifecycle,
  to: DraftLifecycleState,
  triggeredBy: WriterModuleId | 'orchestrator' | 'aura-core',
  reason: string,
  draftId?: DraftId,
): DraftLifecycle {
  if (!canTransition(lifecycle.currentState, to)) {
    throw new Error(
      `Invalid lifecycle transition: ${lifecycle.currentState} → ${to}`,
    );
  }

  const transition: LifecycleTransition = {
    from: lifecycle.currentState,
    to,
    triggeredBy,
    reason,
    timestamp: new Date().toISOString(),
  };

  const completedAt =
    to === 'published' || to === 'archived'
      ? transition.timestamp
      : lifecycle.completedAt;

  return {
    ...lifecycle,
    draftId: draftId ?? lifecycle.draftId,
    currentState: to,
    stateHistory: [...lifecycle.stateHistory, transition],
    completedAt,
  };
}

export function isLifecycleComplete(lifecycle: DraftLifecycle): boolean {
  return lifecycle.currentState === 'published' || lifecycle.currentState === 'archived';
}

export function getLifecycleDuration(lifecycle: DraftLifecycle): number {
  const end = lifecycle.completedAt ?? new Date().toISOString();
  return new Date(end).getTime() - new Date(lifecycle.startedAt).getTime();
}
