import { describe, it, expect } from 'vitest';
import {
  createDraftLifecycle,
  transitionLifecycle,
  canTransition,
} from '../src/models/DraftLifecycle.js';

describe('DraftLifecycle', () => {
  it('starts in brief_received state', () => {
    const lifecycle = createDraftLifecycle('brief-001');
    expect(lifecycle.currentState).toBe('brief_received');
  });

  it('allows valid transitions', () => {
    expect(canTransition('brief_received', 'planned')).toBe(true);
    expect(canTransition('planned', 'strategized')).toBe(true);
    expect(canTransition('in_review', 'approved')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(canTransition('brief_received', 'published')).toBe(false);
    expect(canTransition('drafted', 'approved')).toBe(false);
  });

  it('records transition history', () => {
    let lifecycle = createDraftLifecycle('brief-001');
    lifecycle = transitionLifecycle(lifecycle, 'planned', 'planner', 'Plan created');
    lifecycle = transitionLifecycle(lifecycle, 'strategized', 'strategist', 'Strategy defined');

    expect(lifecycle.currentState).toBe('strategized');
    expect(lifecycle.stateHistory).toHaveLength(3);
  });

  it('throws on invalid transition', () => {
    const lifecycle = createDraftLifecycle('brief-001');
    expect(() =>
      transitionLifecycle(lifecycle, 'published', 'orchestrator', 'Invalid'),
    ).toThrow('Invalid lifecycle transition');
  });
});
