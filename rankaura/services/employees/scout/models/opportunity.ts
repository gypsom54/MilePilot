/**
 * Scout opportunity model.
 * Research findings converted into actionable growth opportunities.
 */

export type ScoutOpportunityStatus = "new" | "reviewing" | "accepted" | "dismissed";

export interface ScoutOpportunity {
  id: string;
  businessId: string;
  title: string;
  description: string;
  searchIntentId: string;
  estimatedVisitors: number;
  potentialLeads: number;
  confidence: number;
  priority: "low" | "medium" | "high";
  score: number;
  status: ScoutOpportunityStatus;
  source: "website" | "competitor" | "trend" | "intent";
  discoveredAt: string;
  updatedAt: string;
}
