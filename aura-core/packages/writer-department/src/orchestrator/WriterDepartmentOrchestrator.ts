import type { BriefId, DraftId } from '../types/index.js';
import type {
  ContentBrief,
  ContentPlan,
  ContentStrategy,
  Draft,
  DraftLifecycle,
  EditedDraft,
  ReviewPipeline,
  RevisionRequest,
  VersionHistory,
  WriterReport,
} from '../types/interfaces.js';
import { MAX_REVISION_CYCLES } from '../config/department.config.js';
import { createBusinessImpact, updateBusinessImpactWithDraft } from '../models/BusinessImpact.js';
import {
  applyReviewResult,
  createContentQuality,
  incrementRevisionCount,
  isQualityPassing,
} from '../models/ContentQuality.js';
import { createDraftLifecycle, transitionLifecycle } from '../models/DraftLifecycle.js';
import {
  applyStageResult,
  createReviewPipeline,
  getCompletedStages,
  isPipelineBlocked,
  isPipelineComplete,
  startPipeline,
} from '../models/ReviewPipeline.js';
import {
  createRevisionRequest,
  getOpenRevisions,
  priorityFromFindings,
  resolveRevisionRequest,
} from '../models/RevisionRequest.js';
import {
  addVersionEntry,
  createVersionEntry,
  createVersionHistory,
} from '../models/VersionHistory.js';
import { createReviewSummary, createWriterReport } from '../models/WriterReport.js';
import { Copywriter } from '../modules/Copywriter.js';
import { Editor } from '../modules/Editor.js';
import { Planner } from '../modules/Planner.js';
import { Strategist } from '../modules/Strategist.js';
import {
  BrandReviewer,
  QAReviewer,
  ReadabilityReviewer,
  SEOReviewer,
} from '../modules/reviewers/index.js';

interface DepartmentState {
  lifecycle: DraftLifecycle;
  plan?: ContentPlan;
  strategy?: ContentStrategy;
  draft?: EditedDraft;
  pipeline?: ReviewPipeline;
  quality: ReturnType<typeof createContentQuality>;
  businessImpact: ReturnType<typeof createBusinessImpact>;
  revisions: RevisionRequest[];
  versionHistory?: VersionHistory;
  report?: WriterReport;
}

/**
 * Central orchestrator for the Writer Department.
 * All modules communicate ONLY through this class.
 * AuraCore communicates ONLY through AuraCoreBridge → this orchestrator.
 */
export class WriterDepartmentOrchestrator {
  private readonly planner = new Planner();
  private readonly strategist = new Strategist();
  private readonly copywriter = new Copywriter();
  private readonly editor = new Editor();
  private readonly seoReviewer = new SEOReviewer();
  private readonly brandReviewer = new BrandReviewer();
  private readonly readabilityReviewer = new ReadabilityReviewer();
  private readonly qaReviewer = new QAReviewer();

  private readonly states = new Map<BriefId, DepartmentState>();

  submitBrief(brief: ContentBrief): WriterReport {
    const lifecycle = createDraftLifecycle(brief.id);
    const businessImpact = createBusinessImpact(brief.id, brief.businessContext);

    this.states.set(brief.id, {
      lifecycle,
      quality: createContentQuality(`pending-${brief.id}`, 0),
      businessImpact,
      revisions: [],
    });

    return this.runProductionPipeline(brief);
  }

  getLifecycle(briefId: BriefId): DraftLifecycle {
    const state = this.requireState(briefId);
    return state.lifecycle;
  }

  getPipeline(draftId: DraftId): ReviewPipeline {
    for (const state of this.states.values()) {
      if (state.pipeline?.draftId === draftId) return state.pipeline;
    }
    throw new Error(`Pipeline not found for draft: ${draftId}`);
  }

  getReport(briefId: BriefId): WriterReport | null {
    return this.states.get(briefId)?.report ?? null;
  }

  getVersionHistory(draftId: DraftId): VersionHistory {
    for (const state of this.states.values()) {
      if (state.versionHistory?.draftId === draftId) return state.versionHistory;
    }
    throw new Error(`Version history not found for draft: ${draftId}`);
  }

  private runProductionPipeline(brief: ContentBrief): WriterReport {
    const state = this.requireState(brief.id);
    let lifecycle = state.lifecycle;

    // ── Planner ──
    const planResponse = this.planner.execute({ brief });
    if (!planResponse.success) throw new Error('Planner failed');
    lifecycle = transitionLifecycle(lifecycle, 'planned', 'planner', 'Content plan created');

    // ── Strategist ──
    const strategyResponse = this.strategist.execute({ brief, plan: planResponse.payload });
    if (!strategyResponse.success) throw new Error('Strategist failed');
    lifecycle = transitionLifecycle(lifecycle, 'strategized', 'strategist', 'Strategy defined');

    // ── Copywriter ──
    const draftResponse = this.copywriter.execute({
      brief,
      plan: planResponse.payload,
      strategy: strategyResponse.payload,
    });
    if (!draftResponse.success) throw new Error('Copywriter failed');
    lifecycle = transitionLifecycle(
      lifecycle,
      'drafted',
      'copywriter',
      'Initial draft produced',
      draftResponse.payload.id,
    );

    let versionHistory = createVersionHistory(brief.id, draftResponse.payload.id);
    versionHistory = addVersionEntry(
      versionHistory,
      createVersionEntry(
        draftResponse.payload.id,
        'copywriter',
        'Initial draft created',
        draftResponse.payload.wordCount,
      ),
    );

    // ── Editor ──
    const editResponse = this.editor.execute({ draft: draftResponse.payload });
    if (!editResponse.success) throw new Error('Editor failed');
    lifecycle = transitionLifecycle(lifecycle, 'edited', 'editor', 'Draft edited');
    versionHistory = addVersionEntry(
      versionHistory,
      createVersionEntry(
        editResponse.payload.id,
        'editor',
        'Editorial pass completed',
        editResponse.payload.wordCount,
      ),
    );

    const businessImpact = updateBusinessImpactWithDraft(
      state.businessImpact,
      editResponse.payload.id,
    );

    Object.assign(state, {
      lifecycle,
      plan: planResponse.payload,
      strategy: strategyResponse.payload,
      draft: editResponse.payload,
      businessImpact,
      versionHistory,
      quality: createContentQuality(editResponse.payload.id, editResponse.payload.version),
    });

    return this.runReviewPipeline(brief, editResponse.payload);
  }

  private runReviewPipeline(brief: ContentBrief, draft: Draft): WriterReport {
    const state = this.requireState(brief.id);
    let lifecycle = transitionLifecycle(
      state.lifecycle,
      'in_review',
      'orchestrator',
      'Review pipeline started',
    );

    let pipeline = startPipeline(createReviewPipeline(brief.id, draft.id));
    let quality = state.quality;
    const revisions: RevisionRequest[] = [...state.revisions];
    let revisionCycles = 0;

    const reviewers = [
      this.seoReviewer,
      this.brandReviewer,
      this.readabilityReviewer,
      this.qaReviewer,
    ] as const;

    for (const reviewer of reviewers) {
      const reviewRequest = {
        id: `review-${draft.id}-${reviewer.stage}`,
        draftId: draft.id,
        draftVersion: draft.version,
        stage: reviewer.stage,
        reviewerId: reviewer.moduleId,
        brief,
        draft,
        requestedAt: new Date().toISOString(),
      };

      const result = reviewer.execute(reviewRequest).payload;
      quality = applyReviewResult(quality, result);
      pipeline = applyStageResult(pipeline, reviewRequest.id, result);

      if (result.outcome !== 'pass') {
        const revision = createRevisionRequest({
          draftId: draft.id,
          draftVersion: draft.version,
          requestedBy: reviewer.moduleId,
          priority: priorityFromFindings(result.findings),
          findings: result.findings,
          instructions: `Address ${reviewer.stage} findings before proceeding`,
          targetModule: reviewer.stage === 'readability' ? 'editor' : 'copywriter',
        });
        revisions.push(revision);
        revisionCycles += 1;
        quality = incrementRevisionCount(quality);

        lifecycle = transitionLifecycle(
          lifecycle,
          'revision_requested',
          reviewer.moduleId,
          `${reviewer.stage} review requires revision`,
        );

        if (revisionCycles >= MAX_REVISION_CYCLES) break;

        revisions[revisions.length - 1] = resolveRevisionRequest(revision);
        lifecycle = transitionLifecycle(
          lifecycle,
          'in_review',
          'orchestrator',
          'Revision resolved — re-entering review (mock)',
        );
        pipeline = applyStageResult(pipeline, reviewRequest.id, {
          ...result,
          outcome: 'pass',
        });
      }
    }

    const completed = isPipelineComplete(pipeline);
    const blocked = isPipelineBlocked(pipeline);

    if (completed && isQualityPassing(quality)) {
      lifecycle = transitionLifecycle(lifecycle, 'approved', 'orchestrator', 'All reviews passed');
      lifecycle = transitionLifecycle(lifecycle, 'published', 'orchestrator', 'Content published');
    } else if (blocked && revisionCycles >= MAX_REVISION_CYCLES) {
      lifecycle = transitionLifecycle(
        lifecycle,
        'archived',
        'orchestrator',
        'Max revision cycles exceeded',
      );
    }

    const reviewSummary = createReviewSummary(
      getCompletedStages(pipeline),
      pipeline.stages.filter((s) => s.status === 'passed').length,
      pipeline.stages.filter((s) => s.status === 'failed').length,
    );

    const report = createWriterReport({
      briefId: brief.id,
      draftId: draft.id,
      title: brief.title,
      lifecycle,
      businessImpact: state.businessImpact,
      contentQuality: quality,
      revisionHistory: revisions,
      versionHistory: state.versionHistory?.entries ?? [],
      reviewSummary,
      recommendations: getOpenRevisions(revisions).map((r) => r.instructions),
    });

    Object.assign(state, { lifecycle, pipeline, quality, revisions, report });
    return report;
  }

  private requireState(briefId: BriefId): DepartmentState {
    const state = this.states.get(briefId);
    if (!state) throw new Error(`No state for brief: ${briefId}`);
    return state;
  }
}
