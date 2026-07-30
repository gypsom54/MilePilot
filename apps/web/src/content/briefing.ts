/**
 * Sprint D4 — Personal Workspace daily briefing mock models.
 *
 * Typed placeholders for a calm Business Briefing experience.
 * Not live engine output. No SEO scores or technical metrics.
 */

export interface DailyStatusLine {
  id: string;
  text: string;
}

export interface TodaysPriority {
  id: string;
  title: string;
  whyItMatters: string;
  estimatedEffort: string;
  potentialImpact: string;
  /** Primary CTA label is fixed for Sprint D4. */
  ctaLabel: "Show me how";
  href: string;
}

export interface ProgressEvent {
  id: string;
  label: string;
  whenLabel: string;
}

export interface ContextualGuide {
  id: string;
  reason: string;
  title: string;
  explanation: string;
  href: string;
}

export interface DailyBriefing {
  /** Spec heading for Sprint D4 mock: "Good morning." */
  greeting: string;
  statusLines: DailyStatusLine[];
  /**
   * Exactly one featured recommendation, or null when nothing needs attention.
   * Never an array of primary actions.
   */
  priority: TodaysPriority | null;
  /** Shown when priority is null. */
  allClearMessage: string;
  recentProgress: ProgressEvent[];
  /** Present only when there is a priority to learn about. */
  contextualGuide: ContextualGuide | null;
}

const SHARED_PROGRESS: ProgressEvent[] = [
  {
    id: "analysed",
    label: "Website analysed",
    whenLabel: "This morning",
  },
  {
    id: "sitemap",
    label: "Sitemap discovered",
    whenLabel: "This morning",
  },
  {
    id: "contact",
    label: "Contact information verified",
    whenLabel: "Yesterday",
  },
  {
    id: "service-pages",
    label: "Service pages identified",
    whenLabel: "Yesterday",
  },
  {
    id: "opportunities",
    label: "Opportunities prepared",
    whenLabel: "Yesterday",
  },
];

/**
 * Default personalised briefing (one opportunity).
 * Swap for live briefing adapters when opportunity / analysis engines are ready.
 */
export const MOCK_DAILY_BRIEFING: DailyBriefing = {
  greeting: "Good morning.",
  statusLines: [
    {
      id: "analysis",
      text: "We've finished analysing your website.",
    },
    {
      id: "opportunity",
      text: "We've identified one new opportunity.",
    },
    {
      id: "health",
      text: "Everything is looking healthy today.",
    },
    {
      id: "monitoring",
      text: "We're continuing to monitor your website.",
    },
  ],
  priority: {
    id: "priority-faq-pages",
    title: "Add clear answers to common customer questions",
    whyItMatters:
      "People often search with questions before they choose who to call. When your website answers those questions in plain English, visitors feel understood — and are more likely to get in touch.",
    estimatedEffort: "About 30–45 minutes",
    potentialImpact: "Helps the right people find and trust you sooner",
    ctaLabel: "Show me how",
    href: "/learn/what-is-seo",
  },
  allClearMessage:
    "Everything looks good today. We'll continue monitoring your website and let you know if anything important changes.",
  recentProgress: SHARED_PROGRESS,
  contextualGuide: {
    id: "guide-faq-visibility",
    reason:
      "Because your website doesn't currently answer common customer questions, we've selected this short guide explaining how clearer question-and-answer pages improve visibility.",
    title: "How clear answers help customers find you",
    explanation:
      "A calm introduction to how search visibility works — useful before you add FAQ-style content to your site.",
    href: "/learn/what-is-seo",
  },
};

/**
 * Alternate mock: quiet day with no primary recommendation.
 * Available for future adapters / demos; not the default Workspace view.
 */
export const MOCK_DAILY_BRIEFING_ALL_CLEAR: DailyBriefing = {
  greeting: "Good morning.",
  statusLines: [
    {
      id: "health",
      text: "Everything is looking healthy today.",
    },
    {
      id: "monitoring",
      text: "We're continuing to monitor your website.",
    },
  ],
  priority: null,
  allClearMessage:
    "Everything looks good today. We'll continue monitoring your website and let you know if anything important changes.",
  recentProgress: SHARED_PROGRESS,
  contextualGuide: null,
};
