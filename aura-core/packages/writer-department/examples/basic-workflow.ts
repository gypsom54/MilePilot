import { WriterDepartmentOrchestrator } from '../src/orchestrator/WriterDepartmentOrchestrator.js';
import { MOCK_BRIEF_LANDING_PAGE } from '../src/mock/mockBriefs.js';

const orchestrator = new WriterDepartmentOrchestrator();

console.log('=== Writer Department — Basic Workflow ===\n');
console.log(`Brief: ${MOCK_BRIEF_LANDING_PAGE.title}`);
console.log(`Format: ${MOCK_BRIEF_LANDING_PAGE.format}`);
console.log(`Impact tier: ${MOCK_BRIEF_LANDING_PAGE.businessContext.impactTier}\n`);

const report = orchestrator.submitBrief(MOCK_BRIEF_LANDING_PAGE);

console.log('--- Writer Report ---');
console.log(`Report ID:    ${report.id}`);
console.log(`Lifecycle:    ${report.lifecycleState}`);
console.log(`Draft ID:     ${report.draftId}`);
console.log(`Quality:      ${report.contentQuality.scores.overall}/100`);
console.log(`Review:       ${report.reviewSummary.finalOutcome}`);
console.log(`Revisions:    ${report.revisionHistory.length}`);
console.log(`Versions:     ${report.versionHistory.length}`);
console.log(`\nBusiness Impact:`);
console.log(`  Tier:         ${report.businessImpact.tier}`);
console.log(`  Reach:        ${report.businessImpact.estimatedReach.toLocaleString()}`);
console.log(`  Risk:         ${report.businessImpact.riskLevel}`);
