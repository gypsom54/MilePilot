/**
 * Writer Department mock data.
 */

import type { ContentDraft } from "@/services/employees/writer/models/content-draft";
import { MOCK_BUSINESS_ID } from "@/services/memory/mock/mockMemoryStore";

export const MOCK_DRAFT_ID = "draft-001";

export const MOCK_CONTENT_DRAFT: ContentDraft = {
  id: MOCK_DRAFT_ID,
  businessId: MOCK_BUSINESS_ID,
  title: "Emergency Boiler Repair",
  contentType: "service",
  status: "briefed",
  brief: "Create a helpful service page for emergency boiler repair targeting local homeowners.",
  planSummary: null,
  strategySummary: null,
  body: null,
  editedBody: null,
  version: 1,
  createdAt: "2026-07-08T09:00:00.000Z",
  updatedAt: "2026-07-08T09:00:00.000Z",
};

const draftRegistry = new Map<string, ContentDraft>([
  [MOCK_DRAFT_ID, structuredClone(MOCK_CONTENT_DRAFT)],
]);

export function getMockDraft(draftId: string): ContentDraft | undefined {
  const draft = draftRegistry.get(draftId);
  return draft ? structuredClone(draft) : undefined;
}

export function saveMockDraft(draft: ContentDraft): ContentDraft {
  draftRegistry.set(draft.id, structuredClone(draft));
  return structuredClone(draft);
}
