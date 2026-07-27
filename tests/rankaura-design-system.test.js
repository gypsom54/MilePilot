/**
 * Design system contract — Ask must reuse Workspace shared controls only.
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
const askDir = path.join(root, "rankaura-web", "components", "ask-rankaura");
const askInput = fs.readFileSync(path.join(askDir, "AskRankAuraInput.tsx"), "utf8");
const askCard = fs.readFileSync(path.join(askDir, "AskRankAuraCard.tsx"), "utf8");
const askSuggestions = fs.readFileSync(
  path.join(askDir, "AskRankAuraSuggestions.tsx"),
  "utf8",
);
const askAnswer = fs.readFileSync(path.join(askDir, "AskRankAuraAnswer.tsx"), "utf8");
const askSource = fs.readFileSync(
  path.join(askDir, "AskRankAuraSourceNotice.tsx"),
  "utf8",
);
const questionChip = fs.readFileSync(path.join(uiDir, "QuestionChip.tsx"), "utf8");
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
assert.ok(!globals.includes("ra-card-accent"));
assert.ok(askInput.includes("ButtonPrimary"));
assert.ok(askInput.includes("Input"));
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
assert.ok(fs.existsSync(path.join(uiDir, "SuccessMark.tsx")));
const inputUi = fs.readFileSync(path.join(uiDir, "Input.tsx"), "utf8");
const inputCss = globals;
assert.ok(askInput.includes('from "@/components/ui/ButtonPrimary"'));
assert.ok(askInput.includes('from "@/components/ui/Input"'));
assert.ok(askSuggestions.includes('from "@/components/ui/ButtonSecondary"'));
assert.ok(inputUi.includes("ra-input"));
assert.ok(inputCss.includes(".ra-input"));
assert.ok(inputCss.includes("border: 1px solid var(--ra-focus)"));
assert.ok(inputCss.includes("outline: none !important"));
assert.ok(inputCss.includes("box-shadow: none !important"));
assert.ok(!inputUi.includes("shadow-ra-focus"));
assert.ok(!inputUi.includes("outline-ra-focus"));
assert.ok(!askInput.includes("min-w-ra-ask"));
assert.ok(!askInput.includes("min-w-["));
assert.ok(!askCard.includes("accent"));
assert.ok(!askCard.includes("tracking-tight"));
assert.ok(!askCard.includes("sm:text-xl"));
assert.ok(askCard.includes("text-lg font-semibold text-ra-ink"));
assert.ok(askCard.includes("SurfaceCard"));
assert.ok(askSuggestions.includes("ButtonSecondary"));
assert.ok(!askSuggestions.includes("QuestionChip"));
assert.ok(!askSuggestions.includes("h-auto"));
assert.ok(!askSuggestions.includes("whitespace-normal"));
assert.ok(!askSuggestions.includes("justify-start"));
assert.ok(!askAnswer.includes("border-t"));
assert.ok(!askAnswer.includes("outline-ra-focus"));
assert.ok(!askSource.includes("rounded-ra-md border"));
assert.ok(!askSource.includes("bg-ra-neutral-soft"));
assert.ok(questionChip.includes("ButtonSecondary"));
assert.ok(questionChip.includes("BUTTON_SECONDARY_CLASSNAME"));
assert.ok(!questionChip.includes("rounded-ra-lg"));
assert.ok(
  fs
    .readFileSync(path.join(uiDir, "ButtonPrimary.tsx"), "utf8")
    .includes("BUTTON_PRIMARY_CLASSNAME"),
);
assert.ok(
  fs
    .readFileSync(path.join(uiDir, "SurfaceCard.tsx"), "utf8")
    .includes("SURFACE_CARD_CLASSNAME"),
);
assert.ok(
  !fs
    .readFileSync(path.join(uiDir, "SurfaceCard.tsx"), "utf8")
    .includes("ra-card-accent"),
);
assert.ok(
  !fs
    .readFileSync(path.join(uiDir, "SurfaceCard.tsx"), "utf8")
    .includes("accent?:"),
);
assert.ok(!globals.includes("--ra-border-accent"));
assert.ok(
  !fs
    .readFileSync(path.join(root, "rankaura-web", "tailwind.config.js"), "utf8")
    .includes("ra-ask"),
);
assert.ok(mock.includes("Ask about your business"));
assert.ok(!mock.includes("What would you like to know?"));

console.log("rankaura-design-system.test.js: OK");
