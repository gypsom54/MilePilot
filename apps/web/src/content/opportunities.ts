/**
 * Sprint D6 — Opportunity Engine mock models.
 *
 * Business decision opportunities — not an SEO audit checklist.
 * No numeric scores, grades, or live engine output.
 */

export type OpportunityCategoryId =
  | "content"
  | "technical-foundation"
  | "local-visibility"
  | "trust-reputation"
  | "customer-experience";

export type ImpactLevel = "high" | "medium" | "low";
export type EffortLevel = "low" | "medium" | "high";

/**
 * Qualitative prioritisation bands only — never numeric scores.
 */
export type PriorityBand =
  | "high-impact-low-effort"
  | "high-impact-medium-effort"
  | "medium-impact-low-effort"
  | "low-impact-high-effort";

export interface OpportunityCategory {
  id: OpportunityCategoryId;
  title: string;
  description: string;
}

export interface RelatedLearningGuide {
  title: string;
  href: string;
}

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  category: OpportunityCategoryId;
  whyThisMatters: string;
  estimatedEffort: string;
  potentialImpact: string;
  recommendedAction: string;
  relatedLearningGuide: RelatedLearningGuide;
  explanation: string;
  whyIdentified: string;
  expectedBenefit: string;
  steps: string[];
  showMeHowHref: string;
  impactLevel: ImpactLevel;
  effortLevel: EffortLevel;
}

export const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  {
    id: "content",
    title: "Content",
    description: "Clearer pages that help the right people understand what you offer.",
  },
  {
    id: "technical-foundation",
    title: "Technical Foundation",
    description: "Quiet improvements that keep your website reliable and easy to use.",
  },
  {
    id: "local-visibility",
    title: "Local Visibility",
    description: "Helping nearby customers find you when they need your services.",
  },
  {
    id: "trust-reputation",
    title: "Trust & Reputation",
    description: "Proof that helps customers feel confident choosing you.",
  },
  {
    id: "customer-experience",
    title: "Customer Experience",
    description: "Making it simple for visitors to enquire and take the next step.",
  },
];

export const PRIORITY_BAND_LABELS: Record<PriorityBand, string> = {
  "high-impact-low-effort": "High impact / Low effort",
  "high-impact-medium-effort": "High impact / Medium effort",
  "medium-impact-low-effort": "Medium impact / Low effort",
  "low-impact-high-effort": "Low impact / High effort",
};

export function resolvePriorityBand(
  impact: ImpactLevel,
  effort: EffortLevel,
): PriorityBand {
  if (impact === "high" && effort === "low") {
    return "high-impact-low-effort";
  }
  if (impact === "high") {
    return "high-impact-medium-effort";
  }
  if (impact === "medium" && effort === "low") {
    return "medium-impact-low-effort";
  }
  return "low-impact-high-effort";
}

const IMPACT_RANK: Record<ImpactLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const EFFORT_RANK: Record<EffortLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

/** Within a category: impact first, then easier effort. */
export function compareOpportunities(a: Opportunity, b: Opportunity): number {
  const impactDelta = IMPACT_RANK[a.impactLevel] - IMPACT_RANK[b.impactLevel];
  if (impactDelta !== 0) {
    return impactDelta;
  }
  return EFFORT_RANK[a.effortLevel] - EFFORT_RANK[b.effortLevel];
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-faq-content",
    slug: "answer-common-customer-questions",
    title: "Add clear answers to common customer questions",
    category: "content",
    whyThisMatters:
      "People often search with questions before they choose who to call. Clear answers help them trust you sooner.",
    estimatedEffort: "About 30–45 minutes",
    potentialImpact: "Helps the right people find and trust you sooner",
    recommendedAction: "Add a short question-and-answer section for your most common enquiries.",
    relatedLearningGuide: {
      title: "What is SEO?",
      href: "/learn/what-is-seo",
    },
    explanation:
      "A simple FAQ-style section on your website can answer the questions customers already ask — in everyday language.",
    whyIdentified:
      "Discovery noted that your site explains what you do, but does not yet answer the everyday questions visitors usually need before contacting a plumber.",
    expectedBenefit:
      "More visitors feel ready to enquire, and search engines can better understand the services you provide.",
    steps: [
      "List five questions customers ask you most often.",
      "Write short, plain-English answers.",
      "Add them to a clear page or homepage section.",
      "Include a simple way to call or enquire beside the answers.",
    ],
    showMeHowHref: "/learn/what-is-seo",
    impactLevel: "high",
    effortLevel: "low",
  },
  {
    id: "opp-service-pages",
    slug: "clearer-service-pages",
    title: "Make each key service easier to find",
    category: "content",
    whyThisMatters:
      "Separate pages for important services help the right people land in the right place.",
    estimatedEffort: "About 1–2 hours",
    potentialImpact: "Stronger clarity for your most valuable services",
    recommendedAction: "Create or improve one page for your most important service first.",
    relatedLearningGuide: {
      title: "How long does SEO normally take?",
      href: "/learn/how-long-does-seo-normally-take",
    },
    explanation:
      "When each main service has its own clear page, customers and search engines can understand your offer without guessing.",
    whyIdentified:
      "Your main offer is clear, but key services are not yet separated into easy-to-find pages.",
    expectedBenefit:
      "Visitors looking for a specific service can decide faster — and are more likely to contact you.",
    steps: [
      "Choose your most important service.",
      "Explain who it helps, what you do and what happens next.",
      "Add your service area in plain language.",
      "Include a clear call or enquiry path.",
    ],
    showMeHowHref: "/workspace",
    impactLevel: "high",
    effortLevel: "medium",
  },
  {
    id: "opp-mobile-clarity",
    slug: "easier-mobile-reading",
    title: "Make key pages easier to read on a phone",
    category: "technical-foundation",
    whyThisMatters:
      "Many customers will visit on a phone. If text feels cramped, they may leave before enquiring.",
    estimatedEffort: "About 45–90 minutes with your web person",
    potentialImpact: "Fewer frustrated visitors on mobile",
    recommendedAction: "Check your homepage and contact path on a phone and fix anything hard to tap or read.",
    relatedLearningGuide: {
      title: "Why does SEO take time?",
      href: "/learn/why-does-seo-take-time",
    },
    explanation:
      "A reliable, easy-to-use website is part of strong foundations. Mobile clarity is often the highest-value quiet fix.",
    whyIdentified:
      "Foundation checks suggest important content is present, but phone reading and tap targets could be calmer.",
    expectedBenefit:
      "Visitors stay longer and find it easier to contact you when they are out and about.",
    steps: [
      "Open your homepage on a phone.",
      "Check that headings and contact details are easy to read.",
      "Make sure buttons and phone links are easy to tap.",
      "Ask your web person to fix anything awkward.",
    ],
    showMeHowHref: "/ask",
    impactLevel: "medium",
    effortLevel: "low",
  },
  {
    id: "opp-local-areas",
    slug: "clarify-service-areas",
    title: "Spell out the areas you serve",
    category: "local-visibility",
    whyThisMatters:
      "Nearby customers want to know you cover their area before they call.",
    estimatedEffort: "About 20–30 minutes",
    potentialImpact: "Stronger local relevance and trust",
    recommendedAction: "Add a short, plain list of towns or areas you serve on your key pages.",
    relatedLearningGuide: {
      title: "What is local SEO?",
      href: "/learn/what-is-local-seo",
    },
    explanation:
      "Clear service-area wording helps local customers feel you are a good fit for them.",
    whyIdentified:
      "Your business profile includes Bristol and nearby areas, but the website could state those places more clearly.",
    expectedBenefit:
      "Local visitors feel more confident you can help them, which supports enquiries.",
    steps: [
      "Write the main areas you cover in everyday language.",
      "Add them to your homepage and contact page.",
      "Keep the list honest — only include places you truly serve.",
    ],
    showMeHowHref: "/learn/what-is-local-seo",
    impactLevel: "high",
    effortLevel: "low",
  },
  {
    id: "opp-maps-presence",
    slug: "strengthen-maps-presence",
    title: "Keep your Google Business Profile details accurate",
    category: "local-visibility",
    whyThisMatters:
      "Many local customers look on Maps before they decide who to contact.",
    estimatedEffort: "About 30–60 minutes",
    potentialImpact: "Better chance of being found by nearby customers",
    recommendedAction: "Check your name, address, phone number, hours and categories are accurate.",
    relatedLearningGuide: {
      title: "What is a Google Business Profile?",
      href: "/learn/what-is-a-google-business-profile",
    },
    explanation:
      "An accurate Business Profile helps people trust that you are real, open and nearby.",
    whyIdentified:
      "Local visibility benefits strongly from consistent, up-to-date business details.",
    expectedBenefit:
      "More nearby customers can find the right details and choose to contact you.",
    steps: [
      "Open your Google Business Profile.",
      "Confirm name, phone, hours and service area.",
      "Add a few clear photos of real work if you can.",
      "Reply calmly to any recent reviews.",
    ],
    showMeHowHref: "/learn/what-is-a-google-business-profile",
    impactLevel: "high",
    effortLevel: "medium",
  },
  {
    id: "opp-reviews",
    slug: "gather-recent-reviews",
    title: "Gather a few recent customer reviews",
    category: "trust-reputation",
    whyThisMatters:
      "Recent honest reviews help future customers decide whether they can trust you.",
    estimatedEffort: "About 15–30 minutes to ask a few customers",
    potentialImpact: "Stronger trust when people compare options",
    recommendedAction: "Ask a small number of happy recent customers for an honest Google review.",
    relatedLearningGuide: {
      title: "Why are customer reviews important?",
      href: "/learn/why-are-customer-reviews-important",
    },
    explanation:
      "A few genuine recent reviews are usually more useful than a long list of old ones.",
    whyIdentified:
      "Trust signals can be strengthened with fresher customer proof alongside your clear service offer.",
    expectedBenefit:
      "New visitors feel more confident contacting you.",
    steps: [
      "Choose three recent customers who were pleased with your work.",
      "Send a short, polite request for an honest review.",
      "Thank anyone who leaves feedback.",
      "Reply thoughtfully to each review.",
    ],
    showMeHowHref: "/learn/why-are-customer-reviews-important",
    impactLevel: "high",
    effortLevel: "low",
  },
  {
    id: "opp-review-replies",
    slug: "reply-to-reviews",
    title: "Reply calmly to every Google review",
    category: "trust-reputation",
    whyThisMatters:
      "Public replies show that you listen — including when feedback is mixed.",
    estimatedEffort: "About 10–20 minutes",
    potentialImpact: "Stronger impression of care and professionalism",
    recommendedAction: "Reply briefly and sincerely to each recent review.",
    relatedLearningGuide: {
      title: "Should I reply to every Google review?",
      href: "/learn/should-i-reply-to-every-google-review",
    },
    explanation:
      "A calm thank-you or professional response helps new customers judge how you treat people.",
    whyIdentified:
      "Reputation guidance works best when reviews are acknowledged, not left unanswered.",
    expectedBenefit:
      "Visitors see that a real business is listening.",
    steps: [
      "Open your recent Google reviews.",
      "Thank positive reviewers in your own words.",
      "Respond to concerns politely and helpfully.",
      "Keep replies short and sincere.",
    ],
    showMeHowHref: "/learn/should-i-reply-to-every-google-review",
    impactLevel: "medium",
    effortLevel: "low",
  },
  {
    id: "opp-contact-path",
    slug: "simpler-contact-path",
    title: "Make contacting you even simpler",
    category: "customer-experience",
    whyThisMatters:
      "If calling or enquiring takes effort, some ready customers will leave.",
    estimatedEffort: "About 20–40 minutes",
    potentialImpact: "More enquiries from people already interested",
    recommendedAction: "Put a clear phone number and enquiry path on every important page.",
    relatedLearningGuide: {
      title: "How will I know whether SEO is working?",
      href: "/learn/how-will-i-know-whether-seo-is-working",
    },
    explanation:
      "A visible, simple contact path reduces hesitation at the moment someone is ready to act.",
    whyIdentified:
      "Discovery highlighted contact clarity as a practical opportunity alongside stronger content.",
    expectedBenefit:
      "More visitors complete an enquiry instead of dropping away.",
    steps: [
      "Check that your phone number is visible on key pages.",
      "Make sure it is tappable on mobile.",
      "Add a short enquiry form or email option if useful.",
      "Test the path yourself on a phone.",
    ],
    showMeHowHref: "/workspace#website",
    impactLevel: "high",
    effortLevel: "low",
  },
  {
    id: "opp-heavy-redesign",
    slug: "full-site-refresh-later",
    title: "Consider a fuller website refresh later",
    category: "customer-experience",
    whyThisMatters:
      "A larger redesign can help eventually, but it is usually not the best first move.",
    estimatedEffort: "Several days or more with specialists",
    potentialImpact: "Possible long-term polish — lower urgency than clearer quick wins",
    recommendedAction: "Park a full redesign until higher-impact, lower-effort opportunities are done.",
    relatedLearningGuide: {
      title: "Will SEO AutoPilot tell me when nothing needs changing?",
      href: "/learn/will-seo-autopilot-tell-me-when-nothing-needs-changing",
    },
    explanation:
      "Not every idea needs action today. Larger refreshes are often better after the calm first priorities are complete.",
    whyIdentified:
      "Included to show honest prioritisation: high effort with lower near-term impact should wait.",
    expectedBenefit:
      "Protects your time and budget for the changes that help customers sooner.",
    steps: [
      "Complete the higher-impact opportunities first.",
      "Note any redesign ideas for a later review.",
      "Revisit only when the urgent clarity work is steady.",
    ],
    showMeHowHref: "/opportunities",
    impactLevel: "low",
    effortLevel: "high",
  },
];

export function getOpportunityBySlug(slug: string): Opportunity | undefined {
  return MOCK_OPPORTUNITIES.find((item) => item.slug === slug);
}

export function getOpportunitiesByCategory(
  categoryId: OpportunityCategoryId,
): Opportunity[] {
  return MOCK_OPPORTUNITIES.filter((item) => item.category === categoryId).sort(
    compareOpportunities,
  );
}

export function getGroupedOpportunities(): Array<{
  category: OpportunityCategory;
  opportunities: Opportunity[];
}> {
  return OPPORTUNITY_CATEGORIES.map((category) => ({
    category,
    opportunities: getOpportunitiesByCategory(category.id),
  })).filter((group) => group.opportunities.length > 0);
}

/** Highest-priority opportunities across all categories (impact first). */
export function getTopOpportunities(limit = 3): Opportunity[] {
  return [...MOCK_OPPORTUNITIES].sort(compareOpportunities).slice(0, limit);
}
