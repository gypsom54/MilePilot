/**
 * Workspace mock contract checks.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "rankaura-web");
const mock = fs.readFileSync(
  path.join(root, "services", "workspace", "mockWorkspace.ts"),
  "utf8",
);
const page = fs.readFileSync(
  path.join(root, "components", "workspace", "WorkspacePage.tsx"),
  "utf8",
);
const spec = fs.readFileSync(
  path.join(__dirname, "..", "docs", "WORKSPACE_SPEC.md"),
  "utf8",
);

assert.ok(spec.includes("Today’s Biggest Opportunity") || spec.includes("Today's Biggest Opportunity"));
assert.ok(spec.includes("Since Your Last Visit") || spec.includes("Since your last visit"));
assert.ok(spec.includes("Business Feed") || spec.includes("Business feed"));
assert.ok(page.includes("WorkspaceWelcomeSection"));
assert.ok(page.includes("BiggestOpportunityCard"));
assert.ok(page.includes("SinceLastVisit"));
assert.ok(page.includes("WorkspaceGrowthAreas"));
assert.ok(page.includes("BusinessFeed"));
assert.ok(mock.includes("RankAura has been working on your business"));
assert.ok(!mock.toLowerCase().includes("portsmouth"));
assert.ok(!mock.toLowerCase().includes("northern materials"));
assert.ok(!mock.toLowerCase().includes("mission"));
assert.ok(!mock.toLowerCase().includes("priority mission"));

console.log("rankaura-workspace-mock.test.js: OK");
