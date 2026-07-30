/**
 * Sprint D3 — Website Discovery mock content and types.
 *
 * Shaped for future live analysis adapters (Business Discovery, Website
 * Intelligence, Crawl Intelligence). Values here are illustrative placeholders
 * only — not live engine output and not SEO scores.
 */

export type DiscoveryStageId =
  | "business"
  | "website"
  | "visibility"
  | "priorities";

export type DiscoveryStageStatus = "waiting" | "in_progress" | "done";

export interface DiscoveryStageDefinition {
  id: DiscoveryStageId;
  title: string;
  explanation: string;
}

export interface DiscoveryStrength {
  id: string;
  title: string;
  explanation: string;
}

export interface DiscoveryOpportunity {
  id: string;
  title: string;
  explanation: string;
}

export interface DiscoveryRecommendation {
  id: string;
  title: string;
  explanation: string;
  nextLabel: string;
  href: string;
}

export interface MockBusinessProfile {
  businessName: string;
  offering: string;
  location: string;
  websiteUrl: string;
}

export interface DiscoverySummary {
  strengths: DiscoveryStrength[];
  opportunities: DiscoveryOpportunity[];
  /** Hard cap: never more than three on the summary screen. */
  recommendations: DiscoveryRecommendation[];
}

export const DISCOVERY_STAGES: DiscoveryStageDefinition[] = [
  {
    id: "business",
    title: "Understanding your business",
    explanation:
      "We are reading what you offer, who you serve and where you operate — in plain language.",
  },
  {
    id: "website",
    title: "Reviewing your website",
    explanation:
      "We are checking that your site is clear, usable and ready to support growth.",
  },
  {
    id: "visibility",
    title: "Looking at how customers find you",
    explanation:
      "We are noting the simple ways people might discover you online today.",
  },
  {
    id: "priorities",
    title: "Preparing your first priorities",
    explanation:
      "We are choosing a small number of calm next steps — not a long issue list.",
  },
];

/** Placeholder profile until Sprint D2 onboarding is wired into this flow. */
export const MOCK_BUSINESS_PROFILE: MockBusinessProfile = {
  businessName: "Harbour View Plumbing",
  offering: "Reliable plumbing for homes and small businesses",
  location: "Bristol and nearby areas",
  websiteUrl: "https://example-harbour-view.example",
};

/**
 * Placeholder discovery summary. Replace with live analysis results when
 * Website Intelligence / Crawl Intelligence product adapters are ready.
 */
export const MOCK_DISCOVERY_SUMMARY: DiscoverySummary = {
  strengths: [
    {
      id: "clear-offer",
      title: "Your main service is easy to understand",
      explanation:
        "Visitors can quickly tell what you do. That clarity helps people trust you enough to get in touch.",
    },
    {
      id: "local-focus",
      title: "You are clear about where you work",
      explanation:
        "Showing the areas you serve helps nearby customers feel you are a good fit for them.",
    },
  ],
  opportunities: [
    {
      id: "service-pages",
      title: "Make each key service easier to find",
      explanation:
        "Separate pages for your most important services help the right people land in the right place.",
    },
    {
      id: "trust-signals",
      title: "Show more proof that customers can trust you",
      explanation:
        "Reviews, simple credentials and real photos of your work help people choose with confidence.",
    },
    {
      id: "contact-path",
      title: "Make contacting you even simpler",
      explanation:
        "A clear phone number and enquiry path on every important page reduces hesitation.",
    },
  ],
  recommendations: [
    {
      id: "rec-service-pages",
      title: "Start with one clearer service page",
      explanation:
        "Pick your most important service and explain it in everyday language: who it helps, what you do and how to enquire.",
      nextLabel: "Open Your Opportunities",
      href: "/workspace#opportunities",
    },
    {
      id: "rec-reviews",
      title: "Gather a few recent customer reviews",
      explanation:
        "Ask happy customers for honest Google reviews. A small number of genuine recent reviews is more useful than a long old list.",
      nextLabel: "Open Your Business",
      href: "/workspace#business",
    },
    {
      id: "rec-learn",
      title: "Learn how progress usually appears",
      explanation:
        "Before expecting overnight rankings, read a short guide on what early SEO progress can look like.",
      nextLabel: "Open the Learning Centre",
      href: "/learn/how-will-i-know-whether-seo-is-working",
    },
  ],
};

export function stageStatusLabel(status: DiscoveryStageStatus): string {
  switch (status) {
    case "waiting":
      return "Waiting";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
  }
}
