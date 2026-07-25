import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";

export interface InboxFilter {
  status?: ScoutOpportunity["status"];
  priority?: ScoutOpportunity["priority"];
}

export interface OpportunityInbox {
  businessId: string;
  items: ScoutOpportunity[];
  totalCount: number;
  newCount: number;
  updatedAt: string;
}

export interface IOpportunityInbox {
  getInbox(businessId: string, filter?: InboxFilter): Promise<OpportunityInbox>;
  markReviewing(businessId: string, opportunityId: string): Promise<ScoutOpportunity>;
  dismiss(businessId: string, opportunityId: string): Promise<ScoutOpportunity>;
}
