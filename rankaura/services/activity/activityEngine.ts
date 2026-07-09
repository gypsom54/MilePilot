/**
 * AI Activity Engine — simulates live department activity and timeline updates.
 * Mock only — no APIs.
 */

import { mockGrowthTeam, mockTimelineEvents } from "@/lib/mock-dashboard";
import type {
  ActivityEngineState,
  ActivityTimelineEvent,
  BriefPeriod,
  BusinessSnapshotData,
  DepartmentActivity,
  DepartmentActivityState,
  MorningBriefData,
} from "@/types/activity";
import type { DashboardMission } from "@/types/dashboard";
import { getGreeting } from "@/utils/greeting";
import { PLACEHOLDER_USER } from "@/config/placeholders";

const DEPARTMENT_COLORS: Record<string, string> = {
  scout: "var(--color-aura)",
  writer: "var(--color-emerald)",
  architect: "#4f6b9a",
  optimiser: "var(--color-amber)",
  analyst: "var(--color-aura)",
  publisher: "var(--color-text-muted)",
};

const STATE_LABELS: Record<DepartmentActivityState, string> = {
  idle: "Idle",
  researching: "Researching",
  writing: "Writing",
  reviewing: "Reviewing",
  waiting: "Waiting",
  complete: "Complete",
};

const DEPARTMENT_STATE_CYCLES: Record<string, DepartmentActivityState[]> = {
  scout: ["researching", "researching", "complete", "researching"],
  writer: ["writing", "writing", "reviewing", "waiting"],
  architect: ["reviewing", "complete", "reviewing", "complete"],
  optimiser: ["researching", "writing", "researching", "complete"],
  analyst: ["researching", "reviewing", "researching", "complete"],
  publisher: ["waiting", "waiting", "idle", "waiting"],
};

const ACTIVITY_MESSAGES: Record<string, Partial<Record<DepartmentActivityState, string[]>>> = {
  scout: {
    researching: [
      "Scanning customer questions in your market",
      "Comparing competitor guidance pages",
      "Validating search demand signals",
    ],
    complete: ["Research complete — insights shared with Writer"],
    idle: ["Standing by for next research cycle"],
  },
  writer: {
    writing: [
      "Polishing the storage conditions guide",
      "Drafting FAQ answers in plain English",
      "Preparing page metadata",
    ],
    reviewing: ["Self-reviewing draft for clarity"],
    waiting: ["Draft ready — awaiting your review"],
    complete: ["Content package complete"],
  },
  architect: {
    reviewing: [
      "Organising page structure for clarity",
      "Suggesting internal links",
    ],
    complete: ["Structure approved and documented"],
    idle: ["Monitoring site architecture health"],
  },
  optimiser: {
    researching: ["Reviewing existing product pages"],
    writing: ["Refreshing underperforming page copy"],
    complete: ["Page improvements queued"],
  },
  analyst: {
    researching: ["Tracking visitor engagement trends"],
    reviewing: ["Reviewing weekly growth signals"],
    complete: ["Report ready for Morning Brief"],
  },
  publisher: {
    waiting: ["Standing by for your approval"],
    idle: ["Ready to publish when you approve"],
  },
};

const TIMELINE_TEMPLATES: Record<string, string[]> = {
  scout: [
    "Scout identified a new customer question trend",
    "Scout completed market research",
    "Scout validated search demand for storage guidance",
  ],
  writer: [
    "Writer updated the storage guide draft",
    "Writer completed FAQ section",
    "Writer prepared metadata for review",
  ],
  architect: [
    "Architect approved heading structure",
    "Architect suggested internal links",
  ],
  optimiser: [
    "Optimiser refreshed a product page",
    "Optimiser improved page clarity",
  ],
  analyst: [
    "Analyst detected rising engagement",
    "Analyst updated growth forecast",
  ],
  publisher: [
    "Publisher queued content for release",
    "Publisher standing by for approval",
  ],
};

function pickMessage(id: string, state: DepartmentActivityState, tick: number): string {
  const pool = ACTIVITY_MESSAGES[id]?.[state];
  if (!pool?.length) return `${id} is ${STATE_LABELS[state].toLowerCase()}`;
  return pool[tick % pool.length];
}

function pickTimelineMessage(id: string, tick: number): string {
  const pool = TIMELINE_TEMPLATES[id];
  if (!pool?.length) return `${id} posted an update`;
  return pool[tick % pool.length];
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function mapLegacyState(id: string, index: number, tick: number): DepartmentActivityState {
  const cycle = DEPARTMENT_STATE_CYCLES[id] ?? ["idle"];
  return cycle[(tick + index) % cycle.length];
}

function isActiveState(state: DepartmentActivityState): boolean {
  return state !== "idle" && state !== "complete" && state !== "waiting";
}

function computeProgress(state: DepartmentActivityState, tick: number, index: number): number {
  const base = ((tick * 7 + index * 13) % 85) + 10;
  if (state === "complete") return 100;
  if (state === "idle" || state === "waiting") return Math.min(base, 40);
  return Math.min(base + 5, 95);
}

export function getBriefPeriod(hour: number = new Date().getHours()): BriefPeriod {
  return hour < 17 ? "morning" : "evening";
}

export function buildMorningBrief(
  mission: DashboardMission,
  improvementsCount: number,
  hoursSaved: number,
): MorningBriefData {
  const period = getBriefPeriod();
  const title = period === "morning" ? "Morning Brief" : "Evening Brief";

  return {
    period,
    title,
    greeting: `${getGreeting()} ${PLACEHOLDER_USER.firstName} 👋`,
    improvementsCount,
    hoursSaved,
    priorityMissionTitle: mission.title,
    ctaLabel: mission.ctaLabel,
    ctaHref: `/missions/${mission.id}`,
  };
}

export function buildBusinessSnapshot(
  growthPercent: number,
  hoursSaved: number,
  pendingReviews: number,
): BusinessSnapshotData {
  return {
    growthPercent,
    estimatedLeads: "14/month",
    visibilityTrend: "Rising",
    hoursSaved,
    pendingReviews,
    statusLabel: "Healthy",
  };
}

function convertLegacyTimeline(): ActivityTimelineEvent[] {
  const now = Date.now();
  return mockTimelineEvents.map((event, index) => ({
    id: event.id,
    departmentId: event.type === "team" ? "writer" : "system",
    departmentName: event.type === "team" ? "Growth Team" : "Aura",
    departmentColor: event.type === "team" ? "var(--color-emerald)" : "var(--color-text-muted)",
    message: event.title,
    timestamp: event.timestamp,
    createdAt: now - index * 60000,
  }));
}

export function createInitialActivityState(): ActivityEngineState {
  const departments: DepartmentActivity[] = mockGrowthTeam.map((member, index) => {
    const state = mapLegacyState(member.id, index, 0);
    return {
      id: member.id,
      name: member.name,
      state,
      stateLabel: STATE_LABELS[state],
      activityText: pickMessage(member.id, state, 0),
      progress: computeProgress(state, 0, index),
      isActive: isActiveState(state),
      color: DEPARTMENT_COLORS[member.id] ?? "var(--color-aura)",
    };
  });

  return {
    departments,
    timeline: convertLegacyTimeline(),
    tick: 0,
  };
}

export function tickActivityEngine(state: ActivityEngineState): ActivityEngineState {
  const nextTick = state.tick + 1;
  const departments = state.departments.map((dept, index) => {
    const nextState = mapLegacyState(dept.id, index, nextTick);
    return {
      ...dept,
      state: nextState,
      stateLabel: STATE_LABELS[nextState],
      activityText: pickMessage(dept.id, nextState, nextTick),
      progress: computeProgress(nextState, nextTick, index),
      isActive: isActiveState(nextState),
    };
  });

  let timeline = [...state.timeline];

  // Post a new activity update every 3 ticks from a rotating department
  if (nextTick % 3 === 0) {
    const activeDept = departments[nextTick % departments.length];
    const now = new Date();
    const newEvent: ActivityTimelineEvent = {
      id: `activity-${nextTick}-${activeDept.id}`,
      departmentId: activeDept.id,
      departmentName: activeDept.name,
      departmentColor: activeDept.color,
      message: pickTimelineMessage(activeDept.id, nextTick),
      timestamp: formatTime(now),
      createdAt: now.getTime(),
    };
    timeline = [newEvent, ...timeline].slice(0, 12);
  }

  return { departments, timeline, tick: nextTick };
}

export function getStateLabel(state: DepartmentActivityState): string {
  return STATE_LABELS[state];
}

export function isValidStateTransition(
  from: DepartmentActivityState,
  to: DepartmentActivityState,
): boolean {
  const all: DepartmentActivityState[] = [
    "idle",
    "researching",
    "writing",
    "reviewing",
    "waiting",
    "complete",
  ];
  return all.includes(from) && all.includes(to);
}
