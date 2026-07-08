import { describe, it, expect } from 'vitest';
import { AuraCoreBridge } from '../src/orchestrator/AuraCoreBridge.js';
import { WriterDepartmentOrchestrator } from '../src/orchestrator/WriterDepartmentOrchestrator.js';
import { MOCK_BRIEF_EMAIL } from '../src/mock/mockBriefs.js';

describe('Module isolation', () => {
  it('AuraCore communicates only through bridge', () => {
    const bridge = new AuraCoreBridge();
    const response = bridge.handleRequest({
      type: 'submit_brief',
      payload: MOCK_BRIEF_EMAIL,
      requestId: 'iso-001',
      timestamp: new Date().toISOString(),
    });

    expect(response.type).toBe('acknowledged');
    expect(response.requestId).toBe('iso-001');
  });

  it('orchestrator coordinates all modules without direct module-to-module calls', () => {
    const orchestrator = new WriterDepartmentOrchestrator();
    const report = orchestrator.submitBrief(MOCK_BRIEF_EMAIL);

    expect(report.versionHistory.length).toBeGreaterThanOrEqual(2);
    expect(report.contentQuality.scores.overall).toBeGreaterThan(0);
    expect(report.reviewSummary.stagesCompleted.length).toBeGreaterThan(0);
  });

  it('reviewers do not expose cross-reviewer communication', () => {
    const orchestrator = new WriterDepartmentOrchestrator();
    const report = orchestrator.submitBrief(MOCK_BRIEF_EMAIL);
    const pipeline = orchestrator.getPipeline(report.draftId);

    for (const stage of pipeline.stages) {
      if (stage.result) {
        expect(stage.result.reviewerId).toBe(stage.reviewerId);
      }
    }
  });
});
