/**
 * Dashboard data service — foundation placeholder.
 *
 * Future module connections:
 * - AuraCore: orchestrates all modules, provides unified dashboard state
 * - Scout: discovers growth opportunities → Opportunities section
 * - Writer: content creation activity → AI Team Activity
 * - Optimiser: page improvements → Today's Wins
 * - Architect: site structure insights → Growth Momentum
 * - Publisher: publishing status → AI Team Activity, Autopilot
 * - Analyst: performance metrics → Growth Momentum, Today's Wins
 */

import { PLACEHOLDER_USER } from "@/lib/constants";
import { getGreeting } from "@/lib/utils";
import type { DashboardData } from "@/types/dashboard";

/**
 * Fetches dashboard data for the home screen.
 * Currently returns static placeholders — no fake complex logic.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const greeting = getGreeting();

  return {
    greeting: `${greeting} ${PLACEHOLDER_USER.firstName} 👋`,
    subheading: "Your AI team has been working while you were away.",

    // Scout + Writer + Publisher activity feed (placeholder)
    teamActivity: [
      {
        id: "scout",
        name: "Scout",
        role: "Finds opportunities",
        status: "working",
        summary: "Reviewing what customers are searching for in your area",
      },
      {
        id: "writer",
        name: "Writer",
        role: "Creates content",
        status: "working",
        summary: "Preparing a helpful page for your website",
      },
      {
        id: "publisher",
        name: "Publisher",
        role: "Keeps you visible",
        status: "idle",
        summary: "Standing by for your approval",
      },
    ],

    // Architect + Analyst momentum signal (placeholder)
    momentum: {
      score: 72,
      trend: "up",
      summary: "Steady progress — your online presence is building momentum",
    },

    // Optimiser + Analyst wins (placeholder)
    wins: [
      {
        id: "win-1",
        title: "Your homepage reads clearer",
        description: "We simplified the welcome message so visitors know what you offer right away.",
      },
      {
        id: "win-2",
        title: "A new page is ready for review",
        description: "Writer drafted content about your most popular service.",
      },
    ],

    // Scout opportunities (placeholder)
    opportunities: [
      {
        id: "opp-1",
        title: "More people are searching nearby",
        description: "There's growing interest in your services — a good time to be visible.",
        priority: "high",
      },
      {
        id: "opp-2",
        title: "Your contact page could welcome visitors",
        description: "A warmer introduction might help more people reach out.",
        priority: "medium",
      },
    ],

    // AuraCore autopilot state (placeholder)
    autopilot: {
      enabled: true,
      label: "Autopilot is on",
      description: "Your AI team is quietly working in the background. We'll notify you when something needs your attention.",
    },
  };
}
