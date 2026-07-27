import type { WorkspaceData } from "@/types/workspace";

/**
 * Deterministic Workspace mock — no demo business identity hard-coded.
 * Identity is personalised from onboarding session when available.
 */
export const mockWorkspaceData: WorkspaceData = {
  welcome: {
    firstName: "",
    businessName: "Your business",
    greeting: "Good morning.",
    support: "RankAura has been working on your business.",
    activitySummary:
      "Since you were last here, we’ve prepared safe website recommendations and finished fresh community research.",
  },
  biggestOpportunity: {
    title: "Your service pages could better match how customers search.",
    support:
      "We’ve prepared a calm set of improvements that could help more people discover your business.",
    actionLabel: "Review & Fix",
    href: "/growth-plan?site=existing&expand=website_health",
  },
  sinceLastVisit: [
    {
      id: "a1",
      text: "Prepared heading and copy recommendations for your key service pages.",
      completedAtLabel: "This morning",
    },
    {
      id: "a2",
      text: "Finished community research on questions customers ask before getting in touch.",
      completedAtLabel: "Yesterday",
    },
    {
      id: "a3",
      text: "Updated your competitor map with three nearby changes worth noticing.",
      completedAtLabel: "Yesterday",
    },
    {
      id: "a4",
      text: "Drafted the first two content outlines from your priority questions.",
      completedAtLabel: "2 days ago",
    },
  ],
  growthAreas: [
    {
      id: "website_health",
      name: "Website Optimisation",
      subtitle: "Helping search engines better understand your website.",
      statusLabel: "Awaiting your approval",
      impact: "Could help more customers discover your business.",
      href: "/growth-plan?site=existing&expand=website_health",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      subtitle: "Helping nearby customers discover your business.",
      statusLabel: "Recommendations prepared",
      impact: "Could increase enquiries from nearby customers.",
      href: "/growth-plan?site=existing&expand=local_seo",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      subtitle: "Creating content your customers are already searching for.",
      statusLabel: "Recommendations prepared",
      impact: "Answers questions your future customers are already asking.",
      href: "/growth-plan?site=existing&expand=content_strategy",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      subtitle: "Learning from the conversations your customers are already having.",
      statusLabel: "Research completed",
      impact: "Surfaces the real language people use before they choose a business.",
      href: "/growth-plan?site=existing&expand=reddit_community",
    },
  ],
  businessFeed: [
    {
      id: "f1",
      type: "opportunity",
      title: "New opportunity on your service pages",
      body: "We’ve prepared recommendations that could help your pages match the phrases customers already search for.",
      timestampLabel: "Today · 8:14 am",
    },
    {
      id: "f2",
      type: "research",
      title: "Community research completed",
      body: "We captured recurring customer questions and buying concerns from public discussions — original insights, not copied posts.",
      timestampLabel: "Yesterday · 4:32 pm",
    },
    {
      id: "f3",
      type: "competitor",
      title: "Competitor update nearby",
      body: "A nearby competitor published a clearer services page. We’ve noted the gap and how you can respond calmly.",
      timestampLabel: "Yesterday · 11:05 am",
    },
    {
      id: "f4",
      type: "content",
      title: "Content idea ready for review",
      body: "A short FAQ outline answers the three questions people ask most before contacting a business like yours.",
      timestampLabel: "2 days ago",
    },
    {
      id: "f5",
      type: "monitoring",
      title: "Quiet monitoring check",
      body: "No urgent changes. RankAura continues watching rankings, reviews, and competitor movement in the background.",
      timestampLabel: "2 days ago",
    },
  ],
};

export const mockWorkspaceProvider = {
  getWorkspaceData(): WorkspaceData {
    return mockWorkspaceData;
  },
};
