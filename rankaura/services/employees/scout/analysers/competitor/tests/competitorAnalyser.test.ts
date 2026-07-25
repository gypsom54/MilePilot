import { competitorAnalyser } from "@/services/employees/scout/analysers/competitor/competitorAnalyser";

export async function runCompetitorAnalyserTests(): Promise<{ passed: number; failed: number }> {
  const result = await competitorAnalyser.analyse({ businessId: "test" });
  return {
    passed: result.findings.length > 0 ? 1 : 0,
    failed: result.findings.length > 0 ? 0 : 1,
  };
}
