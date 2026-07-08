/**
 * Mission Workspace mock data — intelligence briefing (Sprint 005).
 */

import type { Mission } from "@/types/mission";

export const MOCK_MISSION_ID = "mission-001";

export const mockMissionWorkspace: Mission = {
  id: MOCK_MISSION_ID,
  title: "Research Storage Conditions Guide",
  missionType: "content_guide",
  missionTypeLabel: "Content Guide",
  priority: "high",
  priorityLabel: "High Impact",
  confidence: 94,
  reviewTimeMinutes: 2,
  description:
    "A clear guide explaining how to store research materials safely, so customers trust your expertise before they buy.",
  whyCreated:
    "Customers often look for clear storage guidance before trusting a supplier. Scout identified this as one of the most common questions in your market.",
  expectedOutcome:
    "More visitors understand your standards, trust your business, and reach out with confidence.",
  workspaceStatus: "ready_for_approval",
  workspaceStatusLabel: "Ready for approval",
  estimatedCompletion: "Today",
  scout: {
    marketOpportunity:
      "Growing demand for storage guidance among research buyers — competitors lack clear, trustworthy advice.",
    monthlySearches: 420,
    competition: "medium",
    competitionLabel: "Medium",
    intent: "high",
    intentLabel: "High",
    suggestedAngle: "Research Storage Conditions",
    customerIntent:
      "Buyers want reassurance that materials will stay safe and compliant before placing an order.",
    competitorObservations: [
      "Most competitors list specs without explaining storage in plain English",
      "Top-ranked pages lack FAQ sections addressing humidity concerns",
      "Few suppliers offer proactive storage guidance",
    ],
    customerQuestions: [
      "What temperature should research materials be stored at?",
      "How long can samples be stored safely?",
      "Do I need specialist storage for sensitive materials?",
      "What labelling is required for compliance?",
    ],
  },
  writer: {
    title: "How to Store Research Materials Safely",
    introduction:
      "Storing research materials correctly protects your investment and keeps results reliable. Whether you supply chemicals, samples, or sensitive equipment, the right conditions matter.",
    sections: [
      {
        heading: "Temperature and humidity",
        body: "Most research materials need a stable, cool environment. Avoid direct sunlight and keep humidity below 60% where possible. Our team can advise on specialist storage if your materials need it.",
      },
      {
        heading: "Labelling and organisation",
        body: "Clear labels with dates and handling notes help your team stay safe and compliant. We recommend grouping materials by type and reviewing storage quarterly.",
      },
      {
        heading: "When to ask an expert",
        body: "If you are unsure about conditions for a specific material, speak to our team. We have helped hundreds of businesses store research supplies correctly.",
      },
    ],
    callToAction: "Speak to our storage specialists today",
    status: "draft_ready",
    statusLabel: "Draft Ready",
  },
  architect: {
    pageStructure: [
      "Hero with clear value proposition",
      "Storage conditions overview",
      "Section per condition type",
      "FAQ block",
      "Contact CTA",
    ],
    headingHierarchy: ["H1: Page title", "H2: Main sections", "H3: Sub-topics", "H2: FAQ", "H2: Contact"],
    internalLinks: [
      "Link to Product Catalogue",
      "Link to Compliance & Safety page",
      "Link to Contact Us",
    ],
    relatedPages: ["Product Catalogue", "Compliance & Safety", "Delivery Information"],
    structureScore: 92,
    checklist: [
      { id: "hierarchy", label: "Heading hierarchy is logical", passed: true },
      { id: "navigation", label: "Navigation placement decided", passed: true },
      { id: "links", label: "Internal links suggested", passed: true },
      { id: "mobile", label: "Mobile-friendly structure", passed: true },
    ],
  },
  guardian: {
    checks: [
      { id: "grammar", label: "Grammar", passed: true },
      { id: "readability", label: "Readability", passed: true },
      { id: "brand", label: "Brand Voice", passed: true },
      { id: "compliance", label: "Compliance", passed: true },
      { id: "accessibility", label: "Accessibility", passed: true },
    ],
    score: 97,
    scoreLabel: "97/100",
  },
  briefingImpact: {
    estimatedMonthlyVisitors: "420",
    potentialLeads: "14",
    estimatedRevenueImpact: "£2,800/month",
    hoursSaved: "3.2 hrs",
    confidence: 94,
  },
  impact: {
    estimatedVisitors: "420 visitors/month",
    estimatedEnquiries: "14 enquiries/month",
    confidence: 94,
    managementTimeMinutes: 2,
    visibilityIncrease: "+18% estimated visibility",
    leadIncrease: "+14 enquiries/month",
    businessImpact: "high",
  },
  departments: [],
  preview: { title: "", blocks: [] },
  timeline: [
    { id: "tl-1", time: "20:39", title: "Writer draft completed", type: "team" },
    { id: "tl-2", time: "20:31", title: "Scout research completed", type: "team" },
    { id: "tl-3", time: "19:45", title: "Architect structure approved", type: "team" },
    { id: "tl-4", time: "19:20", title: "Guardian quality checks passed", type: "team" },
  ],
  comments: [],
};
