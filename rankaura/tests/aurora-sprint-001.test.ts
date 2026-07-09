import { runOnboardingTests } from "@/components/onboarding/tests/onboarding.test";
import { runActivityEngineTests } from "@/services/activity/tests/activityEngine.test";
import { runMissionModeTests } from "@/components/mission-mode/tests/missionMode.test";
import { runMissionComponentTests } from "@/components/mission-workspace/tests/missionComponents.test";
import { runMissionWorkspaceTests } from "@/components/mission-workspace/tests/missionWorkspace.test";
import { runMissionCardTests } from "@/components/dashboard/tests/missionCard.test";
import { runMissionReviewTests } from "@/components/dashboard/tests/missionReview.test";
import { runMissionApprovalTests } from "@/components/dashboard/tests/missionApproval.test";
import { runDashboardServiceTests } from "@/services/dashboard/tests/dashboard.service.test";
import { runMissionServiceTests } from "@/services/mission/tests/missionService.test";

export async function runAuroraSprintTests(): Promise<{ passed: number; failed: number }> {
  const service = await runDashboardServiceTests();
  const missionCard = runMissionCardTests();
  const missionReview = runMissionReviewTests();
  const approval = runMissionApprovalTests();
  const missionService = await runMissionServiceTests();
  const workspace = runMissionWorkspaceTests();
  const missionComponents = runMissionComponentTests();
  const missionMode = runMissionModeTests();
  const onboarding = await runOnboardingTests();
  const activityEngine = runActivityEngineTests();

  return {
    passed:
      service.passed +
      missionCard.passed +
      missionReview.passed +
      approval.passed +
      missionService.passed +
      workspace.passed +
      missionComponents.passed +
      missionMode.passed +
      onboarding.passed +
      activityEngine.passed,
    failed:
      service.failed +
      missionCard.failed +
      missionReview.failed +
      approval.failed +
      missionService.failed +
      workspace.failed +
      missionComponents.failed +
      missionMode.failed +
      onboarding.failed +
      activityEngine.failed,
  };
}
