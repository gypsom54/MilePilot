import {
  createInitialMissionModeState,
  tickMissionModeEngine,
} from "@/services/mission-mode/missionModeEngine";
import { PIPELINE_EMPLOYEES, mockMissionDocument } from "@/lib/mock-mission-mode";
import { MISSION_MODE_DEPLOYMENT_EMPLOYEES } from "@/types/mission-mode";
import { MissionMode } from "@/components/mission-mode/MissionMode";
import { MissionPipeline } from "@/components/mission-mode/MissionPipeline";
import { LiveAIFeed } from "@/components/mission-mode/LiveAIFeed";
import { AuraAssistant } from "@/components/mission-mode/AuraAssistant";
import { MissionDocument } from "@/components/mission-mode/MissionDocument";
import { MissionModeDeployment } from "@/components/mission-mode/MissionModeDeployment";

export function runMissionModeTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(typeof MissionMode === "function");
  assert(typeof MissionPipeline === "function");
  assert(typeof LiveAIFeed === "function");
  assert(typeof AuraAssistant === "function");
  assert(typeof MissionDocument === "function");
  assert(typeof MissionModeDeployment === "function");

  assert(PIPELINE_EMPLOYEES.length === 7);
  assert(PIPELINE_EMPLOYEES.some((e) => e.name === "Scout"));
  assert(PIPELINE_EMPLOYEES.some((e) => e.name === "Publisher"));

  assert(mockMissionDocument.sections.length === 8);
  assert(mockMissionDocument.sections.some((s) => s.id === "faq"));
  assert(mockMissionDocument.sections.some((s) => s.id === "seo"));

  const initial = createInitialMissionModeState();
  assert(initial.feed.length >= 5);
  assert(initial.missionProgress === 94);
  assert(initial.employees.length === 7);

  const ticked = tickMissionModeEngine(initial);
  assert(ticked.tick === 1);
  assert(ticked.feed.length >= initial.feed.length);
  assert(ticked.feed[0].time.length >= 4);

  assert(MISSION_MODE_DEPLOYMENT_EMPLOYEES.length === 5);
  assert(MISSION_MODE_DEPLOYMENT_EMPLOYEES[0] === "scout");
  assert(MISSION_MODE_DEPLOYMENT_EMPLOYEES[4] === "publisher");

  return { passed, failed };
}
