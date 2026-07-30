/**
 * Sprint D5 — Ask SEO AutoPilot mock conversation models.
 *
 * Customer-facing mock assistant only. No LLM, no orchestration engine,
 * no external APIs. Responses are typed fixtures grounded in mock profile
 * and discovery summary data.
 */

export interface AskSuggestedQuestion {
  id: string;
  label: string;
  /** Stable key used to resolve a mock response. */
  intentId: AskIntentId;
}

export type AskIntentId =
  | "improve-homepage"
  | "work-on-next"
  | "explain-priority"
  | "faq-pages"
  | "biggest-opportunity"
  | "learned-about-business"
  | "fallback";

export interface AskLinkAction {
  label: string;
  href: string;
}

export interface AskStructuredAnswer {
  answer: string;
  whyItMatters: string;
  recommendedNextStep: AskLinkAction;
  learnMore: AskLinkAction;
}

export interface AskTurn {
  id: string;
  question: string;
  intentId: AskIntentId;
  response: AskStructuredAnswer;
}

export const ASK_SUGGESTED_QUESTIONS: AskSuggestedQuestion[] = [
  {
    id: "q-homepage",
    label: "How can I improve my homepage?",
    intentId: "improve-homepage",
  },
  {
    id: "q-next",
    label: "What should I work on next?",
    intentId: "work-on-next",
  },
  {
    id: "q-priority",
    label: "Explain today's priority.",
    intentId: "explain-priority",
  },
  {
    id: "q-faq",
    label: "How do FAQ pages help?",
    intentId: "faq-pages",
  },
  {
    id: "q-opportunity",
    label: "Show my biggest opportunity.",
    intentId: "biggest-opportunity",
  },
  {
    id: "q-learned",
    label: "What have you learned about my business?",
    intentId: "learned-about-business",
  },
];
