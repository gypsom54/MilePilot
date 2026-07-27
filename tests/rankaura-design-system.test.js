/**
 * Design system contract — tokens and reusable UI components exist.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const tokens = fs.readFileSync(
  path.join(root, "docs", "DESIGN_TOKENS.md"),
  "utf8",
);
const globals = fs.readFileSync(
  path.join(root, "rankaura-web", "app", "globals.css"),
  "utf8",
);
const uiDir = path.join(root, "rankaura-web", "components", "ui");
const askInput = fs.readFileSync(
  path.join(
    root,
    "rankaura-web",
    "components",
    "ask-rankaura",
    "AskRankAuraInput.tsx",
  ),
  "utf8",
);
const mock = fs.readFileSync(
  path.join(
    root,
    "rankaura-web",
    "services",
    "askRankAura",
    "mockAskRankAura.ts",
  ),
  "utf8",
);

assert.ok(tokens.includes("--ra-ink") || tokens.includes("`#0B0F19`"));
assert.ok(tokens.includes("ButtonPrimary"));
assert.ok(tokens.includes("Ask about your business"));
assert.ok(globals.includes("--ra-disabled-bg"));
assert.ok(globals.includes("--ra-border-strong"));
assert.ok(globals.includes("--ra-border-accent"));
assert.ok(fs.existsSync(path.join(root, "docs", "DESIGN_SYSTEM.md")));
assert.ok(fs.existsSync(path.join(uiDir, "ButtonPrimary.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "ButtonSecondary.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "ButtonGhost.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "Badge.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "Input.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "QuestionChip.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "TimelineItem.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "GrowthCard.tsx")));
assert.ok(fs.existsSync(path.join(uiDir, "RecommendationCard.tsx")));
assert.ok(askInput.includes("ButtonPrimary"));
assert.ok(askInput.includes("Input"));
assert.ok(mock.includes("Ask about your business"));
assert.ok(!mock.includes("What would you like to know?"));

console.log("rankaura-design-system.test.js: OK");
