/**
 * Ask RankAura domain types — Phase B prototype.
 * Spec: docs/ASK_RANKAURA_SPEC.md
 */

export type AskRankAuraIntent =
  | "current_priorities"
  | "completed_work"
  | "approvals"
  | "website_optimisation"
  | "keywords"
  | "competitors"
  | "content"
  | "reddit_community"
  | "local_seo"
  | "reviews_reputation"
  | "authority_backlinks"
  | "digital_pr"
  | "social_media"
  | "analytics"
  | "business_intelligence"
  | "unsupported";

export type AskRankAuraSourceType =
  | "website_audit"
  | "keyword_research"
  | "competitor_monitoring"
  | "google_search_console"
  | "google_analytics"
  | "google_business_profile"
  | "review_monitoring"
  | "citation_monitoring"
  | "reddit_community_research"
  | "rank_tracking"
  | "content_plan"
  | "growth_plan"
  | "recent_activity"
  | "user_business_info";

export type AskRankAuraDataAvailability =
  | "confirmed"
  | "inferred"
  | "incomplete"
  | "unavailable";

export type AskRankAuraAnswerSectionKind =
  | "direct"
  | "found"
  | "doing"
  | "next_step";

export type AskRankAuraActionKind =
  | "view_recommendation"
  | "review_fix"
  | "view_growth_plan"
  | "view_research"
  | "open_strategy"
  | "view_progress"
  | "approve_changes"
  | "connect_data_source";

export interface AskRankAuraQuestion {
  id: string;
  text: string;
  intent: AskRankAuraIntent;
  /** Alternate phrasings that resolve to this question */
  matchPatterns?: string[];
}

export interface AskRankAuraAnswerSection {
  kind: AskRankAuraAnswerSectionKind;
  title: string;
  body: string;
  /** Optional bullet list for completed-work style answers */
  items?: string[];
}

export interface AskRankAuraSource {
  type: AskRankAuraSourceType;
  availability: AskRankAuraDataAvailability;
  /** Plain-English source label for internal grounding / optional customer notice */
  label: string;
  timestampLabel?: string;
  relatedEntity?: string;
}

export interface AskRankAuraAction {
  kind: AskRankAuraActionKind;
  label: string;
  href?: string;
}

export interface AskRankAuraAnswer {
  questionId: string;
  questionText: string;
  intent: AskRankAuraIntent;
  directAnswer: string;
  sections: AskRankAuraAnswerSection[];
  sources: AskRankAuraSource[];
  action?: AskRankAuraAction;
  /** Human notice when availability is incomplete/unavailable */
  availabilityNotice?: string;
}

export interface AskRankAuraSuggestedQuestion {
  id: string;
  text: string;
  intent: AskRankAuraIntent;
}

export interface AskRankAuraCardCopy {
  heading: string;
  support: string;
  placeholder: string;
}

export interface AskRankAuraData {
  card: AskRankAuraCardCopy;
  suggestedQuestions: AskRankAuraSuggestedQuestion[];
  questions: AskRankAuraQuestion[];
  answersByQuestionId: Record<string, AskRankAuraAnswer>;
  fallbackAnswer: AskRankAuraAnswer;
}

export interface AskRankAuraDataProvider {
  getAskRankAuraData(): Promise<AskRankAuraData> | AskRankAuraData;
  resolveQuestion(text: string): AskRankAuraAnswer;
}

export const ANSWER_SECTION_TITLES: Record<AskRankAuraAnswerSectionKind, string> =
  {
    direct: "Direct answer",
    found: "What we found",
    doing: "What RankAura is doing",
    next_step: "Your next step",
  };

export const DATA_AVAILABILITY_LABELS: Record<
  AskRankAuraDataAvailability,
  string
> = {
  confirmed: "Confirmed",
  inferred: "Based on current research",
  incomplete: "Early signal",
  unavailable: "Not connected yet",
};
