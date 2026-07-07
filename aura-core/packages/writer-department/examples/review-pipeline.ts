import { WriterDepartmentOrchestrator } from '../src/orchestrator/WriterDepartmentOrchestrator.js';
import { MOCK_BRIEF_EMAIL } from '../src/mock/mockBriefs.js';

const orchestrator = new WriterDepartmentOrchestrator();

console.log('=== Writer Department — Review Pipeline ===\n');

const report = orchestrator.submitBrief(MOCK_BRIEF_EMAIL);
const pipeline = orchestrator.getPipeline(report.draftId);

console.log(`Pipeline status: ${pipeline.status}`);
console.log(`Stages:\n`);

for (const stage of pipeline.stages) {
  const icon = stage.status === 'passed' ? '✓' : stage.status === 'failed' ? '✗' : '○';
  const score = stage.result?.qualityDelta
    ? Object.values(stage.result.qualityDelta)[0]
    : '—';
  console.log(`  ${icon} ${stage.stage.padEnd(14)} [${stage.reviewerId}] → ${stage.status} (score: ${score})`);
}

console.log(`\nFinal quality: ${report.contentQuality.scores.overall}/100`);
console.log(`Passed reviewers: ${report.contentQuality.passedReviewers.join(', ') || 'none'}`);
