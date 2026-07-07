import type { DraftId, RevisionId, ReviewerModuleId, RevisionPriority } from '../types/index.js';
import type { ReviewFinding, RevisionRequest } from '../types/interfaces.js';

let revisionCounter = 0;

export function generateRevisionId(): RevisionId {
  revisionCounter += 1;
  return `rev-${String(revisionCounter).padStart(4, '0')}`;
}

export function createRevisionRequest(params: {
  draftId: DraftId;
  draftVersion: number;
  requestedBy: ReviewerModuleId;
  priority: RevisionPriority;
  findings: ReviewFinding[];
  instructions: string;
  targetModule: 'copywriter' | 'editor';
}): RevisionRequest {
  return {
    id: generateRevisionId(),
    draftId: params.draftId,
    draftVersion: params.draftVersion,
    requestedBy: params.requestedBy,
    priority: params.priority,
    findings: params.findings,
    instructions: params.instructions,
    targetModule: params.targetModule,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
}

export function resolveRevisionRequest(revision: RevisionRequest): RevisionRequest {
  return {
    ...revision,
    status: 'resolved',
    resolvedAt: new Date().toISOString(),
  };
}

export function getOpenRevisions(revisions: RevisionRequest[]): RevisionRequest[] {
  return revisions.filter((r) => r.status === 'open' || r.status === 'in_progress');
}

export function priorityFromFindings(findings: ReviewFinding[]): RevisionPriority {
  if (findings.some((f) => f.severity === 'error')) return 'high';
  if (findings.some((f) => f.severity === 'warning')) return 'medium';
  return 'low';
}
