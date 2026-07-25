/**
 * Mock memory store data — no persistence.
 */

import type { MemoryStore } from "@/services/memory/models/memory-store";

export const MOCK_BUSINESS_ID = "biz_rankaura_demo";

export const MOCK_MEMORY_STORE: MemoryStore = {
  businessId: MOCK_BUSINESS_ID,
  version: 3,
  updatedAt: "2026-07-07T00:00:00.000Z",

  business: {
    businessId: MOCK_BUSINESS_ID,
    name: "RankAura Demo",
    industry: "Digital Marketing",
    description: "A local digital marketing agency helping small businesses grow online.",
    location: "Manchester, UK",
    targetAudience: "Small business owners who want growth without complexity",
    products: [],
    services: [
      {
        id: "svc-1",
        name: "Emergency Boiler Repair",
        description: "Fast-response boiler repair for homeowners.",
      },
      {
        id: "svc-2",
        name: "Annual Service Plans",
        description: "Predictable maintenance packages for peace of mind.",
      },
    ],
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  brand: {
    personality: ["reassuring", "intelligent", "approachable"],
    values: ["simplicity", "trust", "results"],
    tone: "calm and confident",
    readingLevel: "plain English",
    sentenceLength: "short",
    useContractions: true,
    wordsToUse: ["grow", "customers", "help", "improve"],
    wordsToAvoid: ["SEO", "keywords", "rankings", "algorithm"],
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  website: {
    websiteId: "web-1",
    url: "https://rankaura-demo.example",
    platform: "WordPress",
    pageCount: 12,
    primaryPages: [
      { id: "page-1", title: "Homepage", slug: "/", status: "published" },
      { id: "page-2", title: "Services", slug: "/services", status: "published" },
      { id: "page-3", title: "Contact", slug: "/contact", status: "optimising" },
    ],
    lastSyncedAt: "2026-07-06T22:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  competitors: {
    competitors: [
      {
        id: "comp-1",
        name: "Local Growth Co",
        websiteUrl: "https://localgrowth.example",
        strengths: ["Strong local reviews", "Active blog"],
        notes: "Focuses on same postcode area.",
      },
      {
        id: "comp-2",
        name: "Bright Marketing",
        websiteUrl: "https://brightmarketing.example",
        strengths: ["Premium branding", "Video content"],
        notes: "Higher price point, less local focus.",
      },
    ],
    lastReviewedAt: "2026-07-06T18:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  performance: {
    momentumLabel: "Strong",
    changePercent: 18,
    visibilityScore: 78,
    recentWins: [
      "Homepage improved (+4%)",
      "New article prepared",
      "Contact page refreshed (+2%)",
    ],
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  preferences: {
    autopilotEnabled: true,
    approvalRequiredForPublishing: true,
    preferredLanguage: "en-GB",
    timezone: "Europe/London",
    notificationPreferences: ["daily_brief", "approval_required", "wins"],
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  history: {
    entries: [
      {
        id: "hist-1",
        summary: "Homepage welcome message simplified",
        category: "optimisation",
        occurredAt: "2026-07-06T14:30:00.000Z",
      },
      {
        id: "hist-2",
        summary: "New service page draft created",
        category: "content",
        occurredAt: "2026-07-06T16:00:00.000Z",
      },
      {
        id: "hist-3",
        summary: "Competitor landscape reviewed",
        category: "scout",
        occurredAt: "2026-07-06T18:00:00.000Z",
      },
    ],
    updatedAt: "2026-07-07T00:00:00.000Z",
  },

  learning: [
    {
      id: "learn-1",
      insight: "Emergency repair searches peak in winter months",
      source: "analyst",
      learnedAt: "2026-07-05T10:00:00.000Z",
    },
    {
      id: "learn-2",
      insight: "Shorter sentences improve homepage engagement",
      source: "optimiser",
      learnedAt: "2026-07-06T14:30:00.000Z",
    },
  ],

  seasonality: [
    {
      id: "season-1",
      label: "Winter heating demand",
      peakMonths: [11, 12, 1, 2],
      notes: "Boiler repair interest rises sharply in cold months.",
    },
  ],
};
