import {
  buildBusinessSnapshot,
  buildMorningBrief,
  createInitialActivityState,
  getBriefPeriod,
  getStateLabel,
  isValidStateTransition,
  tickActivityEngine,
} from "@/services/activity/activityEngine";
import { mockTodayMission } from "@/lib/mock-dashboard";

export function runActivityEngineTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  assert(getBriefPeriod(9) === "morning");
  assert(getBriefPeriod(20) === "evening");
  assert(getStateLabel("researching") === "Researching");
  assert(isValidStateTransition("idle", "researching"));
  assert(!isValidStateTransition("idle", "invalid" as never));

  const initial = createInitialActivityState();
  assert(initial.departments.length === 6);
  assert(initial.timeline.length >= 4);
  assert(initial.departments.every((d) => d.stateLabel.length > 0));

  const ticked = tickActivityEngine(initial);
  assert(ticked.tick === 1);
  assert(ticked.departments.length === initial.departments.length);

  const ticked3 = tickActivityEngine(tickActivityEngine(tickActivityEngine(initial)));
  assert(ticked3.timeline.length >= initial.timeline.length);

  const brief = buildMorningBrief(mockTodayMission, 12, 2.8);
  assert(brief.title === "Morning Brief" || brief.title === "Evening Brief");
  assert(brief.ctaLabel === "Review Mission");

  const snapshot = buildBusinessSnapshot(14, 2.8, 1);
  assert(snapshot.growthPercent === 14);
  assert(snapshot.pendingReviews === 1);

  return { passed, failed };
}
