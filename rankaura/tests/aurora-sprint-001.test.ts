import { runMissionApprovalTests } from "@/components/dashboard/tests/missionApproval.test";
import { runMissionCardTests } from "@/components/dashboard/tests/missionCard.test";
import { runMissionReviewTests } from "@/components/dashboard/tests/missionReview.test";
import { runDashboardServiceTests } from "@/services/dashboard/tests/dashboard.service.test";

export async function runAuroraSprintTests(): Promise<{ passed: number; failed: number }> {
  const service = await runDashboardServiceTests();
  const missionCard = runMissionCardTests();
  const missionReview = runMissionReviewTests();
  const approval = runMissionApprovalTests();

  return {
    passed: service.passed + missionCard.passed + missionReview.passed + approval.passed,
    failed: service.failed + missionCard.failed + missionReview.failed + approval.failed,
  };
}
