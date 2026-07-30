import { MOCK_DAILY_BRIEFING } from "../content/briefing";
import type { AskIntentId, AskStructuredAnswer } from "../content/ask";
import {
  MOCK_BUSINESS_PROFILE,
  MOCK_DISCOVERY_SUMMARY,
  type DiscoverySummary,
  type MockBusinessProfile,
} from "../content/discovery";

export type AskResponseContext = {
  profile: MockBusinessProfile;
  summary: DiscoverySummary;
};

const DEFAULT_CONTEXT: AskResponseContext = {
  profile: MOCK_BUSINESS_PROFILE,
  summary: MOCK_DISCOVERY_SUMMARY,
};

/**
 * Mock Ask layer — resolves a structured answer from local fixtures.
 * Replace later with Volume 3 orchestration when explicitly unlocked for live engines.
 */
export function resolveMockAskAnswer(
  intentId: AskIntentId,
  context: AskResponseContext = DEFAULT_CONTEXT,
): AskStructuredAnswer {
  const { profile, summary } = context;
  const topOpportunity = summary.opportunities[0];
  const topStrength = summary.strengths[0];
  const priority = MOCK_DAILY_BRIEFING.priority;

  switch (intentId) {
    case "improve-homepage":
      return {
        answer: `For ${profile.businessName}, the homepage works best when a visitor can quickly see what you offer, where you work and how to get in touch. Right now your offer — ${profile.offering} — is clear. The next improvement is making common customer questions easy to find near the top of the page.`,
        whyItMatters:
          "Most people decide in seconds whether a website feels relevant. A clearer homepage helps the right customers stay and enquire, instead of leaving to compare other businesses.",
        recommendedNextStep: {
          label: "Review today's priority",
          href: "/workspace",
        },
        learnMore: {
          label: "What is SEO?",
          href: "/learn/what-is-seo",
        },
      };

    case "work-on-next":
      return {
        answer: priority
          ? `The calm next step is: ${priority.title}. ${priority.whyItMatters}`
          : `Everything looks steady for ${profile.businessName} today. Keep monitoring, and focus on protecting what already works — especially ${topStrength?.title ?? "your clearest strengths"}.`,
        whyItMatters:
          "Doing one important thing well is more useful than juggling a long list of technical tasks. A single next step keeps progress steady and reassuring.",
        recommendedNextStep: {
          label: "Open your workspace",
          href: "/workspace",
        },
        learnMore: {
          label: "How will I know whether SEO is working?",
          href: "/learn/how-will-i-know-whether-seo-is-working",
        },
      };

    case "explain-priority":
      return {
        answer: priority
          ? `Today's priority is “${priority.title}”. Estimated effort: ${priority.estimatedEffort}. Potential impact: ${priority.potentialImpact}.`
          : `There is no urgent priority today for ${profile.businessName}. We'll keep watching and tell you if something important changes.`,
        whyItMatters: priority
          ? priority.whyItMatters
          : "Quiet days are valid. Knowing that nothing needs changing can be the most reassuring update of all.",
        recommendedNextStep: {
          label: priority ? "Show me how" : "Open your workspace",
          href: priority?.href ?? "/workspace",
        },
        learnMore: {
          label: "Will SEO AutoPilot tell me when nothing needs changing?",
          href: "/learn/will-seo-autopilot-tell-me-when-nothing-needs-changing",
        },
      };

    case "faq-pages":
      return {
        answer:
          "FAQ-style pages answer the questions customers already ask — in everyday language. For a local service business, that might include response times, areas covered, or what happens on a first visit. Clear answers help people feel ready to contact you.",
        whyItMatters:
          "When your website answers real questions, visitors trust you sooner and search engines can better understand what you help with.",
        recommendedNextStep: {
          label: "See today's priority",
          href: "/workspace",
        },
        learnMore: {
          label: "How clear answers help customers find you",
          href: "/learn/what-is-seo",
        },
      };

    case "biggest-opportunity":
      return {
        answer: topOpportunity
          ? `Your biggest opportunity right now is: ${topOpportunity.title}. ${topOpportunity.explanation}`
          : `We have not prepared a top opportunity yet for ${profile.businessName}. Complete website discovery to unlock a calm first shortlist.`,
        whyItMatters:
          "Focusing on the largest useful opportunity prevents busywork and keeps your time on the change most likely to help customers choose you.",
        recommendedNextStep: {
          label: "View your opportunities",
          href: "/workspace#opportunities",
        },
        learnMore: {
          label: "What will SEO AutoPilot do for my business?",
          href: "/learn/what-will-seo-autopilot-do-for-my-business",
        },
      };

    case "learned-about-business":
      return {
        answer: `So far, we understand ${profile.businessName} as a business offering ${profile.offering.toLowerCase()}, serving ${profile.location}. Your website is recorded as ${profile.websiteUrl}. ${topStrength ? `A clear strength is: ${topStrength.title}.` : ""}`,
        whyItMatters:
          "Good advice starts with understanding who you help. When the business profile is clear, recommendations stay relevant instead of generic.",
        recommendedNextStep: {
          label: "Review your business profile",
          href: "/workspace#business",
        },
        learnMore: {
          label: "Will I need to understand SEO?",
          href: "/learn/will-i-need-to-understand-seo",
        },
      };

    case "fallback":
    default:
      return {
        answer: `I can help with questions about ${profile.businessName}, your website, today's priority and your main opportunities. Try one of the suggested questions for the clearest answer.`,
        whyItMatters:
          "Short, focused questions get clearer guidance. Suggested questions are based on what we already know about your business.",
        recommendedNextStep: {
          label: "Browse suggested questions",
          href: "/ask",
        },
        learnMore: {
          label: "Open the Learning Centre",
          href: "/learn",
        },
      };
  }
}

export function matchAskIntent(question: string): AskIntentId {
  const normalised = question.trim().toLowerCase();

  if (!normalised) {
    return "fallback";
  }

  if (normalised.includes("homepage") || normalised.includes("home page")) {
    return "improve-homepage";
  }
  if (normalised.includes("work on next") || normalised.includes("what should i")) {
    return "work-on-next";
  }
  if (normalised.includes("today") && normalised.includes("priority")) {
    return "explain-priority";
  }
  if (normalised.includes("faq")) {
    return "faq-pages";
  }
  if (normalised.includes("biggest opportunity") || normalised.includes("opportunity")) {
    return "biggest-opportunity";
  }
  if (
    normalised.includes("learned") ||
    normalised.includes("about my business") ||
    normalised.includes("know about my")
  ) {
    return "learned-about-business";
  }

  return "fallback";
}
