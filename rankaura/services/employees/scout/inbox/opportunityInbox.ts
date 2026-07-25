/**
 * Opportunity inbox — holds discovered opportunities awaiting review.
 * State changes are local mock only; production routes through AuraCore.
 */

import { MOCK_SCOUT_OPPORTUNITIES } from "@/services/employees/scout/mock";
import { OPPORTUNITY_INBOX_CONFIG } from "@/services/employees/scout/inbox/config";
import type {
  IOpportunityInbox,
  InboxFilter,
  OpportunityInbox,
} from "@/services/employees/scout/inbox/types";
import type { ScoutOpportunity } from "@/services/employees/scout/models/opportunity";

const inboxRegistry = new Map<string, ScoutOpportunity[]>(
  Object.entries({
    biz_rankaura_demo: structuredClone(MOCK_SCOUT_OPPORTUNITIES),
  }),
);

function applyFilter(items: ScoutOpportunity[], filter?: InboxFilter): ScoutOpportunity[] {
  return items.filter((item) => {
    if (filter?.status && item.status !== filter.status) return false;
    if (filter?.priority && item.priority !== filter.priority) return false;
    return true;
  });
}

export const opportunityInbox: IOpportunityInbox = {
  async getInbox(businessId: string, filter?: InboxFilter): Promise<OpportunityInbox> {
    const items = applyFilter(inboxRegistry.get(businessId) ?? [], filter).slice(
      0,
      OPPORTUNITY_INBOX_CONFIG.maxItems,
    );

    return {
      businessId,
      items,
      totalCount: items.length,
      newCount: items.filter((i) => i.status === "new").length,
      updatedAt: new Date().toISOString(),
    };
  },

  async markReviewing(businessId: string, opportunityId: string): Promise<ScoutOpportunity> {
    const items = inboxRegistry.get(businessId) ?? [];
    const item = items.find((i) => i.id === opportunityId);
    if (!item) throw new Error(`Opportunity not found: ${opportunityId}`);
    item.status = "reviewing";
    item.updatedAt = new Date().toISOString();
    return { ...item };
  },

  async dismiss(businessId: string, opportunityId: string): Promise<ScoutOpportunity> {
    const items = inboxRegistry.get(businessId) ?? [];
    const item = items.find((i) => i.id === opportunityId);
    if (!item) throw new Error(`Opportunity not found: ${opportunityId}`);
    item.status = "dismissed";
    item.updatedAt = new Date().toISOString();
    return { ...item };
  },
};
