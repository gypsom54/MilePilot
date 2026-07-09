/**
 * Mission Mode — immersive AI Business OS experience.
 */

export type PipelineEmployeeStatus = "working" | "complete" | "waiting" | "idle";

export interface PipelineEmployee {
  id: string;
  name: string;
  color: string;
  status: PipelineEmployeeStatus;
  activity: string;
  progress: number;
  detail?: string;
}

export interface LiveFeedEvent {
  id: string;
  time: string;
  message: string;
  employeeId?: string;
}

export interface AuraInsight {
  id: string;
  text: string;
}

export type MissionDocumentSectionId =
  | "research"
  | "outline"
  | "draft"
  | "images"
  | "faq"
  | "seo"
  | "internal-links"
  | "cta";

export interface MissionDocumentSection {
  id: MissionDocumentSectionId;
  title: string;
  content: string;
  items?: string[];
}

export interface MissionDocument {
  title: string;
  subtitle: string;
  sections: MissionDocumentSection[];
}

export interface MissionModeState {
  employees: PipelineEmployee[];
  feed: LiveFeedEvent[];
  auraInsight: AuraInsight;
  missionProgress: number;
  tick: number;
}

export type MissionModePhase = "entering" | "active" | "deploying" | "deployed";

export const MISSION_MODE_DEPLOYMENT_EMPLOYEES = [
  "scout",
  "writer",
  "guardian",
  "architect",
  "publisher",
] as const;
