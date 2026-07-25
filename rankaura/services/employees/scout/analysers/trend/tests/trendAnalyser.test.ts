import { trendAnalyser } from "@/services/employees/scout/analysers/trend/trendAnalyser";

export async function runTrendAnalyserTests(): Promise<{ passed: number; failed: number }> {
  const result = await trendAnalyser.analyse({ businessId: "test", market: "Manchester" });
  return {
    passed: result.findings.some((f) => f.direction === "rising") ? 1 : 0,
    failed: result.findings.some((f) => f.direction === "rising") ? 0 : 1,
  };
}
