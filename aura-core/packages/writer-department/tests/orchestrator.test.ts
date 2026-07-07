import { describe, it, expect } from 'vitest';
import { WriterDepartmentOrchestrator } from '../src/orchestrator/WriterDepartmentOrchestrator.js';
import { MOCK_BRIEF_LANDING_PAGE } from '../src/mock/mockBriefs.js';

describe('WriterDepartmentOrchestrator', () => {
  const orchestrator = new WriterDepartmentOrchestrator();

  it('processes a brief through the full pipeline', () => {
    const report = orchestrator.submitBrief(MOCK_BRIEF_LANDING_PAGE);

    expect(report.id).toMatch(/^report-/);
    expect(report.briefId).toBe('brief-001');
    expect(report.draftId).toBeDefined();
    expect(report.lifecycleState).toBe('published');
  });

  it('tracks lifecycle transitions', () => {
    const orchestrator2 = new WriterDepartmentOrchestrator();
    orchestrator2.submitBrief(MOCK_BRIEF_LANDING_PAGE);
    const lifecycle = orchestrator2.getLifecycle('brief-001');

    expect(lifecycle.stateHistory.length).toBeGreaterThan(5);
    expect(lifecycle.currentState).toBe('published');
  });

  it('generates version history', () => {
    const orchestrator3 = new WriterDepartmentOrchestrator();
    const report = orchestrator3.submitBrief(MOCK_BRIEF_LANDING_PAGE);
    const history = orchestrator3.getVersionHistory(report.draftId);

    expect(history.entries.length).toBeGreaterThanOrEqual(2);
    expect(history.currentVersion).toBeGreaterThanOrEqual(2);
  });

  it('returns null for unknown brief report', () => {
    expect(orchestrator.getReport('unknown')).toBeNull();
  });
});
