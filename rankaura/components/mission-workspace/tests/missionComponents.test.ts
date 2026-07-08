import { DEPLOYMENT_STEPS } from "@/components/mission-workspace/DeploymentAnimation";
import { DepartmentCard } from "@/components/mission-workspace/DepartmentCard";
import { FindingCard } from "@/components/mission-workspace/FindingCard";
import { ApprovalFooter } from "@/components/mission-workspace/ApprovalFooter";
import { MissionHeader } from "@/components/mission-workspace/MissionHeader";

export function runMissionComponentTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(typeof DepartmentCard === "function");
  assert(typeof FindingCard === "function");
  assert(typeof ApprovalFooter === "function");
  assert(typeof MissionHeader === "function");
  assert(DEPLOYMENT_STEPS.map((s) => s.label).join(",") === "Writer,Architect,Publisher,Website Updated");

  return { passed, failed };
}
