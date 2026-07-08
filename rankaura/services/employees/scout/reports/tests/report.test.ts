import { reportService } from "@/services/employees/scout/reports/reportService";

export async function runReportTests(): Promise<{ passed: number; failed: number }> {
  const daily = await reportService.generateDaily("biz_rankaura_demo");
  const weekly = await reportService.generateWeekly("biz_rankaura_demo");
  const monthly = await reportService.generateMonthly("biz_rankaura_demo");

  const passed = [daily, weekly, monthly].filter((r) => r.opportunities.length > 0).length;
  return { passed, failed: 3 - passed };
}
