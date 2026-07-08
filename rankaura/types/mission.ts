/**
 * Mission Workspace types — Aurora Sprint 003.
 */

export type MissionWorkspaceStatus =
  | "in_review"
  | "approved"
  | "pending"
  | "revision_requested"
  | "saved_for_later";

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

export type MissionPreviewBlockType = "heading" | "subheading" | "paragraph" | "cta";

export interface MissionPreviewBlock {
  type: MissionPreviewBlockType;
  content: string;
}

export interface MissionPreview {
  title: string;
  blocks: MissionPreviewBlock[];
}

export interface MissionImpact {
  estimatedVisitors: string;
  estimatedEnquiries: string;
  confidence: number;
  managementTimeMinutes: number;
  visibilityIncrease: string;
  leadIncrease: string;
  businessImpact: "high" | "medium" | "low";
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  whyCreated: string;
  expectedOutcome: string;
  workspaceStatus: MissionWorkspaceStatus;
  workspaceStatusLabel: string;
  estimatedCompletion: string;
  impact: MissionImpact;
  departments: DepartmentStatus[];
  preview: MissionPreview;
  timeline: MissionTimelineEvent[];
  comments: MissionComment[];
  approvalMessage?: string;
}
