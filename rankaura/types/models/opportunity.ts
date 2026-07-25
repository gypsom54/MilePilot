export type OpportunityPriority = "low" | "medium" | "high";

export interface Opportunity {
  id: string;
  businessId: string;
  title: string;
  description: string;
  estimatedVisitors: number;
  potentialLeads: number;
  confidence: number;
  priority: OpportunityPriority;
  sourceEmployeeId: string;
  createdAt: string;
  updatedAt: string;
}
