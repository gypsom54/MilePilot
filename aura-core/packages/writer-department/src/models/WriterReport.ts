import type { BriefId, DraftId, ReportId } from '../types/index.js';
import type {
  BusinessImpact,
  ContentQuality,
  DraftLifecycle,
  ReviewSummary,
  RevisionRequest,
  VersionEntry,
  WriterReport,
} from '../types/interfaces.js';

let reportCounter = 0;

export function generateReportId(): ReportId {
  reportCounter += 1;
  return `report-${String(reportCounter).padStart(4, '0')}`;
}

export function createWriterReport(params: {
  briefId: BriefId;
  draftId: DraftId;
  title: string;
  lifecycle: DraftLifecycle;
  businessImpact: BusinessImpact;
  contentQuality: ContentQuality;
  revisionHistory: RevisionRequest[];
  versionHistory: VersionEntry[];
  reviewSummary: ReviewSummary;
  recommendations?: string[];
}): WriterReport {
  return {
    id: generateReportId(),
    briefId: params.briefId,
    draftId: params.draftId,
    title: params.title,
    lifecycleState: params.lifecycle.currentState,
    businessImpact: params.businessImpact,
    contentQuality: params.contentQuality,
    revisionHistory: params.revisionHistory,
    versionHistory: params.versionHistory,
    reviewSummary: params.reviewSummary,
    recommendations: params.recommendations ?? [],
    generatedAt: new Date().toISOString(),
  };
}

export function createReviewSummary(
  stagesCompleted: ReviewSummary['stagesCompleted'],
  totalPasses: number,
  totalFailures: number,
): ReviewSummary {
  let finalOutcome: ReviewSummary['finalOutcome'] = 'pending';
  if (totalFailures > 0 && totalPasses === 0) finalOutcome = 'rejected';
  else if (totalPasses === stagesCompleted.length && stagesCompleted.length === 4) finalOutcome = 'approved';

  return { totalPasses, totalFailures, stagesCompleted, finalOutcome };
}
