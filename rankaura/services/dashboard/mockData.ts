/**
 * Mock dashboard data — replaced by AuraCore and API in future phases.
 */

import type { DashboardData } from "@/types/dashboard";

export const MOCK_DASHBOARD_DATA: Omit<DashboardData, "greeting"> = {
  business: {
    name: "RankAura Demo",
    industry: "Digital Marketing",
    logoInitial: "R",
  },

  hero: {
    headline: "Your business has been growing while you were away.",
    improvementsCount: 17,
    hoursSaved: 3.2,
  },

  teamActivity: [
    {
      id: "scout",
      name: "Scout",
      task: "Researching customer demand...",
      status: "working",
      progress: 68,
    },
    {
      id: "writer",
      name: "Writer",
      task: "Creating a new service page...",
      status: "working",
      progress: 45,
    },
    {
      id: "architect",
      name: "Architect",
      task: "Strengthening internal links...",
      status: "working",
      progress: 82,
    },
    {
      id: "optimiser",
      name: "Optimiser",
      task: "Improving existing pages...",
      status: "working",
      progress: 56,
    },
    {
      id: "analyst",
      name: "Analyst",
      task: "Reviewing today's rankings...",
      status: "working",
      progress: 34,
    },
    {
      id: "publisher",
      name: "Publisher",
      task: "Waiting for approval...",
      status: "idle",
    },
  ],

  momentum: {
    label: "Strong",
    changePercent: 18,
    progress: 78,
    summary: "Momentum is increasing.",
    detail: "Estimated organic visibility is improving.",
  },

  wins: [
    {
      id: "win-1",
      icon: "🎉",
      title: "Homepage improved",
      description:
        "We simplified the welcome message so visitors know what you offer right away.",
      impact: "+4%",
    },
    {
      id: "win-2",
      icon: "📄",
      title: "New article prepared",
      description: "Writer drafted content about your most popular service.",
      impact: "Ready for your review",
    },
    {
      id: "win-3",
      icon: "✨",
      title: "Contact page refreshed",
      description: "A warmer introduction helps more people reach out.",
      impact: "+2%",
    },
  ],

  opportunities: [
    {
      id: "opp-1",
      title: "Emergency Boiler Repair",
      description:
        "High demand in your area — customers are actively looking for this service.",
      estimatedVisitors: "420/month",
      potentialLeads: "14/month",
      confidence: 96,
      priority: "high",
    },
    {
      id: "opp-2",
      title: "Annual Service Plans",
      description:
        "A growing number of homeowners prefer predictable maintenance packages.",
      estimatedVisitors: "180/month",
      potentialLeads: "6/month",
      confidence: 84,
      priority: "medium",
    },
  ],

  autopilot: {
    enabled: true,
    activities: [
      "Monitoring Google",
      "Optimising your website",
      "Creating new content",
      "Watching competitors",
    ],
    lastCompletedTask: "2 minutes ago",
  },
};
