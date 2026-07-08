import { editorModule } from "@/services/employees/writer/modules/editor/editorService";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runEditorTests(): Promise<{ passed: number; failed: number }> {
  const draft = { ...MOCK_CONTENT_DRAFT, status: "drafted" as const, body: "Draft content" };
  const result = await editorModule.execute({ draft });
  return { passed: result.draft.editedBody !== null ? 1 : 0, failed: result.draft.editedBody !== null ? 0 : 1 };
}
