/**
 * Scout mock data — no APIs, no scraping.
 */

import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";
import type { SearchIntent } from "@/services/employees/scout/models/search-intent";
import { MOCK_BUSINESS_ID } from "@/services/memory/mock/mockMemoryStore";

export const MOCK_SEARCH_INTENTS: SearchIntent[] = [
  {
    id: "intent-1",
    label: "Emergency boiler repair near me",
    description: "Homeowners urgently seeking same-day boiler repair in the local area.",
    type: "local",
    estimatedMonthlySearches: 2400,
    relevanceScore: 96,
    seasonality: "Peaks November–February",
    discoveredAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "intent-2",
    label: "Annual boiler service plans",
    description: "Customers comparing predictable maintenance packages for peace of mind.",
    type: "commercial",
    estimatedMonthlySearches: 880,
    relevanceScore: 84,
    seasonality: "Steady year-round",
    discoveredAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "intent-3",
    label: "How to know if boiler needs replacing",
    description: "Information-seeking visitors who may convert to service calls.",
    type: "informational",
    estimatedMonthlySearches: 1200,
    relevanceScore: 72,
    seasonality: null,
    discoveredAt: "2026-07-07T00:00:00.000Z",
  },
];

export const MOCK_SCOUT_OPPORTUNITIES: ScoutOpportunity[] = [
  {
    id: "scout-opp-1",
    businessId: MOCK_BUSINESS_ID,
    title: "Emergency Boiler Repair",
    description: "High demand in your area — customers are actively looking for this service.",
    searchIntentId: "intent-1",
    estimatedVisitors: 420,
    potentialLeads: 14,
    confidence: 96,
    priority: "high",
    score: 92,
    status: "new",
    source: "trend",
    discoveredAt: "2026-07-07T00:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "scout-opp-2",
    businessId: MOCK_BUSINESS_ID,
    title: "Annual Service Plans",
    description: "A growing number of homeowners prefer predictable maintenance packages.",
    searchIntentId: "intent-2",
    estimatedVisitors: 180,
    potentialLeads: 6,
    confidence: 84,
    priority: "medium",
    score: 78,
    status: "new",
    source: "competitor",
    discoveredAt: "2026-07-07T00:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "scout-opp-3",
    businessId: MOCK_BUSINESS_ID,
    title: "Boiler replacement guide",
    description: "Create a helpful guide that turns information seekers into customers.",
    searchIntentId: "intent-3",
    estimatedVisitors: 95,
    potentialLeads: 3,
    confidence: 71,
    priority: "medium",
    score: 65,
    status: "reviewing",
    source: "website",
    discoveredAt: "2026-07-06T18:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z",
  },
];
