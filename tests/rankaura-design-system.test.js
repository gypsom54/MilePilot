/**
 * Design system / Ask contract — Ask copies approved onboarding format.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const askDir = path.join(root, "rankaura-web", "components", "ask-rankaura");
const askInput = fs.readFileSync(path.join(askDir, "AskRankAuraInput.tsx"), "utf8");
const askCard = fs.readFileSync(path.join(askDir, "AskRankAuraCard.tsx"), "utf8");
const askSuggestions = fs.readFileSync(
  path.join(askDir, "AskRankAuraSuggestions.tsx"),
  "utf8",
);
const askAnswer = fs.readFileSync(path.join(askDir, "AskRankAuraAnswer.tsx"), "utf8");
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
const onboardingFields = fs.readFileSync(
  path.join(
    root,
    "rankaura-web",
    "components",
    "onboarding",
    "OnboardingFields.tsx",
  ),
  "utf8",
);
const globals = fs.readFileSync(
  path.join(root, "rankaura-web", "app", "globals.css"),
  "utf8",
);

assert.ok(askInput.includes("OnboardingInput"));
assert.ok(askInput.includes("OnboardingPrimaryButton"));
assert.ok(askInput.includes("Ask RankAura"));
assert.ok(!askInput.includes('from "@/components/ui/Input"'));
assert.ok(!askInput.includes("<Input"));
assert.ok(askSuggestions.includes("→"));
assert.ok(!askSuggestions.includes("ButtonSecondary"));
assert.ok(!askSuggestions.includes("QuestionChip"));
assert.ok(!askSuggestions.includes("rounded-full"));
assert.ok(!askCard.includes("accent"));
assert.ok(askCard.includes("SurfaceCard"));
assert.ok(askAnswer.includes("OnboardingPrimaryButton"));
assert.ok(!askAnswer.includes("ButtonSecondary"));
assert.ok(onboardingFields.includes("border-0 border-b border-[#080f1a]"));
assert.ok(onboardingFields.includes("placeholder:text-[#3d4654]"));
assert.ok(onboardingFields.includes("rounded-full"));
assert.ok(globals.includes("--ra-disabled-bg: #3d4654"));
assert.ok(globals.includes("--ra-disabled-fg: #ffffff"));
assert.ok(mock.includes("Ask about your business"));
assert.ok(mock.includes("Which recommendations need my approval?"));

console.log("rankaura-design-system.test.js: OK");
