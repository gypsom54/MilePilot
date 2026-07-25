import {
  getBusinessHealth,
  getDailyBrief,
  getGrowthTeamStatus,
  getMissionControlData,
  getTimelinePreview,
  getTodayMission,
} from "@/services/dashboard/dashboard.service";

export async function runDashboardServiceTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean) => {
    if (condition) passed++;
    else failed++;
  };

  const data = await getMissionControlData();
  assert(data.greeting.length > 0);
  assert(data.dailyBrief.headline.length > 0);
  assert(data.todayMission.title === "Create Research Storage Conditions Guide");
  assert(data.growthTeam.length >= 4);
  assert(data.businessHealth.status === "healthy");
  assert(data.timelineEvents.length >= 2);

  const brief = await getDailyBrief();
  assert(brief.greeting.length > 0);
  assert(brief.managementTimeMinutes === 2);

  const mission = await getTodayMission();
  assert(mission.confidence === 94);
  assert(mission.ctaLabel === "Review Mission");
  assert(mission.departments.some((d) => d.name === "Guardian"));

  const team = await getGrowthTeamStatus();
  assert(team.some((m) => m.status === "working"));

  const health = await getBusinessHealth();
  assert(health.label === "Healthy");

  const timeline = await getTimelinePreview();
  assert(timeline.length >= 2);

  return { passed, failed };
}
