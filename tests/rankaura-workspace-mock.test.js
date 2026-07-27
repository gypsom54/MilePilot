/**
 * Workspace mock contract checks — final polish.
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
const types = fs.readFileSync(path.join(root, "types", "workspace.ts"), "utf8");
const spec = fs.readFileSync(
  path.join(__dirname, "..", "docs", "WORKSPACE_SPEC.md"),
  "utf8",
);

assert.ok(page.includes("RecentWins"));
assert.ok(page.includes("RecentProgress"));
assert.ok(page.includes("BiggestOpportunityCard"));
assert.ok(page.includes("SinceLastVisit"));
assert.ok(mock.includes("We found an opportunity to help more local customers"));
assert.ok(mock.includes("recentWins"));
assert.ok(mock.includes("recentProgress"));
assert.ok(mock.includes("Review Recommendations"));
assert.ok(mock.includes("View Research"));
assert.ok(types.includes("FeaturedItemVariant"));
assert.ok(types.includes("celebration"));
assert.ok(types.includes("milestone"));
assert.ok(!mock.toLowerCase().includes("mission"));
assert.ok(!mock.toLowerCase().includes("portsmouth"));
assert.ok(!mock.includes("Business feed"));
assert.ok(spec.includes("never make customers feel like they have more work"));

console.log("rankaura-workspace-mock.test.js: OK");
