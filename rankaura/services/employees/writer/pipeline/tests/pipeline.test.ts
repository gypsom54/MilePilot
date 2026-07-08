import { reviewPipeline } from "@/services/employees/writer/pipeline/reviewPipeline";
import { editorModule } from "@/services/employees/writer/modules/editor";
import { MOCK_CONTENT_DRAFT } from "@/services/employees/writer/mock";

export async function runPipelineTests(): Promise<{ passed: number; failed: number }> {
  const draft = { ...MOCK_CONTENT_DRAFT, status: "drafted" as const, body: "Draft" };
  const result = await reviewPipeline.run({ draft }, async (reviewerId, d) => {
    if (reviewerId === "editor") {
      const r = await editorModule.execute({ draft: d });
      return r.payload;
    }
    return { reviewerId, score: { reviewerId, score: 80, passed: true, notes: "ok" }, revisionRequest: null, completedAt: new Date().toISOString() };
  });

  return { passed: result.stages.length > 0 ? 1 : 0, failed: result.stages.length > 0 ? 0 : 1 };
}
