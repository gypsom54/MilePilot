import type {
  AskRankAuraAnswer,
  AskRankAuraData,
  AskRankAuraDataProvider,
  AskRankAuraQuestion,
} from "@/types/askRankAura";

/**
 * Deterministic Ask RankAura mock — local-business Workspace scenario.
 * No live AI. No demo-industry hard-coding in identity fields.
 */

const questions: AskRankAuraQuestion[] = [
  {
    id: "q-opportunity",
    text: "What is my biggest opportunity today?",
    intent: "current_priorities",
    matchPatterns: [
      "biggest opportunity",
      "strongest opportunity",
      "what should i focus on today",
    ],
  },
  {
    id: "q-completed",
    text: "What has RankAura completed since my last visit?",
    intent: "completed_work",
    matchPatterns: [
      "completed since",
      "what has rankaura completed",
      "since my last visit",
      "what changed since",
    ],
  },
  {
    id: "q-approvals",
    text: "Which recommendations are waiting for approval?",
    intent: "approvals",
    matchPatterns: [
      "waiting for approval",
      "need my approval",
      "recommendations awaiting",
      "approve",
    ],
  },
  {
    id: "q-competitors",
    text: "What have my competitors changed this week?",
    intent: "competitors",
    matchPatterns: [
      "competitors changed",
      "competitor",
      "what have my competitors",
    ],
  },
  {
    id: "q-customers-asking",
    text: "What questions are customers asking online?",
    intent: "reddit_community",
    matchPatterns: [
      "customers asking",
      "asking online",
      "reddit",
      "community",
      "customer questions",
    ],
  },
  {
    id: "q-urgent",
    text: "Is there anything urgent I need to know?",
    intent: "current_priorities",
    matchPatterns: ["urgent", "anything urgent", "do i need to know"],
  },
  {
    id: "q-content",
    text: "What content should I publish next?",
    intent: "content",
    matchPatterns: [
      "content should i publish",
      "publish next",
      "what should i publish",
    ],
  },
  {
    id: "q-local",
    text: "How can I improve my local visibility?",
    intent: "local_seo",
    matchPatterns: [
      "local visibility",
      "google maps",
      "local seo",
      "improve my local",
    ],
  },
  {
    id: "q-rankings",
    text: "Have my rankings improved?",
    intent: "analytics",
    matchPatterns: [
      "rankings improved",
      "have my rankings",
      "ranking changes",
      "are my rankings",
    ],
  },
];

const answersByQuestionId: Record<string, AskRankAuraAnswer> = {
  "q-opportunity": {
    questionId: "q-opportunity",
    questionText: "What is my biggest opportunity today?",
    intent: "current_priorities",
    directAnswer:
      "Your strongest opportunity today is helping more local customers discover your main service pages.",
    sections: [
      {
        kind: "found",
        title: "What we found",
        body: "Customers nearby are using several phrases your current pages only partially address.",
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’ve prepared updated headings, copy suggestions and internal-link recommendations.",
      },
      {
        kind: "next_step",
        title: "Your next step",
        body: "Review the proposed improvements when you’re ready.",
      },
    ],
    sources: [
      {
        type: "website_audit",
        availability: "confirmed",
        label: "Website audit",
        timestampLabel: "This morning",
      },
      {
        type: "keyword_research",
        availability: "confirmed",
        label: "Keyword research",
      },
      {
        type: "growth_plan",
        availability: "confirmed",
        label: "Growth Plan",
      },
    ],
    action: {
      kind: "review_fix",
      label: "Review & Fix",
      href: "/growth-plan?site=existing&expand=website_health",
    },
  },
  "q-completed": {
    questionId: "q-completed",
    questionText: "What has RankAura completed since my last visit?",
    intent: "completed_work",
    directAnswer:
      "RankAura completed four meaningful pieces of work since your last visit.",
    sections: [
      {
        kind: "found",
        title: "What we completed",
        body: "Here’s the work that’s already done for your business:",
        items: [
          "Prepared recommendations for key service pages",
          "Completed community research",
          "Updated competitor insights",
          "Drafted two content outlines",
        ],
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’re continuing to monitor your website and competitors quietly — nothing further is required from you right now.",
      },
    ],
    sources: [
      {
        type: "recent_activity",
        availability: "confirmed",
        label: "Recent activity",
        timestampLabel: "Since your last visit",
      },
    ],
  },
  "q-approvals": {
    questionId: "q-approvals",
    questionText: "Which recommendations are waiting for approval?",
    intent: "approvals",
    directAnswer:
      "Website recommendations for your main service pages are ready for your approval.",
    sections: [
      {
        kind: "found",
        title: "What we found",
        body: "The proposed updates focus on clearer headings and copy aligned with how nearby customers already search.",
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’ve prepared the safest changes first so you can review them calmly.",
      },
      {
        kind: "next_step",
        title: "Your next step",
        body: "Review the recommendations when you’re ready — nothing will change until you approve.",
      },
    ],
    sources: [
      {
        type: "website_audit",
        availability: "confirmed",
        label: "Website audit",
      },
      {
        type: "growth_plan",
        availability: "confirmed",
        label: "Growth Plan",
      },
    ],
    action: {
      kind: "approve_changes",
      label: "Review Recommendations",
      href: "/growth-plan?site=existing&expand=website_health",
    },
  },
  "q-competitors": {
    questionId: "q-competitors",
    questionText: "What have my competitors changed this week?",
    intent: "competitors",
    directAnswer:
      "We’ve recorded three nearby competitor changes worth noticing this week.",
    sections: [
      {
        kind: "found",
        title: "What we found",
        body: "A nearby competitor launched a new service, and two others refreshed key service pages.",
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’ve updated your competitor insights and identified calm ways your business could respond.",
      },
    ],
    sources: [
      {
        type: "competitor_monitoring",
        availability: "confirmed",
        label: "Competitor monitoring",
        timestampLabel: "This week",
      },
    ],
    action: {
      kind: "open_strategy",
      label: "Open Strategy",
      href: "/growth-plan?site=existing&expand=competitor_intelligence",
    },
  },
  "q-customers-asking": {
    questionId: "q-customers-asking",
    questionText: "What questions are customers asking online?",
    intent: "reddit_community",
    directAnswer:
      "Customers are asking practical questions about what to expect before getting in touch with a business like yours.",
    sections: [
      {
        kind: "found",
        title: "What we found",
        body: "Recurring themes include timing, what happens in a first conversation, and how to know if a service is a good fit — drawn from public discussions, not copied posts.",
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’ve finished community research and drafted content outlines that answer these questions in your own words.",
      },
      {
        kind: "next_step",
        title: "Your next step",
        body: "Review the research when you’d like to see the exact themes.",
      },
    ],
    sources: [
      {
        type: "reddit_community_research",
        availability: "confirmed",
        label: "Reddit & community research",
        timestampLabel: "Yesterday afternoon",
      },
      {
        type: "content_plan",
        availability: "confirmed",
        label: "Content plan",
      },
    ],
    action: {
      kind: "view_research",
      label: "View Research",
      href: "/growth-plan?site=existing&expand=reddit_community",
    },
  },
  "q-urgent": {
    questionId: "q-urgent",
    questionText: "Is there anything urgent I need to know?",
    intent: "current_priorities",
    directAnswer: "Nothing urgent needs your attention today.",
    sections: [
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’re continuing to monitor your website, competitors and local visibility.",
      },
    ],
    sources: [
      {
        type: "recent_activity",
        availability: "confirmed",
        label: "Recent activity",
      },
      {
        type: "competitor_monitoring",
        availability: "confirmed",
        label: "Competitor monitoring",
      },
      {
        type: "website_audit",
        availability: "confirmed",
        label: "Website audit",
      },
    ],
  },
  "q-content": {
    questionId: "q-content",
    questionText: "What content should I publish next?",
    intent: "content",
    directAnswer:
      "A short FAQ that answers the three questions people ask most before contacting a business like yours.",
    sections: [
      {
        kind: "found",
        title: "What we found",
        body: "Community research shows people want clarity on timing, first contact, and whether the service is a good fit.",
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’ve drafted two content outlines from those customer questions — ready for your review.",
      },
      {
        kind: "next_step",
        title: "Your next step",
        body: "View the outlines when you’re ready. Nothing will publish without your approval.",
      },
    ],
    sources: [
      {
        type: "content_plan",
        availability: "confirmed",
        label: "Content plan",
      },
      {
        type: "reddit_community_research",
        availability: "confirmed",
        label: "Reddit & community research",
      },
    ],
    action: {
      kind: "view_progress",
      label: "View Progress",
      href: "/growth-plan?site=existing&expand=content_strategy",
    },
  },
  "q-local": {
    questionId: "q-local",
    questionText: "How can I improve my local visibility?",
    intent: "local_seo",
    directAnswer:
      "Your strongest local step is keeping business details consistent and finishing the citation checks we’ve started.",
    sections: [
      {
        kind: "found",
        title: "What we found",
        body: "Eight local citations are now consistent. A few remaining listings still need the same details.",
      },
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "We’ve verified listings and prepared a calm local strategy from your Growth Plan.",
      },
      {
        kind: "next_step",
        title: "Your next step",
        body: "Open the local strategy when you’d like to see the remaining recommendations.",
      },
    ],
    sources: [
      {
        type: "citation_monitoring",
        availability: "confirmed",
        label: "Citation monitoring",
      },
      {
        type: "google_business_profile",
        availability: "confirmed",
        label: "Google Business Profile",
      },
      {
        type: "growth_plan",
        availability: "confirmed",
        label: "Growth Plan",
      },
    ],
    action: {
      kind: "open_strategy",
      label: "Open Strategy",
      href: "/growth-plan?site=existing&expand=local_seo",
    },
  },
  "q-rankings": {
    questionId: "q-rankings",
    questionText: "Have my rankings improved?",
    intent: "analytics",
    directAnswer:
      "Google Search Console is not connected yet, so I can’t confirm whether your rankings have improved.",
    sections: [
      {
        kind: "doing",
        title: "What RankAura is doing",
        body: "Once connected, I’ll monitor meaningful changes and explain them in plain English.",
      },
    ],
    sources: [
      {
        type: "google_search_console",
        availability: "unavailable",
        label: "Google Search Console",
      },
    ],
    availabilityNotice:
      "This data source is not connected yet. Connect Search Console so I can analyse which searches are bringing people to your website.",
    action: {
      kind: "connect_data_source",
      label: "Connect Search Console",
      href: "/growth-plan?site=existing",
    },
  },
};

const fallbackAnswer: AskRankAuraAnswer = {
  questionId: "q-fallback",
  questionText: "",
  intent: "unsupported",
  directAnswer:
    "I can help with questions about your website, competitors, content, local visibility and RankAura’s recent work. This prototype does not yet have data for that question.",
  sections: [
    {
      kind: "doing",
      title: "What RankAura is doing",
      body: "Try one of the suggested questions, or ask about opportunities, completed work, approvals, competitors or customer research.",
    },
  ],
  sources: [
    {
      type: "user_business_info",
      availability: "incomplete",
      label: "Prototype question set",
    },
  ],
  availabilityNotice:
    "I don’t have a grounded answer for that question in this prototype yet.",
};

export const mockAskRankAuraData: AskRankAuraData = {
  card: {
    heading: "Ask RankAura",
    support: "Ask anything about your business growth.",
    placeholder: "Ask about your business…",
  },
  suggestedQuestions: [
    {
      id: "q-opportunity",
      text: "What is my biggest opportunity today?",
      intent: "current_priorities",
    },
    {
      id: "q-completed",
      text: "What has RankAura completed since my last visit?",
      intent: "completed_work",
    },
    {
      id: "q-approvals",
      text: "Which recommendations need my approval?",
      intent: "approvals",
    },
    {
      id: "q-competitors",
      text: "What have my competitors changed this week?",
      intent: "competitors",
    },
  ],
  questions,
  answersByQuestionId,
  fallbackAnswer,
};

function normalise(text: string): string {
  return text.trim().toLowerCase().replace(/[?!.,'’]/g, " ").replace(/\s+/g, " ");
}

export function resolveAskRankAuraQuestion(
  text: string,
  data: AskRankAuraData = mockAskRankAuraData,
): AskRankAuraAnswer {
  const normalised = normalise(text);
  if (!normalised) {
    return {
      ...data.fallbackAnswer,
      questionText: text,
      directAnswer: "Ask a question about your business growth to get started.",
    };
  }

  for (const question of data.questions) {
    const candidates = [
      question.text,
      ...(question.matchPatterns ?? []),
    ].map(normalise);

    const matched = candidates.some(
      (pattern) =>
        normalised === pattern ||
        normalised.includes(pattern) ||
        pattern.includes(normalised),
    );

    if (matched) {
      const answer = data.answersByQuestionId[question.id];
      if (answer) {
        return {
          ...answer,
          questionText: text.trim() || answer.questionText,
        };
      }
    }
  }

  return {
    ...data.fallbackAnswer,
    questionText: text.trim(),
  };
}

export const mockAskRankAuraProvider: AskRankAuraDataProvider = {
  getAskRankAuraData(): AskRankAuraData {
    return mockAskRankAuraData;
  },
  resolveQuestion(text: string): AskRankAuraAnswer {
    return resolveAskRankAuraQuestion(text, mockAskRankAuraData);
  },
};
