import { opportunityInbox } from "@/services/employees/scout/inbox/opportunityInbox";

export async function runInboxTests(): Promise<{ passed: number; failed: number }> {
  const inbox = await opportunityInbox.getInbox("biz_rankaura_demo");
  return {
    passed: inbox.newCount > 0 ? 1 : 0,
    failed: inbox.newCount > 0 ? 0 : 1,
  };
}
