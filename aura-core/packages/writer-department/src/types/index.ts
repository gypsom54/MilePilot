/**
 * Writer Department — shared type definitions.
 * Architecture only. No AI, APIs, or databases.
 */

/** Unique identifier for department artefacts */
export type ArtefactId = string;

/** Unique identifier for a content brief */
export type BriefId = string;

/** Unique identifier for a draft */
export type DraftId = string;

/** Unique identifier for a review pass */
export type ReviewId = string;

/** Unique identifier for a revision request */
export type RevisionId = string;

/** Unique identifier for a report */
export type ReportId = string;

/** Module identifiers within the Writer Department */
export type WriterModuleId =
  | 'planner'
  | 'strategist'
  | 'copywriter'
  | 'editor'
  | 'seo-reviewer'
  | 'brand-reviewer'
  | 'readability-reviewer'
  | 'qa-reviewer';

/** Reviewer module identifiers */
export type ReviewerModuleId = Extract<
  WriterModuleId,
  'seo-reviewer' | 'brand-reviewer' | 'readability-reviewer' | 'qa-reviewer'
>;

/** Production module identifiers (non-reviewer) */
export type ProductionModuleId = Extract<
  WriterModuleId,
  'planner' | 'strategist' | 'copywriter' | 'editor'
>;

/** Draft lifecycle states */
export type DraftLifecycleState =
  | 'brief_received'
  | 'planned'
  | 'strategized'
  | 'drafted'
  | 'edited'
  | 'in_review'
  | 'revision_requested'
  | 'approved'
  | 'published'
  | 'archived';

/** Review pipeline stages */
export type ReviewStage =
  | 'seo'
  | 'brand'
  | 'readability'
  | 'qa';

/** Review outcome for a single reviewer pass */
export type ReviewOutcome = 'pass' | 'fail' | 'needs_revision';

/** Priority for revision requests */
export type RevisionPriority = 'low' | 'medium' | 'high' | 'critical';

/** Content format types */
export type ContentFormat =
  | 'article'
  | 'landing_page'
  | 'email'
  | 'notification'
  | 'social'
  | 'product_copy';

/** Audience segment */
export type AudienceSegment =
  | 'general'
  | 'business_owner'
  | 'developer'
  | 'enterprise'
  | 'internal';

/** Tone directive */
export type ToneDirective =
  | 'professional'
  | 'conversational'
  | 'authoritative'
  | 'friendly'
  | 'technical';

/** Quality dimension scores (0–100) */
export type QualityScore = number;

/** Business impact tier */
export type ImpactTier = 'low' | 'medium' | 'high' | 'strategic';
