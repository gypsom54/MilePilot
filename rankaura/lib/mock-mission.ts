/**
 * Mission Workspace mock data — Sprint 015 intelligence briefing.
 */

import type { Mission } from "@/types/mission";

export const MOCK_MISSION_ID = "research-storage-conditions-guide";

export const mockMissionWorkspace: Mission = {
  id: MOCK_MISSION_ID,
  title: "Create Research Storage Conditions Guide",
  missionType: "content_guide",
  missionTypeLabel: "Content Guide",
  priority: "high",
  priorityLabel: "High impact",
  confidence: 94,
  reviewTimeMinutes: 2,
  description:
    "A clear guide explaining how to store research materials safely, so customers trust your expertise before they buy.",
  whyCreated:
    "Customers often look for clear storage guidance before trusting a supplier.",
  expectedOutcome:
    "More visitors understand your standards, trust your business, and reach out with confidence.",
  workspaceStatus: "ready_for_approval",
  workspaceStatusLabel: "Ready for approval",
  estimatedCompletion: "Today",
  auraBrief: {
    paragraphs: [
      "I created this mission because customers often look for clear storage guidance before trusting a supplier.",
      "Scout confirmed demand.",
      "Writer prepared the guide.",
      "Architect planned where it should live.",
      "Guardian checked quality and compliance.",
      "Everything is ready for your review.",
    ],
  },
  departmentContributions: [
    {
      id: "scout",
      departmentName: "Scout",
      statusLabel: "Research Complete",
      outputs: [
        "Customer question trend identified",
        "Competitor pages reviewed",
        "High intent opportunity confirmed",
      ],
      confidence: 96,
    },
    {
      id: "writer",
      departmentName: "Writer",
      statusLabel: "Draft Ready",
      outputs: [
        "Guide drafted",
        "FAQ section prepared",
        "Meta description prepared",
        "CTA included",
      ],
      confidence: 94,
    },
    {
      id: "architect",
      departmentName: "Architect",
      statusLabel: "Structure Approved",
      outputs: [
        "Page placement recommended",
        "Internal links planned",
        "Related product pages identified",
        "Heading structure reviewed",
      ],
      confidence: 93,
    },
    {
      id: "guardian",
      departmentName: "Guardian",
      statusLabel: "Passed",
      outputs: [
        "Brand voice checked",
        "Readability checked",
        "Compliance wording checked",
        "No risky claims detected",
      ],
      score: "97/100",
    },
    {
      id: "publisher",
      departmentName: "Publisher",
      statusLabel: "Waiting Approval",
      outputs: ["Ready to continue after approval"],
    },
  ],
  draftPreview: {
    title: "Research Storage Conditions Guide",
    sections: [
      {
        heading: "Why storage conditions matter",
        body: "Research materials degrade when temperature, humidity, or handling fall outside safe ranges. Clear guidance helps buyers protect their investment and trust your expertise before placing an order.",
      },
      {
        heading: "Recommended storage considerations",
        body: "Store materials in a cool, dry environment away from direct sunlight. Maintain stable humidity below 60% where possible. Use sealed containers for sensitive samples and label every item with date and handling notes.",
      },
      {
        heading: "Handling and documentation",
        body: "Train staff on correct lifting and transfer procedures. Keep a log of storage conditions and periodic checks. Documentation supports compliance audits and reduces liability when materials are stored on your premises.",
      },
      {
        heading: "Common questions",
        body: "Buyers frequently ask about temperature limits, safe storage duration, specialist requirements for sensitive materials, and labelling for compliance. This guide addresses each concern in plain language.",
      },
      {
        heading: "Next step",
        body: "If you need guidance for a specific material or facility, our team can advise on specialist storage solutions tailored to your requirements.",
      },
    ],
    callToAction: "Request documentation",
  },
  architecturePlan: {
    recommendedLocation: "Research Library > Storage Conditions",
    suggestedInternalLinks: [
      "Product Documentation",
      "Research Library",
      "FAQ",
      "Contact",
    ],
    suggestedCta: "Request documentation",
  },
  businessImpact: {
    estimatedMonthlyVisitors: 420,
    potentialEnquiries: 14,
    confidence: 94,
    managementTimeMinutes: 2,
    estimatedTimeSavedHours: 3.2,
  },
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
    confidence: 96,
  },
  writer: {
    title: "Research Storage Conditions Guide",
    introduction:
      "Storing research materials correctly protects your investment and keeps results reliable. Whether you supply chemicals, samples, or sensitive equipment, the right conditions matter.",
    sections: [
      {
        heading: "Why storage conditions matter",
        body: "Research materials degrade when temperature, humidity, or handling fall outside safe ranges.",
      },
      {
        heading: "Recommended storage considerations",
        body: "Store materials in a cool, dry environment away from direct sunlight.",
      },
      {
        heading: "Handling and documentation",
        body: "Train staff on correct lifting and transfer procedures.",
      },
      {
        heading: "Common questions",
        body: "Buyers frequently ask about temperature limits and safe storage duration.",
      },
      {
        heading: "Next step",
        body: "Contact our team for guidance on specialist storage solutions.",
      },
    ],
    callToAction: "Request documentation",
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
      "Product Documentation",
      "Research Library",
      "FAQ",
      "Contact",
    ],
    relatedPages: ["Product Documentation", "Research Library", "FAQ"],
    structureScore: 93,
    checklist: [
      { id: "hierarchy", label: "Heading hierarchy is logical", passed: true },
      { id: "navigation", label: "Navigation placement decided", passed: true },
      { id: "links", label: "Internal links suggested", passed: true },
      { id: "mobile", label: "Mobile-friendly structure", passed: true },
    ],
  },
  guardian: {
    checks: [
      { id: "brand", label: "Brand voice checked", passed: true },
      { id: "readability", label: "Readability checked", passed: true },
      { id: "compliance", label: "Compliance wording checked", passed: true },
      { id: "claims", label: "No risky claims detected", passed: true },
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
  preparedByDepartments: ["Scout", "Writer", "Architect", "Guardian"],
};
