export const DRAFT_LIFECYCLE_CONFIG = {
  stages: [
    "briefed",
    "planned",
    "strategised",
    "drafted",
    "edited",
    "in_review",
    "revision_requested",
    "approved",
    "archived",
  ] as const,
} as const;

export type DraftLifecycleStage = (typeof DRAFT_LIFECYCLE_CONFIG.stages)[number];

export const DRAFT_TRANSITIONS: Record<DraftLifecycleStage, DraftLifecycleStage[]> = {
  briefed: ["planned", "archived"],
  planned: ["strategised", "archived"],
  strategised: ["drafted", "archived"],
  drafted: ["edited", "archived"],
  edited: ["in_review", "archived"],
  in_review: ["revision_requested", "approved", "archived"],
  revision_requested: ["drafted", "archived"],
  approved: ["archived"],
  archived: [],
};
