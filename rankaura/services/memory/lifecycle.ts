/**
 * Memory lifecycle stages.
 * Governs how memory moves from creation to archival.
 */

export type MemoryLifecycleStage =
  | "draft"
  | "active"
  | "validated"
  | "archived";

export interface MemoryLifecycleState {
  businessId: string;
  stage: MemoryLifecycleStage;
  version: number;
  lastEventAt: string;
}

export const MEMORY_LIFECYCLE: Record<MemoryLifecycleStage, string> = {
  draft: "Initial memory captured, not yet validated",
  active: "In use by AI employees via read access",
  validated: "Confidence threshold met, trusted for decisions",
  archived: "Retained for history but no longer active",
};

/**
 * Lifecycle transitions — enforced by AuraCore in future phases.
 */
export const MEMORY_LIFECYCLE_TRANSITIONS: Record<MemoryLifecycleStage, MemoryLifecycleStage[]> = {
  draft: ["active", "archived"],
  active: ["validated", "archived"],
  validated: ["active", "archived"],
  archived: [],
};
