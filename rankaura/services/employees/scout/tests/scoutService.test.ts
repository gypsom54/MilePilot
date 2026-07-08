import { scoutService } from "@/services/employees/scout/scoutService";

export async function runScoutServiceTests(): Promise<{ passed: number; failed: number }> {
  const context = { businessId: "biz_rankaura_demo", requestedBy: "auracore" as const };
  let passed = 0;
  let failed = 0;

  const analysis = await scoutService.analyse(context);
  if (analysis.findings.length > 0) passed++;
  else failed++;

  const discovery = await scoutService.discover(context);
  if (discovery.itemsDiscovered >= 0) passed++;
  else failed++;

  const prioritised = await scoutService.prioritise(context);
  if (prioritised.items.length > 0) passed++;
  else failed++;

  const summary = await scoutService.summarise(context);
  if (summary.headline) passed++;
  else failed++;

  const recommendations = await scoutService.recommend(context);
  if (recommendations.recommendations.length > 0) passed++;
  else failed++;

  return { passed, failed };
}
