/**
 * Mission Mode engine — simulates live AI company activity.
 */

import {
  AURA_INSIGHTS,
  EMPLOYEE_ACTIVITY_POOL,
  FEED_EVENT_POOL,
  PIPELINE_EMPLOYEES,
  SEED_FEED_EVENTS,
} from "@/lib/mock-mission-mode";
import type { MissionModeState, PipelineEmployee } from "@/types/mission-mode";

function formatFeedTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function cloneEmployees(employees: PipelineEmployee[]): PipelineEmployee[] {
  return employees.map((e) => ({ ...e }));
}

export function createInitialMissionModeState(): MissionModeState {
  return {
    employees: cloneEmployees(PIPELINE_EMPLOYEES),
    feed: [...SEED_FEED_EVENTS],
    auraInsight: AURA_INSIGHTS[0],
    missionProgress: 94,
    tick: 0,
  };
}

function pickActivity(employeeId: string, tick: number): string {
  const pool = EMPLOYEE_ACTIVITY_POOL[employeeId] ?? ["Working..."];
  return pool[tick % pool.length];
}

function bumpProgress(employee: PipelineEmployee, tick: number): PipelineEmployee {
  if (employee.status === "complete") return employee;
  if (employee.status === "waiting") return employee;

  const nextProgress = Math.min(99, employee.progress + (tick % 3 === 0 ? 2 : 1));
  return {
    ...employee,
    progress: nextProgress,
    activity: pickActivity(employee.id, tick),
    status: nextProgress >= 95 ? "complete" : "working",
  };
}

export function tickMissionModeEngine(state: MissionModeState): MissionModeState {
  const tick = state.tick + 1;
  const eventTemplate = FEED_EVENT_POOL[tick % FEED_EVENT_POOL.length];
  const newEvent = {
    id: `feed-${Date.now()}-${tick}`,
    time: formatFeedTime(),
    ...eventTemplate,
  };

  const employees = state.employees.map((emp) => bumpProgress(emp, tick));
  const auraInsight = AURA_INSIGHTS[tick % AURA_INSIGHTS.length];
  const missionProgress = Math.min(99, state.missionProgress + (tick % 4 === 0 ? 1 : 0));

  return {
    employees,
    feed: [newEvent, ...state.feed].slice(0, 24),
    auraInsight,
    missionProgress,
    tick,
  };
}

export function getEmployeeById(
  employees: PipelineEmployee[],
  id: string,
): PipelineEmployee | undefined {
  return employees.find((e) => e.id === id);
}
