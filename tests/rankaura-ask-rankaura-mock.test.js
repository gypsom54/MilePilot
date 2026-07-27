/**
 * Ask RankAura Phase B mock contract checks.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "rankaura-web");
const mock = fs.readFileSync(
  path.join(root, "services", "askRankAura", "mockAskRankAura.ts"),
  "utf8",
);
const card = fs.readFileSync(
  path.join(root, "components", "ask-rankaura", "AskRankAuraCard.tsx"),
  "utf8",
);
const answer = fs.readFileSync(
  path.join(root, "components", "ask-rankaura", "AskRankAuraAnswer.tsx"),
  "utf8",
);
const page = fs.readFileSync(
  path.join(root, "components", "workspace", "WorkspacePage.tsx"),
  "utf8",
);
const types = fs.readFileSync(path.join(root, "types", "askRankAura.ts"), "utf8");
const spec = fs.readFileSync(
  path.join(__dirname, "..", "docs", "ASK_RANKAURA_SPEC.md"),
  "utf8",
);

assert.ok(page.includes("AskRankAuraCard"));
const askUsage = page.indexOf("<AskRankAuraCard");
const opportunityUsage = page.indexOf("<BiggestOpportunityCard");
assert.ok(askUsage > -1 && opportunityUsage > askUsage);
assert.ok(answer.includes("Ask another question"));
assert.ok(card.includes("data-state"));
assert.ok(mock.includes("What is my biggest opportunity today?"));assert.ok(mock.includes("Have my rankings improved?"));
assert.ok(mock.includes("Connect Search Console"));
assert.ok(mock.includes("Nothing urgent needs your attention today."));
assert.ok(mock.includes("google_search_console"));
assert.ok(mock.includes("unavailable"));
assert.ok(mock.includes("fallbackAnswer"));
assert.ok(types.includes("AskRankAuraDataAvailability"));
assert.ok(types.includes("confirmed"));
assert.ok(!mock.toLowerCase().includes("mission"));
assert.ok(!mock.toLowerCase().includes("chatbot"));
assert.ok(!card.toLowerCase().includes("floating"));

// Spec status should be updated to prototype by this phase
assert.ok(
  spec.includes("PROTOTYPE") || spec.includes("PENDING PROTOTYPE") ||
    spec.includes("Phase B"),
);

console.log("rankaura-ask-rankaura-mock.test.js: OK");
