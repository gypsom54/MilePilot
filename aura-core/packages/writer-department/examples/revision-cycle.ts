import { AuraCoreBridge } from '../src/orchestrator/AuraCoreBridge.js';
import { MOCK_BRIEF_ARTICLE } from '../src/mock/mockBriefs.js';

const bridge = new AuraCoreBridge();

console.log('=== Writer Department — Revision Cycle (via AuraCore) ===\n');

const submitResponse = bridge.handleRequest({
  type: 'submit_brief',
  payload: MOCK_BRIEF_ARTICLE,
  requestId: 'req-001',
  timestamp: new Date().toISOString(),
});

console.log('Submit response:', submitResponse.type);
const { briefId } = submitResponse.payload as { briefId: string };

const statusResponse = bridge.handleRequest({
  type: 'get_status',
  payload: { briefId },
  requestId: 'req-002',
  timestamp: new Date().toISOString(),
});

const lifecycle = (statusResponse.payload as { lifecycle: { currentState: string; stateHistory: unknown[] } }).lifecycle;
console.log(`Lifecycle state: ${lifecycle.currentState}`);
console.log(`Transitions: ${lifecycle.stateHistory.length}`);

const reportResponse = bridge.handleRequest({
  type: 'get_report',
  payload: { briefId },
  requestId: 'req-003',
  timestamp: new Date().toISOString(),
});

const report = (reportResponse.payload as { report: { revisionHistory: unknown[]; reviewSummary: { finalOutcome: string } } }).report;
console.log(`Revisions: ${report.revisionHistory.length}`);
console.log(`Final outcome: ${report.reviewSummary.finalOutcome}`);
