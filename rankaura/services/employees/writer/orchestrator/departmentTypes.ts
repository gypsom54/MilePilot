import type { BusinessImpact } from "@/services/employees/writer/models/business-impact";
import type { ContentDraft } from "@/services/employees/writer/models/content-draft";
import type { ContentQuality } from "@/services/employees/writer/models/content-quality";
import type { RevisionRequest } from "@/services/employees/writer/models/revision-request";
import type { VersionHistory } from "@/services/employees/writer/models/version-history";
import type { WriterReport } from "@/services/employees/writer/models/writer-report";
import type { ReviewPipelineResult } from "@/services/employees/writer/pipeline/types";

export interface WriterBriefInput {
  businessId: string;
  title: string;
  contentType: ContentDraft["contentType"];
  brief: string;
}

export interface WriterDepartmentResult {
  draft: ContentDraft;
  versionHistory: VersionHistory;
  businessImpact: BusinessImpact | null;
  contentQuality: ContentQuality | null;
  reviewResult: ReviewPipelineResult | null;
  revisionRequests: RevisionRequest[];
}

export interface IWriterDepartmentOrchestrator {
  receiveBrief(input: WriterBriefInput): Promise<ContentDraft>;
  runProduction(draftId: string): Promise<WriterDepartmentResult>;
  runReview(draftId: string): Promise<WriterDepartmentResult>;
  getDraft(draftId: string): Promise<ContentDraft>;
  getVersionHistory(draftId: string): Promise<VersionHistory>;
  generateReport(businessId: string): Promise<WriterReport>;
}
