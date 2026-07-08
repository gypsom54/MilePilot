/**
 * Writer Department — core interfaces.
 * All inter-module communication flows through the orchestrator.
 */

import type {
  ArtefactId,
  AudienceSegment,
  BriefId,
  ContentFormat,
  DraftId,
  DraftLifecycleState,
  ImpactTier,
  QualityScore,
  ReportId,
  ReviewId,
  ReviewOutcome,
  ReviewStage,
  RevisionId,
  RevisionPriority,
  ReviewerModuleId,
  ToneDirective,
  WriterModuleId,
} from './index.js';

// ─── Brief & Content ─────────────────────────────────────────────────────────

export interface ContentBrief {
  id: BriefId;
  title: string;
  format: ContentFormat;
  audience: AudienceSegment;
  tone: ToneDirective;
  objective: string;
  keywords: string[];
  constraints: ContentConstraints;
  businessContext: BusinessContext;
  createdAt: string;
}

export interface ContentConstraints {
  maxWordCount?: number;
  minWordCount?: number;
  requiredSections?: string[];
  forbiddenTerms?: string[];
  callToAction?: string;
}

export interface BusinessContext {
  campaign?: string;
  productArea?: string;
  targetMetric?: string;
  impactTier: ImpactTier;
}

// ─── Production Artefacts ────────────────────────────────────────────────────

export interface ContentPlan {
  id: ArtefactId;
  briefId: BriefId;
  outline: PlanSection[];
  estimatedWordCount: number;
  keyMessages: string[];
  createdBy: 'planner';
  createdAt: string;
}

export interface PlanSection {
  heading: string;
  purpose: string;
  targetWordCount: number;
}

export interface ContentStrategy {
  id: ArtefactId;
  briefId: BriefId;
  planId: ArtefactId;
  angle: string;
  positioning: string;
  narrativeArc: string[];
  seoFocus: string[];
  brandPillars: string[];
  createdBy: 'strategist';
  createdAt: string;
}

export interface Draft {
  id: DraftId;
  briefId: BriefId;
  version: number;
  title: string;
  body: string;
  wordCount: number;
  sections: DraftSection[];
  metadata: DraftMetadata;
}

export interface DraftSection {
  heading: string;
  content: string;
}

export interface DraftMetadata {
  planId: ArtefactId;
  strategyId: ArtefactId;
  producedBy: 'copywriter' | 'editor';
  lastModifiedBy: WriterModuleId;
  lastModifiedAt: string;
}

export interface EditedDraft extends Draft {
  editSummary: EditSummary;
}

export interface EditSummary {
  structuralChanges: string[];
  clarityImprovements: string[];
  consistencyFixes: string[];
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface ReviewRequest {
  id: ReviewId;
  draftId: DraftId;
  draftVersion: number;
  stage: ReviewStage;
  reviewerId: ReviewerModuleId;
  brief: ContentBrief;
  draft: Draft;
  requestedAt: string;
}

export interface ReviewResult {
  id: ReviewId;
  draftId: DraftId;
  draftVersion: number;
  reviewerId: ReviewerModuleId;
  stage: ReviewStage;
  outcome: ReviewOutcome;
  findings: ReviewFinding[];
  qualityDelta: Partial<ContentQualityScores>;
  completedAt: string;
}

export interface ReviewFinding {
  severity: 'info' | 'warning' | 'error';
  category: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ContentQualityScores {
  seo: QualityScore;
  brand: QualityScore;
  readability: QualityScore;
  qa: QualityScore;
  overall: QualityScore;
}

// ─── Models ──────────────────────────────────────────────────────────────────

export interface BusinessImpact {
  briefId: BriefId;
  draftId?: DraftId;
  tier: ImpactTier;
  estimatedReach: number;
  conversionPotential: number;
  brandExposure: number;
  revenueAttribution?: number;
  strategicValue: string;
  riskLevel: 'low' | 'medium' | 'high';
  assessedAt: string;
}

export interface ContentQuality {
  draftId: DraftId;
  version: number;
  scores: ContentQualityScores;
  passedReviewers: ReviewerModuleId[];
  failedReviewers: ReviewerModuleId[];
  revisionCount: number;
  assessedAt: string;
}

export interface RevisionRequest {
  id: RevisionId;
  draftId: DraftId;
  draftVersion: number;
  requestedBy: ReviewerModuleId;
  priority: RevisionPriority;
  findings: ReviewFinding[];
  instructions: string;
  targetModule: 'copywriter' | 'editor';
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}

export interface WriterReport {
  id: ReportId;
  briefId: BriefId;
  draftId: DraftId;
  title: string;
  lifecycleState: DraftLifecycleState;
  businessImpact: BusinessImpact;
  contentQuality: ContentQuality;
  revisionHistory: RevisionRequest[];
  versionHistory: VersionEntry[];
  reviewSummary: ReviewSummary;
  recommendations: string[];
  generatedAt: string;
}

export interface ReviewSummary {
  totalPasses: number;
  totalFailures: number;
  stagesCompleted: ReviewStage[];
  finalOutcome: 'approved' | 'rejected' | 'pending';
}

export interface VersionEntry {
  version: number;
  draftId: DraftId;
  modifiedBy: WriterModuleId;
  changeDescription: string;
  wordCount: number;
  timestamp: string;
}

export interface VersionHistory {
  draftId: DraftId;
  briefId: BriefId;
  entries: VersionEntry[];
  currentVersion: number;
}

// ─── Lifecycle & Pipeline ────────────────────────────────────────────────────

export interface DraftLifecycle {
  briefId: BriefId;
  draftId?: DraftId;
  currentState: DraftLifecycleState;
  stateHistory: LifecycleTransition[];
  startedAt: string;
  completedAt?: string;
}

export interface LifecycleTransition {
  from: DraftLifecycleState;
  to: DraftLifecycleState;
  triggeredBy: WriterModuleId | 'orchestrator' | 'aura-core';
  reason: string;
  timestamp: string;
}

export interface ReviewPipeline {
  draftId: DraftId;
  briefId: BriefId;
  stages: ReviewPipelineStage[];
  currentStageIndex: number;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  startedAt: string;
  completedAt?: string;
}

export interface ReviewPipelineStage {
  stage: ReviewStage;
  reviewerId: ReviewerModuleId;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  reviewId?: ReviewId;
  result?: ReviewResult;
}

// ─── Orchestrator Messages ───────────────────────────────────────────────────

/** Messages AuraCore sends to the Writer Department orchestrator */
export interface AuraCoreRequest {
  type: 'submit_brief' | 'get_status' | 'get_report' | 'cancel';
  payload: unknown;
  requestId: string;
  timestamp: string;
}

export interface AuraCoreResponse {
  type: 'acknowledged' | 'status' | 'report' | 'error';
  requestId: string;
  payload: unknown;
  timestamp: string;
}

/** Internal orchestrator dispatch envelope */
export interface OrchestratorDispatch<T = unknown> {
  targetModule: WriterModuleId;
  operation: string;
  payload: T;
  correlationId: string;
  timestamp: string;
}

/** Module response envelope returned to orchestrator */
export interface ModuleResponse<T = unknown> {
  moduleId: WriterModuleId;
  operation: string;
  success: boolean;
  payload: T;
  errors?: string[];
  correlationId: string;
  timestamp: string;
}

// ─── Module Contracts ────────────────────────────────────────────────────────

export interface IWriterModule<TInput = unknown, TOutput = unknown> {
  readonly moduleId: WriterModuleId;
  execute(input: TInput): ModuleResponse<TOutput>;
}

export interface IReviewer extends IWriterModule<ReviewRequest, ReviewResult> {
  readonly moduleId: ReviewerModuleId;
  readonly stage: ReviewStage;
  readonly responsibility: string;
}

export interface IWriterDepartmentOrchestrator {
  submitBrief(brief: ContentBrief): WriterReport;
  getLifecycle(briefId: BriefId): DraftLifecycle;
  getPipeline(draftId: DraftId): ReviewPipeline;
  getReport(briefId: BriefId): WriterReport | null;
  getVersionHistory(draftId: DraftId): VersionHistory;
}

export interface IAuraCoreBridge {
  handleRequest(request: AuraCoreRequest): AuraCoreResponse;
}
