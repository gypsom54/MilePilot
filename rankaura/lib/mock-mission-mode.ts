/**
 * Mission Mode mock data — pipeline, document, feed seeds, Aura insights.
 */

import type {
  AuraInsight,
  LiveFeedEvent,
  MissionDocument,
  PipelineEmployee,
} from "@/types/mission-mode";

export const PIPELINE_EMPLOYEES: PipelineEmployee[] = [
  {
    id: "scout",
    name: "Scout",
    color: "#4f8ef7",
    status: "complete",
    activity: "Scanning competitors...",
    progress: 100,
    detail: "Found 43 pages",
  },
  {
    id: "writer",
    name: "Writer",
    color: "#2eb88a",
    status: "complete",
    activity: "Polishing draft sections...",
    progress: 94,
    detail: "FAQ section ready",
  },
  {
    id: "architect",
    name: "Architect",
    color: "#6b8cae",
    status: "complete",
    activity: "Mapping page structure...",
    progress: 93,
    detail: "Internal links planned",
  },
  {
    id: "guardian",
    name: "Guardian",
    color: "#9b7ed9",
    status: "complete",
    activity: "Running compliance checks...",
    progress: 97,
    detail: "Score 97/100",
  },
  {
    id: "optimiser",
    name: "Optimiser",
    color: "#d4a012",
    status: "working",
    activity: "Tuning meta signals...",
    progress: 72,
    detail: "Keywords aligned",
  },
  {
    id: "analyst",
    name: "Analyst",
    color: "#3db8c4",
    status: "working",
    activity: "Forecasting impact...",
    progress: 68,
    detail: "420 visitors/month",
  },
  {
    id: "publisher",
    name: "Publisher",
    color: "#e8ecf2",
    status: "waiting",
    activity: "Awaiting your approval...",
    progress: 0,
    detail: "Ready to deploy",
  },
];

export const SEED_FEED_EVENTS: LiveFeedEvent[] = [
  { id: "f1", time: "21:31", message: "Scout discovered customer trend", employeeId: "scout" },
  { id: "f2", time: "21:32", message: "Writer generated FAQ section", employeeId: "writer" },
  { id: "f3", time: "21:33", message: "Guardian detected compliance issue — resolved", employeeId: "guardian" },
  { id: "f4", time: "21:34", message: "Architect improved structure", employeeId: "architect" },
  { id: "f5", time: "21:35", message: "Publisher awaiting approval", employeeId: "publisher" },
];

export const AURA_INSIGHTS: AuraInsight[] = [
  { id: "a1", text: "I've identified an opportunity." },
  { id: "a2", text: "I think this guide could rank quickly." },
  { id: "a3", text: "Competitors are missing this section." },
  { id: "a4", text: "This mission is now 94% complete." },
  { id: "a5", text: "Customer demand for storage guidance is rising." },
  { id: "a6", text: "Guardian cleared all compliance checks." },
];

export const FEED_EVENT_POOL: Omit<LiveFeedEvent, "id" | "time">[] = [
  { message: "Scout mapped 12 new competitor pages", employeeId: "scout" },
  { message: "Writer refined introduction copy", employeeId: "writer" },
  { message: "Architect linked to Product Documentation", employeeId: "architect" },
  { message: "Guardian validated brand voice", employeeId: "guardian" },
  { message: "Optimiser improved meta description", employeeId: "optimiser" },
  { message: "Analyst projected 14 enquiries/month", employeeId: "analyst" },
  { message: "Publisher prepared deployment queue", employeeId: "publisher" },
  { message: "Scout confirmed high-intent keyword cluster", employeeId: "scout" },
  { message: "Writer added handling documentation section", employeeId: "writer" },
];

export const EMPLOYEE_ACTIVITY_POOL: Record<string, string[]> = {
  scout: ["Scanning competitors...", "Mapping search demand...", "Reviewing SERP landscape..."],
  writer: ["Drafting FAQ answers...", "Polishing section copy...", "Refining call to action..."],
  architect: ["Planning internal links...", "Reviewing heading hierarchy...", "Mapping site placement..."],
  guardian: ["Checking compliance wording...", "Validating readability...", "Scanning for risky claims..."],
  optimiser: ["Tuning meta signals...", "Aligning keyword targets...", "Optimising snippet preview..."],
  analyst: ["Forecasting traffic impact...", "Modelling enquiry volume...", "Calculating time saved..."],
  publisher: ["Preparing publish queue...", "Awaiting your approval...", "Standing by to deploy..."],
};

export const mockMissionDocument: MissionDocument = {
  title: "Research Storage Conditions Guide",
  subtitle: "Prepared by your AI Growth Team · Ready for review",
  sections: [
    {
      id: "research",
      title: "Research",
      content:
        "Scout identified a high-intent opportunity: buyers search for clear storage guidance before trusting a supplier. 43 competitor pages reviewed. Most lack plain-English explanations and FAQ coverage for humidity and compliance.",
      items: [
        "420 monthly searches for storage guidance",
        "High intent — buyers pre-purchase research",
        "Competitors missing FAQ depth",
      ],
    },
    {
      id: "outline",
      title: "Outline",
      content: "Architect structured the guide for clarity and discoverability within the Research Library.",
      items: [
        "Why storage conditions matter",
        "Recommended storage considerations",
        "Handling and documentation",
        "Common questions",
        "Next step",
      ],
    },
    {
      id: "draft",
      title: "Draft",
      content:
        "Storing research materials correctly protects your investment and keeps results reliable. Whether you supply chemicals, samples, or sensitive equipment, the right conditions matter. Store materials in a cool, dry environment away from direct sunlight. Maintain stable humidity below 60% where possible.",
    },
    {
      id: "images",
      title: "Images",
      content: "Visual assets planned for the published guide.",
      items: [
        "Storage environment diagram — cool, dry, labelled",
        "Compliance labelling example",
        "Research Library hero illustration",
      ],
    },
    {
      id: "faq",
      title: "FAQ",
      content: "Writer prepared answers to the most common buyer questions.",
      items: [
        "What temperature should research materials be stored at?",
        "How long can samples be stored safely?",
        "Do I need specialist storage for sensitive materials?",
        "What labelling is required for compliance?",
      ],
    },
    {
      id: "seo",
      title: "SEO",
      content: "Optimiser prepared metadata and targeting signals.",
      items: [
        "Primary: research storage conditions",
        "Meta description: 158 characters — trust-focused",
        "Suggested URL: /research-library/storage-conditions",
      ],
    },
    {
      id: "internal-links",
      title: "Internal Links",
      content: "Architect mapped connections across your site.",
      items: ["Product Documentation", "Research Library", "FAQ", "Contact"],
    },
    {
      id: "cta",
      title: "Call To Action",
      content: "Request documentation — primary conversion path for high-intent visitors seeking specialist guidance.",
    },
  ],
};
