/**
 * Mission Workspace mock data — Aurora Sprint 003.
 */

import type { Mission } from "@/types/mission";

export const MOCK_MISSION_ID = "mission-001";

export const mockMissionWorkspace: Mission = {
  id: MOCK_MISSION_ID,
  title: "Research Storage Conditions Guide",
  description:
    "A clear guide explaining how to store research materials safely, so customers trust your expertise before they buy.",
  whyCreated:
    "Customers often look for clear storage guidance before trusting a supplier. Scout identified this as one of the most common questions in your market.",
  expectedOutcome:
    "More visitors understand your standards, trust your business, and reach out with confidence.",
  workspaceStatus: "in_review",
  workspaceStatusLabel: "IN REVIEW",
  estimatedCompletion: "Today",
  impact: {
    estimatedVisitors: "420 visitors/month",
    estimatedEnquiries: "14 enquiries/month",
    confidence: 94,
    managementTimeMinutes: 2,
    visibilityIncrease: "+18% estimated visibility",
    leadIncrease: "+14 enquiries/month",
    businessImpact: "high",
  },
  departments: [
    {
      id: "scout",
      name: "Scout",
      status: "completed",
      statusLabel: "Completed",
      outputs: [
        "Customer research complete",
        "Competitor research complete",
        "Search demand validated",
      ],
    },
    {
      id: "writer",
      name: "Writer",
      status: "draft_ready",
      statusLabel: "Draft Ready",
      outputs: ["Storage guide completed", "Metadata prepared", "FAQ drafted"],
    },
    {
      id: "architect",
      name: "Architect",
      status: "completed",
      statusLabel: "Completed",
      outputs: [
        "Internal links suggested",
        "Heading structure approved",
        "Navigation placement decided",
      ],
    },
    {
      id: "guardian",
      name: "Guardian",
      status: "passed",
      statusLabel: "Passed",
      outputs: [
        "Brand voice approved",
        "Compliance approved",
        "Readability approved",
      ],
    },
    {
      id: "publisher",
      name: "Publisher",
      status: "waiting_approval",
      statusLabel: "Waiting Approval",
      outputs: ["Ready to publish after approval"],
    },
  ],
  preview: {
    title: "Research Storage Conditions Guide",
    blocks: [
      {
        type: "heading",
        content: "How to Store Research Materials Safely",
      },
      {
        type: "paragraph",
        content:
          "Storing research materials correctly protects your investment and keeps results reliable. Whether you supply chemicals, samples, or sensitive equipment, the right conditions matter.",
      },
      {
        type: "subheading",
        content: "Temperature and humidity",
      },
      {
        type: "paragraph",
        content:
          "Most research materials need a stable, cool environment. Avoid direct sunlight and keep humidity below 60% where possible. Our team can advise on specialist storage if your materials need it.",
      },
      {
        type: "subheading",
        content: "Labelling and organisation",
      },
      {
        type: "paragraph",
        content:
          "Clear labels with dates and handling notes help your team stay safe and compliant. We recommend grouping materials by type and reviewing storage quarterly.",
      },
      {
        type: "subheading",
        content: "When to ask an expert",
      },
      {
        type: "paragraph",
        content:
          "If you are unsure about conditions for a specific material, speak to our team. We have helped hundreds of businesses store research supplies correctly.",
      },
      {
        type: "cta",
        content: "Speak to our storage specialists today",
      },
    ],
  },
  timeline: [
    { id: "tl-1", time: "20:39", title: "Writer draft completed", type: "team" },
    { id: "tl-2", time: "20:31", title: "Scout research completed", type: "team" },
    { id: "tl-3", time: "19:45", title: "Architect structure approved", type: "team" },
    { id: "tl-4", time: "19:20", title: "Guardian quality checks passed", type: "team" },
  ],
  comments: [],
};
