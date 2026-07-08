/**
 * Mission Workspace types — universal workflow engine for department reviews.
 */

export type MissionWorkspaceStatus =
  | "ready_for_approval"
  | "in_review"
  | "approved"
  | "pending"
  | "revision_requested"
  | "saved_for_later"
  | "archived";

export type MissionType = "content_guide" | "service_page" | "campaign" | "email";
export type MissionPriority = "high" | "medium" | "low";
export type CompetitionLevel = "low" | "medium" | "high";
export type IntentLevel = "low" | "medium" | "high";

/** @deprecated Sprint 003 — retained for service migration */
export type DepartmentWorkflowStatus =
  | "completed"
  | "draft_ready"
  | "passed"
  | "waiting_approval"
  | "revision_requested"
  | "in_progress";

export interface DepartmentStatus {
  id: string;
  name: string;
  status: DepartmentWorkflowStatus;
  statusLabel: string;
  outputs: string[];
}

export interface MissionComment {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface MissionTimelineEvent {
  id: string;
  time: string;
  title: string;
  type: "mission" | "team" | "system";
}

export interface ScoutReport {
  marketOpportunity: string;
  monthlySearches: number;
  competition: CompetitionLevel;
  competitionLabel: string;
  intent: IntentLevel;
  intentLabel: string;
  suggestedAngle: string;
  customerIntent: string;
  competitorObservations: string[];
  customerQuestions: string[];
  confidence: number;
}

export interface WriterDraftSection {
  heading: string;
  body: string;
}

export type WriterDraftStatus = "draft_ready" | "approved" | "revision_requested";

export interface WriterDraft {
  title: string;
  introduction: string;
  sections: WriterDraftSection[];
  callToAction: string;
  status: WriterDraftStatus;
  statusLabel: string;
}

export interface ArchitectChecklistItem {
  id: string;
  label: string;
  passed: boolean;
}

export interface ArchitectReview {
  pageStructure: string[];
  headingHierarchy: string[];
  internalLinks: string[];
  relatedPages: string[];
  structureScore: number;
  checklist: ArchitectChecklistItem[];
}

export interface GuardianCheckItem {
  id: string;
  label: string;
  passed: boolean;
}

export interface GuardianReview {
  checks: GuardianCheckItem[];
  score: number;
  scoreLabel: string;
}

export interface MissionBriefingImpact {
  estimatedMonthlyVisitors: string;
  potentialLeads: string;
  estimatedRevenueImpact: string;
  hoursSaved: string;
  confidence: number;
}

/** @deprecated Use MissionBriefingImpact */
export interface MissionImpact {
  estimatedVisitors: string;
  estimatedEnquiries: string;
  confidence: number;
  managementTimeMinutes: number;
  visibilityIncrease: string;
  leadIncrease: string;
  businessImpact: MissionPriority;
}

export type MissionPreviewBlockType = "heading" | "subheading" | "paragraph" | "cta";

export interface MissionPreviewBlock {
  type: MissionPreviewBlockType;
  content: string;
}

export interface MissionPreview {
  title: string;
  blocks: MissionPreviewBlock[];
}

export interface Mission {
  id: string;
  title: string;
  missionType: MissionType;
  missionTypeLabel: string;
  priority: MissionPriority;
  priorityLabel: string;
  confidence: number;
  reviewTimeMinutes: number;
  description: string;
  whyCreated: string;
  expectedOutcome: string;
  workspaceStatus: MissionWorkspaceStatus;
  workspaceStatusLabel: string;
  estimatedCompletion: string;
  scout: ScoutReport;
  writer: WriterDraft;
  architect: ArchitectReview;
  guardian: GuardianReview;
  briefingImpact: MissionBriefingImpact;
  /** @deprecated Sprint 003 */
  impact: MissionImpact;
  /** @deprecated Sprint 003 */
  departments: DepartmentStatus[];
  /** @deprecated Sprint 003 */
  preview: MissionPreview;
  timeline: MissionTimelineEvent[];
  comments: MissionComment[];
  approvalMessage?: string;
  preparedByDepartments: string[];
}

export interface DepartmentSectionConfig {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
}
