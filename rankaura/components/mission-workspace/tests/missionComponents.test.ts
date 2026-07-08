import { DEPLOYMENT_STEPS } from "@/components/mission-workspace/DeploymentAnimation";
import { ApprovalPanel } from "@/components/mission-workspace/ApprovalPanel";
import { ArchitecturePlan } from "@/components/mission-workspace/ArchitecturePlan";
import { AuraBrief } from "@/components/mission-workspace/AuraBrief";
import { BusinessImpactGrid } from "@/components/mission-workspace/BusinessImpactGrid";
import { DepartmentContributionCard } from "@/components/mission-workspace/DepartmentContributionCard";
import { DepartmentWorkflow } from "@/components/mission-workspace/DepartmentWorkflow";
import { DraftPreview } from "@/components/mission-workspace/DraftPreview";
import { MissionHeader } from "@/components/mission-workspace/MissionHeader";
import { MissionWorkspacePage } from "@/components/mission-workspace/MissionWorkspacePage";

export function runMissionComponentTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(typeof MissionWorkspacePage === "function");
  assert(typeof MissionHeader === "function");
  assert(typeof AuraBrief === "function");
  assert(typeof DepartmentWorkflow === "function");
  assert(typeof DepartmentContributionCard === "function");
  assert(typeof DraftPreview === "function");
  assert(typeof ArchitecturePlan === "function");
  assert(typeof BusinessImpactGrid === "function");
  assert(typeof ApprovalPanel === "function");
  assert(DEPLOYMENT_STEPS.length === 6);

  return { passed, failed };
}
