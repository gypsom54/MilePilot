import { researchPipeline } from "@/services/employees/scout/pipeline/pipelineService";

export async function runPipelineTests(): Promise<{ passed: number; failed: number }> {
  const result = await researchPipeline.run({
    businessId: "biz_rankaura_demo",
    market: "Manchester",
    websiteUrl: "https://example.com",
  });

  return {
    passed: result.stages.length === 5 && result.opportunities.length > 0 ? 1 : 0,
    failed: result.stages.length === 5 && result.opportunities.length > 0 ? 0 : 1,
  };
}
