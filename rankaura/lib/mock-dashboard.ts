/**
 * Aurora Mission Control — structured mock data.
 * Single source of truth until API integration (Phase 3+).
 */

import type {
  DashboardBusinessProfile,
  DashboardBusinessHealth,
  DashboardDailyBrief,
  DashboardGrowthTeamMember,
  DashboardMission,
  DashboardTimelineEvent,
} from "@/types/dashboard";

export const mockBusiness: DashboardBusinessProfile = {
  name: "Northern Materials Co.",
  industry: "Industrial Supplies",
  logoInitial: "N",
};

export const mockDailyBrief: DashboardDailyBrief = {
  headline: "Everything is on track. One mission needs your attention today.",
  summary:
    "Your Growth Team completed 12 improvements overnight. Estimated management time today: 2 minutes.",
  improvementsCount: 12,
  managementTimeMinutes: 2,
  hoursSaved: 2.8,
};

export const mockTodayMission: DashboardMission = {
  id: "mission-001",
  title: "Create Research Storage Conditions Guide",
  timelineApprovalTitle: "Research Storage Conditions Guide",
  reason:
    "Customers often look for clear storage guidance before trusting a supplier.",
  impact: "high",
  confidence: 94,
  timeRequiredMinutes: 2,
  ctaLabel: "Review Mission",
  status: "pending",
  departments: [
    {
      id: "scout",
      name: "Scout",
      contribution: "Spotted that customers ask about storage before they buy",
    },
    {
      id: "writer",
      name: "Writer",
      contribution: "Prepared a clear, trustworthy guide in plain English",
    },
    {
      id: "architect",
      name: "Architect",
      contribution: "Organised the page so visitors find answers quickly",
    },
    {
      id: "guardian",
      name: "Guardian",
      contribution: "Checked the work meets your standards before review",
    },
  ],
  expectedOutcome:
    "More visitors trust your expertise and feel confident reaching out.",
  onApproveSummary:
    "Your Growth Team will finish quality checks and prepare the guide for publishing.",
};

export const mockGrowthTeam: DashboardGrowthTeamMember[] = [
  {
    id: "scout",
    name: "Scout",
    task: "Monitoring customer questions in your market",
    status: "working",
    progress: 72,
  },
  {
    id: "writer",
    name: "Writer",
    task: "Polishing the storage conditions guide",
    status: "working",
    progress: 88,
  },
  {
    id: "architect",
    name: "Architect",
    task: "Organising page structure for clarity",
    status: "working",
    progress: 65,
  },
  {
    id: "optimiser",
    name: "Optimiser",
    task: "Refreshing existing product pages",
    status: "working",
    progress: 54,
  },
  {
    id: "analyst",
    name: "Analyst",
    task: "Tracking visitor engagement trends",
    status: "working",
    progress: 41,
  },
  {
    id: "publisher",
    name: "Publisher",
    task: "Standing by for your approval",
    status: "idle",
  },
];

export const mockBusinessHealth: DashboardBusinessHealth = {
  status: "healthy",
  label: "Healthy",
  summary: "Your online presence is growing steadily.",
  detail: "Visibility improved 14% this month with no issues detected.",
  changePercent: 14,
};

export const mockTimelineEvents: DashboardTimelineEvent[] = [
  {
    id: "evt-1",
    title: "Writer completed storage guide draft",
    timestamp: "2 hours ago",
    type: "team",
  },
  {
    id: "evt-2",
    title: "Scout flagged storage guidance as a top customer question",
    timestamp: "Yesterday",
    type: "team",
  },
  {
    id: "evt-3",
    title: "Contact page refresh went live",
    timestamp: "2 days ago",
    type: "system",
  },
  {
    id: "evt-4",
    title: "Growth Team completed overnight improvements",
    timestamp: "This morning",
    type: "system",
  },
];
