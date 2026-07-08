/**
 * Writer Department orchestrator — sole entry point for AuraCore and all modules.
 * No module communicates directly with another module.
 */

import { draftLifecycle } from "@/services/employees/writer/lifecycle";
import { brandReviewerModule } from "@/services/employees/writer/modules/brand-reviewer";
import { copywriterModule } from "@/services/employees/writer/modules/copywriter";
import { editorModule } from "@/services/employees/writer/modules/editor";
import { plannerModule } from "@/services/employees/writer/modules/planner";
import { qaReviewerModule } from "@/services/employees/writer/modules/qa-reviewer";
import { readabilityReviewerModule } from "@/services/employees/writer/modules/readability-reviewer";
import { seoReviewerModule } from "@/services/employees/writer/modules/seo-reviewer";
import { strategistModule } from "@/services/employees/writer/modules/strategist";
import type { IWriterDepartmentOrchestrator, WriterBriefInput, WriterDepartmentResult } from "@/services/employees/writer/orchestrator/departmentTypes";
import type { BusinessImpact } from "@/services/employees/writer/models/business-impact";
import type { ContentDraft } from "@/services/employees/writer/models/content-draft";
import type { ContentQuality } from "@/services/employees/writer/models/content-quality";
import type { RevisionRequest } from "@/services/employees/writer/models/revision-request";
import type { VersionEntry, VersionHistory } from "@/services/employees/writer/models/version-history";
import type { WriterReport } from "@/services/employees/writer/models/writer-report";
import { getMockDraft, MOCK_DRAFT_ID, saveMockDraft } from "@/services/employees/writer/mock";
import { reviewPipeline } from "@/services/employees/writer/pipeline";
import type { ReviewPipelineStageResult } from "@/services/employees/writer/pipeline/types";
import type { IWriterModule } from "@/services/employees/writer/orchestrator/types";

const reviewerModules: Record<string, IWriterModule<void, ReviewPipelineStageResult>> = {
  editor: editorModule,
  "seo-reviewer": seoReviewerModule,
  "brand-reviewer": brandReviewerModule,
  "readability-reviewer": readabilityReviewerModule,
  "qa-reviewer": qaReviewerModule,
};

const versionRegistry = new Map<string, VersionEntry[]>();
const revisionRegistry = new Map<string, RevisionRequest[]>();

function getVersionHistory(draftId: string): VersionHistory {
  return {
    draftId,
    entries: versionRegistry.get(draftId) ?? [],
    currentVersion: versionRegistry.get(draftId)?.at(-1)?.version ?? 1,
  };
}

function recordVersion(draftId: string, entry: VersionEntry): void {
  const entries = versionRegistry.get(draftId) ?? [];
  entries.push(entry);
  versionRegistry.set(draftId, entries);
}

function recordRevision(draftId: string, request: RevisionRequest): void {
  const entries = revisionRegistry.get(draftId) ?? [];
  entries.push(request);
  revisionRegistry.set(draftId, entries);
}

export const writerDepartmentOrchestrator: IWriterDepartmentOrchestrator = {
  async receiveBrief(input: WriterBriefInput): Promise<ContentDraft> {
    const now = new Date().toISOString();
    const draft: ContentDraft = {
      id: `draft-${Date.now()}`,
      businessId: input.businessId,
      title: input.title,
      contentType: input.contentType,
      status: "briefed",
      brief: input.brief,
      planSummary: null,
      strategySummary: null,
      body: null,
      editedBody: null,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    saveMockDraft(draft);
    recordVersion(draft.id, { version: 1, changedBy: "orchestrator", summary: "Brief received", changedAt: now });
    return draft;
  },

  async getDraft(draftId: string): Promise<ContentDraft> {
    const draft = getMockDraft(draftId);
    if (!draft) throw new Error(`Draft not found: ${draftId}`);
    return draft;
  },

  async getVersionHistory(draftId: string): Promise<VersionHistory> {
    return getVersionHistory(draftId);
  },

  async runProduction(draftId: string): Promise<WriterDepartmentResult> {
    let draft = await this.getDraft(draftId);

    const planResult = await plannerModule.execute({ draft, payload: { brief: draft.brief } });
    draft = saveMockDraft(planResult.draft);
    const planTransition = draftLifecycle.transition(draft, "planned", "planner", "Content plan created");
    draft = saveMockDraft(planTransition.draft);
    recordVersion(draft.id, planTransition.versionEntry);

    const strategyResult = await strategistModule.execute({ draft });
    draft = saveMockDraft(strategyResult.draft);
    const strategyTransition = draftLifecycle.transition(draft, "strategised", "strategist", "Strategy defined");
    draft = saveMockDraft(strategyTransition.draft);
    recordVersion(draft.id, strategyTransition.versionEntry);

    const copyResult = await copywriterModule.execute({ draft });
    draft = saveMockDraft(copyResult.draft);
    const draftTransition = draftLifecycle.transition(draft, "drafted", "copywriter", "First draft created");
    draft = saveMockDraft(draftTransition.draft);
    recordVersion(draft.id, draftTransition.versionEntry);

    const businessImpact: BusinessImpact = {
      draftId: draft.id,
      estimatedVisitorIncrease: "+120/month",
      estimatedLeadIncrease: "+4/month",
      confidence: 82,
      rationale: "Service page targets high-demand local search intent",
      assessedAt: new Date().toISOString(),
    };

    return {
      draft,
      versionHistory: getVersionHistory(draft.id),
      businessImpact,
      contentQuality: null,
      reviewResult: null,
      revisionRequests: revisionRegistry.get(draft.id) ?? [],
    };
  },

  async runReview(draftId: string): Promise<WriterDepartmentResult> {
    let draft = await this.getDraft(draftId);
    let enteredReview = false;

    const reviewResult = await reviewPipeline.run({ draft }, async (reviewerId) => {
      const reviewerModule = reviewerModules[reviewerId];
      if (!reviewerModule) throw new Error(`Unknown reviewer: ${reviewerId}`);
      const result = await reviewerModule.execute({ draft });
      draft = saveMockDraft(result.draft);

      if (reviewerId === "editor") {
        const editTransition = draftLifecycle.transition(draft, "edited", "editor", "Draft edited");
        draft = saveMockDraft(editTransition.draft);
        recordVersion(draftId, editTransition.versionEntry);
      } else if (!enteredReview) {
        const reviewTransition = draftLifecycle.transition(draft, "in_review", "orchestrator", "Review pipeline started");
        draft = saveMockDraft(reviewTransition.draft);
        recordVersion(draftId, reviewTransition.versionEntry);
        enteredReview = true;
      }

      if (result.payload.revisionRequest) {
        recordRevision(draftId, result.payload.revisionRequest);
        const revisionTransition = draftLifecycle.transition(draft, "revision_requested", reviewerId, result.payload.revisionRequest.summary);
        draft = saveMockDraft(revisionTransition.draft);
        recordVersion(draftId, revisionTransition.versionEntry);
      }

      return result.payload;
    });

    const scores = reviewResult.stages.map((s) => s.score);
    const contentQuality: ContentQuality = {
      draftId,
      overallScore: Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length),
      passed: reviewResult.overallPassed,
      scores,
      assessedAt: new Date().toISOString(),
    };

    if (reviewResult.overallPassed && draft.status === "in_review") {
      const approved = draftLifecycle.transition(draft, "approved", "qa-reviewer", "All reviews passed");
      draft = saveMockDraft(approved.draft);
      recordVersion(draft.id, approved.versionEntry);
    }

    return {
      draft,
      versionHistory: getVersionHistory(draft.id),
      businessImpact: null,
      contentQuality,
      reviewResult,
      revisionRequests: revisionRegistry.get(draft.id) ?? [],
    };
  },

  async generateReport(businessId: string): Promise<WriterReport> {
    const draft = getMockDraft(MOCK_DRAFT_ID);
    return {
      id: `writer-report-${Date.now()}`,
      businessId,
      period: "daily",
      headline: "Your content team made progress today",
      draftsInProgress: draft?.status === "approved" ? 0 : 1,
      draftsApproved: draft?.status === "approved" ? 1 : 0,
      revisionsRequested: (revisionRegistry.get(MOCK_DRAFT_ID) ?? []).length,
      highlights: [
        "Emergency Boiler Repair page drafted",
        "All quality reviews passed",
        "Ready for your approval",
      ],
      generatedAt: new Date().toISOString(),
    };
  },
};
