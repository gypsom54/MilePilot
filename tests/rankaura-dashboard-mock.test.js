/**
 * RankAura dashboard mock coherence + data-layer swap contract.
 */
const assert = (cond, msg) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("OK:", msg);
  }
};

const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..", "rankaura-web");
const mockSrc = fs.readFileSync(
  path.join(root, "services", "dashboard", "mockDashboardProvider.ts"),
  "utf8"
);
const indexSrc = fs.readFileSync(
  path.join(root, "services", "dashboard", "index.ts"),
  "utf8"
);
const pageSrc = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");
const homeSrc = fs.readFileSync(
  path.join(root, "components", "dashboard", "DashboardHome.tsx"),
  "utf8"
);

assert(mockSrc.includes("Northern Materials Co."), "mock business identity");
assert(mockSrc.includes("Good evening Jonathan"), "locked greeting");
assert(mockSrc.includes("12 improvements today · 2.8 hrs saved"), "locked stats line");
assert(mockSrc.includes("Create Research Storage Conditions Guide"), "locked priority mission");
assert(mockSrc.includes("Review Mission"), "locked CTA");
assert(mockSrc.includes("Today's Mission"), "today mission title");
assert(mockSrc.includes("The one thing that matters most today"), "today mission support");
assert(mockSrc.includes("aiTeam"), "AI Team status in mock");
assert(mockSrc.includes("websiteHealth"), "Website health in mock");
assert(mockSrc.includes("growthOpportunities"), "Growth opportunities in mock");

assert(indexSrc.includes("activeProvider"), "single swap point exists");
assert(indexSrc.includes("setDashboardDataProvider"), "provider can be replaced");
assert(indexSrc.includes("mockDashboardProvider"), "defaults to mock provider");

assert(pageSrc.includes("getDashboardData"), "page uses data layer");
assert(homeSrc.includes("EveningBriefCard"), "home uses brief card");
assert(homeSrc.includes("TodaysMissionCard"), "home uses today mission card");
assert(
  !homeSrc.includes("Website Health") && !homeSrc.includes("Growth Opportunities"),
  "home does not invent new locked-layout sections"
);

if (process.exitCode) {
  console.error("\nDashboard mock contract failed.");
  process.exit(1);
}
console.log("\nDashboard mock contract passed.");
