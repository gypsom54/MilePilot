import type { WorkspaceData } from "@/types/workspace";

/**
 * Deterministic Workspace mock — local-business scenario, no demo identity hard-coding.
 * Identity personalised from onboarding session when available.
 */
export const mockWorkspaceData: WorkspaceData = {
  welcome: {
    firstName: "",
    businessName: "Your business",
    greeting: "Good morning.",
    support: "RankAura has been working on your business.",
    monitoringLine:
      "RankAura is actively monitoring your business across 13 growth areas.",
    activitySummary:
      "Since you were last here, we’ve prepared safe website recommendations and finished fresh community research.",
  },
  biggestOpportunity: {
    variant: "opportunity",
    title: "We found an opportunity to help more local customers discover your services.",
    support:
      "We’ve prepared a set of improvements designed around the phrases your customers are already searching for.",
    actionLabel: "Review & Fix",
    href: "/growth-plan?site=existing&expand=website_health",
  },
  recentWins: [
    {
      id: "w1",
      text: "Google Business Profile setup completed",
    },
    {
      id: "w2",
      text: "Two content outlines prepared from customer questions",
    },
    {
      id: "w3",
      text: "Eight local citations verified for consistency",
    },
  ],
  sinceLastVisit: [
    {
      id: "a1",
      text: "Prepared website recommendations for your key service pages.",
      completedAtLabel: "This morning",
    },
    {
      id: "a2",
      text: "Completed community research on questions customers ask before getting in touch.",
      completedAtLabel: "Yesterday afternoon",
    },
    {
      id: "a3",
      text: "Updated competitor insights with three nearby changes worth noticing.",
      completedAtLabel: "Yesterday",
    },
    {
      id: "a4",
      text: "Drafted content outlines from your priority customer questions.",
      completedAtLabel: "Two days ago",
    },
  ],
  growthAreas: [
    {
      id: "website_health",
      name: "Website Optimisation",
      subtitle: "Helping search engines better understand your website.",
      statusLabel: "Ready for approval",
      impact: "Could help more customers discover your business.",
      actionLabel: "Review Recommendations",
      href: "/growth-plan?site=existing&expand=website_health",
    },
    {
      id: "local_seo",
      name: "Local SEO",
      subtitle: "Helping nearby customers discover your business.",
      statusLabel: "Recommendations prepared",
      impact: "Could increase enquiries from nearby customers.",
      actionLabel: "Open Strategy",
      href: "/growth-plan?site=existing&expand=local_seo",
    },
    {
      id: "content_strategy",
      name: "Content Strategy",
      subtitle: "Creating content your customers are already searching for.",
      statusLabel: "Recommendations prepared",
      impact: "Answers questions your future customers are already asking.",
      actionLabel: "View Progress",
      href: "/growth-plan?site=existing&expand=content_strategy",
    },
    {
      id: "reddit_community",
      name: "Reddit & Community Research",
      subtitle: "Learning from the conversations your customers are already having.",
      statusLabel: "Research completed",
      impact: "Surfaces the real language people use before they choose a business.",
      actionLabel: "View Research",
      href: "/growth-plan?site=existing&expand=reddit_community",
    },
  ],
  recentProgress: [
    {
      id: "f1",
      type: "opportunity",
      title: "A new opportunity on your service pages",
      body: "We found several customer searches your current pages do not yet address. Recommendations are ready when you are.",
      timestampLabel: "This morning",
      actionLabel: "Review & Fix",
      href: "/growth-plan?site=existing&expand=website_health",
    },
    {
      id: "f2",
      type: "research",
      title: "Community research completed",
      body: "We identified recurring customer questions and buying concerns from public discussions — original insights, not copied posts.",
      timestampLabel: "Yesterday afternoon",
      actionLabel: "View Research",
      href: "/growth-plan?site=existing&expand=reddit_community",
    },
    {
      id: "f3",
      type: "competitor",
      title: "A nearby competitor launched a new service",
      body: "We’ve recorded the change and identified how your business could respond calmly.",
      timestampLabel: "Last night",
    },
    {
      id: "f4",
      type: "recommendation",
      title: "Content recommendation prepared",
      body: "A short FAQ outline answers the three questions people ask most before contacting a business like yours.",
      timestampLabel: "Two days ago",
      actionLabel: "View Progress",
      href: "/growth-plan?site=existing&expand=content_strategy",
    },
    {
      id: "f5",
      type: "completed",
      title: "Local citation check completed",
      body: "We’re continuing to watch your listings quietly. Eight citations are now consistent.",
      timestampLabel: "Two days ago",
    },
  ],
};

export const mockWorkspaceProvider = {
  getWorkspaceData(): WorkspaceData {
    return mockWorkspaceData;
  },
};
