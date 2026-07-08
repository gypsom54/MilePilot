import { runMissionApprovalTests } from "@/components/dashboard/tests/missionApproval.test";
import { runMissionCardTests } from "@/components/dashboard/tests/missionCard.test";
import { runDashboardServiceTests } from "@/services/dashboard/tests/dashboard.service.test";

export async function runAuroraSprintTests(): Promise<{ passed: number; failed: number }> {
  const service = await runDashboardServiceTests();
  const missionCard = runMissionCardTests();
  const approval = runMissionApprovalTests();

  return {
    passed: service.passed + missionCard.passed + approval.passed,
    failed: service.failed + missionCard.failed + approval.failed,
  };
}

runAuroraSprintTests().then((result) => {
  console.log("Aurora Sprint 001 tests:", result);
  process.exit(result.failed > 0 ? 1 : 0);
});
