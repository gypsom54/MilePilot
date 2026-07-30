/**
 * Sprint D4 — Personal Workspace daily briefing mock models.
 *
 * Typed placeholders for a calm “what should I do today?” experience.
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
  greeting: string;
  statusLines: DailyStatusLine[];
  priority: TodaysPriority;
  recentProgress: ProgressEvent[];
  contextualGuide: ContextualGuide;
}

/**
 * Personalised daily briefing for Harbour View Plumbing (mock).
 * Swap for live briefing adapters when opportunity / analysis engines are ready.
 */
export const MOCK_DAILY_BRIEFING: DailyBriefing = {
  greeting: "Good morning.",
  statusLines: [
    { id: "opportunity", text: "One new opportunity found" },
    { id: "analysis", text: "Analysis completed" },
    { id: "health", text: "Website looks healthy" },
    { id: "monitoring", text: "Monitoring continues" },
  ],
  priority: {
    id: "priority-faq-pages",
    title: "Add clear answers to common customer questions",
    whyItMatters:
      "People often search with questions before they choose a plumber. When your website answers those questions in plain English, visitors feel understood — and are more likely to get in touch.",
    estimatedEffort: "About 30–45 minutes",
    potentialImpact: "Helps the right people find and trust you sooner",
    ctaLabel: "Show me how",
    href: "/learn/what-is-seo",
  },
  recentProgress: [
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
      label: "Contact details verified",
      whenLabel: "Yesterday",
    },
    {
      id: "opportunities",
      label: "Opportunities prepared",
      whenLabel: "Yesterday",
    },
  ],
  contextualGuide: {
    id: "guide-faq-visibility",
    reason:
      "Because we noticed your website doesn’t currently answer common customer questions, here’s a short guide explaining how clearer pages improve visibility.",
    title: "What is SEO?",
    explanation:
      "A plain-English starting point for how search visibility works — useful before you add question-and-answer content.",
    href: "/learn/what-is-seo",
  },
};

/** Time-aware greeting; keeps “Good morning.” as the default daytime welcome. */
export function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) {
    return "Good morning.";
  }
  if (hour >= 12 && hour < 17) {
    return "Good afternoon.";
  }
  return "Good evening.";
}
