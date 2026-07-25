/**
 * Website analyser test specifications.
 * Executable when test runner is configured in Phase 2.
 */

import { websiteAnalyser } from "@/services/employees/scout/analysers/website/websiteAnalyser";

export async function runWebsiteAnalyserTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const result = await websiteAnalyser.analyse({
    businessId: "test",
    websiteUrl: "https://example.com",
  });

  if (result.findings.length > 0) {
    passed++;
  } else {
    failed++;
  }

  if (result.pagesReviewed > 0) {
    passed++;
  } else {
    failed++;
  }

  return { passed, failed };
}
