import type { DashboardData, DashboardDataProvider } from "@/types/dashboard";

/**
 * Deterministic mock for Northern Materials Co.
 * Same coherent story across every card — not random.
 *
 * Values for the locked Evening Brief / Today's Mission match the
 * approved dashboard screenshot so the UI stays visually locked.
 */
const NORTHERN_MATERIALS_DASHBOARD: DashboardData = {
  business: {
    name: "Northern Materials Co.",
    industry: "Industrial Supplies",
    ownerFirstName: "Jonathan",
    ownerInitial: "N",
  },
  activeNav: "dashboard",
  navItems: [
    { id: "dashboard", label: "Dashboard" },
    { id: "ai-team", label: "AI Team" },
    { id: "growth", label: "Growth" },
    { id: "content", label: "Content" },
    { id: "website", label: "Website" },
    { id: "settings", label: "Settings" },
  ],
  brief: {
    greeting: "Good evening Jonathan",
    improvementsToday: 12,
    hoursSaved: 2.8,
    statsLine: "12 improvements today · 2.8 hrs saved",
    priorityMission: {
      label: "PRIORITY MISSION",
      title: "Create Research Storage Conditions Guide",
      ctaLabel: "Review Mission",
    },
  },
  todaysMission: {
    title: "Today's Mission",
    support: "The one thing that matters most today",
    description:
      "Publish a clear storage-conditions guide so buyers trust Northern Materials for sensitive industrial stock — the same priority your Growth Team prepared this evening.",
  },
  aiTeam: {
    statusLabel: "Working quietly",
    summary:
      "Three specialists reviewed your catalogue pages, local presence and competitor guides. Twelve improvements are ready for your approval.",
    agentsActive: 3,
  },
  websiteHealth: {
    statusLabel: "Steady",
    summary:
      "Core service pages load cleanly. The biggest gap is missing guidance content for storage conditions — now your priority mission.",
    score: 78,
  },
  growthOpportunities: {
    count: 12,
    highlight: {
      title: "Storage conditions guide",
      summary:
        "Buyers searching for compliant industrial storage advice are leaving without answers. One guide unlocks visibility and trust.",
    },
    items: [
      {
        title: "Storage conditions guide",
        summary: "High-intent content gap for industrial buyers.",
      },
      {
        title: "Delivery coverage pages",
        summary: "Clarify regions you supply across the North.",
      },
      {
        title: "Supplier trust signals",
        summary: "Surface certifications buyers look for before enquiring.",
      },
    ],
  },
};

export const mockDashboardProvider: DashboardDataProvider = {
  getDashboardData() {
    return NORTHERN_MATERIALS_DASHBOARD;
  },
};
