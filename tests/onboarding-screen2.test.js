/**
 * MP-UX-LOCK-002 / MP-UX-LOCK-002A — Screen 2 MilePilot Introduction contract tests.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "frontend/index.html"), "utf8");
const mirror = fs.readFileSync(path.join(root, "milepilot-upload-v2/index.html"), "utf8");
const mainHtml = execSync("git show main:frontend/index.html", { cwd: root, encoding: "utf8" });

const CURLY = "\u2019";
const STRAIGHT_FORBIDDEN = ["I'm", "I'll", "Let's"];

function extractWelcomeSection(src) {
  const m = src.match(/<section id="welcome"[\s\S]*?<\/section>/);
  assert.ok(m, "welcome section");
  return m[0];
}

function extractIntroductionSection(src) {
  const m = src.match(/<section id="introduction"[\s\S]*?<\/section>/);
  assert.ok(m, "introduction section");
  return m[0];
}

const EXACT_COPY = {
  eyebrow: "MEET MILEPILOT",
  heading: "Hi, I\u2019m MilePilot.",
  primary: "I\u2019m here to make self-employed life simpler.",
  supporting:
    "I\u2019ll help you track your mileage, reduce your admin and stay on top of your business \u2014 so you have more time for the work that matters.",
  promise: "Less admin. More time for your business.",
  cta: "Let\u2019s get started",
  placeholder: "Next onboarding screen awaiting approval.",
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log("✓ " + name);
    passed++;
  } catch (e) {
    console.error("✗ " + name + ": " + e.message);
    failed++;
  }
}

function forBoth(label, fn) {
  test(label + " (frontend)", () => fn(html));
  test(label + " (mirror)", () => fn(mirror));
}

forBoth("splash still present and locked", (src) => {
  assert.match(src, /id="welcome"/);
  assert.match(src, /data-mp="MP-001"/);
  assert.match(src, /data-locked="true"/);
  assert.match(src, /Run your business on/);
});

forBoth("splash routes to Screen 2 via startOnboardingName (HTML unchanged)", (src) => {
  assert.match(src, /welcome-get-started[^>]*onclick="startOnboardingName\(\)"/);
  assert.doesNotMatch(src, /welcome-get-started[^>]*onclick="startIntroduction\(\)"/);
  assert.match(src, /function startOnboardingName\(\)\{if\(isNewUserUxLockFlow\(\)\)\{startIntroduction\(\);return\}/);
});

forBoth("Screen 2 section exists", (src) => {
  assert.match(src, /id="introduction"/);
  assert.match(src, /data-mp="MP-UX-LOCK-002"/);
});

forBoth("exact approved copy on Screen 2", (src) => {
  const introBlock = extractIntroductionSection(src);
  assert.ok(introBlock.includes(EXACT_COPY.eyebrow), "eyebrow");
  assert.ok(introBlock.includes(EXACT_COPY.heading), "heading");
  assert.ok(introBlock.includes(EXACT_COPY.primary), "primary");
  assert.ok(introBlock.includes(EXACT_COPY.supporting), "supporting");
  assert.ok(introBlock.includes(EXACT_COPY.promise), "promise");
  assert.ok(introBlock.includes(">" + EXACT_COPY.cta + "<"), "cta button text");
  assert.ok(introBlock.includes('aria-label="' + EXACT_COPY.cta + '"'), "cta aria-label");
});

forBoth("Screen 2 rejects straight apostrophes (MP-UX-LOCK-002A)", (src) => {
  const introBlock = extractIntroductionSection(src);
  for (const bad of STRAIGHT_FORBIDDEN) {
    assert.ok(!introBlock.includes(bad), "must not contain straight form: " + bad);
  }
  assert.ok(introBlock.includes("I" + CURLY + "m MilePilot"), "curly I" + CURLY + "m in heading");
  assert.ok(introBlock.includes("I" + CURLY + "m here"), "curly I" + CURLY + "m in primary");
  assert.ok(introBlock.includes("I" + CURLY + "ll help"), "curly I" + CURLY + "ll in supporting");
  assert.ok(introBlock.includes("Let" + CURLY + "s get started"), "curly Let" + CURLY + "s in CTA");
});

test("splash welcome section byte-identical to main", () => {
  const mainWelcome = extractWelcomeSection(mainHtml);
  const currWelcome = extractWelcomeSection(html);
  assert.equal(currWelcome, mainWelcome, "welcome section must match main exactly");
});

forBoth("single primary action on Screen 2", (src) => {
  const introBlock = src.match(/<section id="introduction"[\s\S]*?<\/section>/);
  assert.ok(introBlock, "introduction section");
  const buttons = [...introBlock[0].matchAll(/<button/g)];
  assert.equal(buttons.length, 1, "exactly one button on introduction");
});

forBoth("no name input on Screen 2", (src) => {
  const introBlock = src.match(/<section id="introduction"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(introBlock, /<input/);
  assert.doesNotMatch(introBlock, /onboardName/);
});

forBoth("no vehicle UI on Screen 2", (src) => {
  const introBlock = src.match(/<section id="introduction"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(introBlock, /vehicle-card/);
  assert.doesNotMatch(introBlock, /vehicle-grid/);
});

forBoth("no permission language on Screen 2", (src) => {
  const introBlock = src.match(/<section id="introduction"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(introBlock, /permission/i);
  assert.doesNotMatch(introBlock, /GPS/i);
  assert.doesNotMatch(introBlock, /location/i);
  assert.doesNotMatch(introBlock, /AutoPilot/i);
});

forBoth("no progress numbering on Screen 2", (src) => {
  const introBlock = src.match(/<section id="introduction"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(introBlock, /Step \d+ of/i);
  assert.doesNotMatch(introBlock, /onboard-progress/);
});

forBoth("dev placeholder after introduction", (src) => {
  assert.ok(src.includes(EXACT_COPY.placeholder));
  assert.match(src, /id="onboardAwaiting"/);
  assert.match(src, /function finishIntroduction/);
});

forBoth("legacy onboarding guarded", (src) => {
  assert.match(src, /function guardUxLockScreen/);
  assert.match(src, /UX_LOCK_LEGACY_BLOCKED/);
  assert.match(src, /guardUxLockScreen\(id\)/);
});

forBoth("completed users guard bypass", (src) => {
  assert.match(src, /mp_onboard_complete.*!==.*'true'/);
  assert.match(src, /if\(complete\)/);
  assert.match(src, /goHome\(\)/);
});

forBoth("accessible button name", (src) => {
  assert.match(src, /id="mpIntroContinue"/);
  assert.match(src, /aria-label="Let\u2019s get started"/);
});

forBoth("responsive / safe-area CSS present", (src) => {
  assert.match(src, /#introduction\.active/);
  assert.match(src, /safe-area-inset/);
  assert.match(src, /mp-intro-cta/);
  assert.match(src, /min-height:52px/);
});

forBoth("UX lock register constant", (src) => {
  assert.match(src, /MP_UX_LOCK_002/);
  assert.match(src, /MP_UX_LOCK_002A/);
  assert.match(src, /MP_UX002_COPY/);
});

test("docs/MILEPILOT-UX-LOCK-REGISTER.md locked per MP-UX-LOCK-002A", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 1.*LOCKED/s);
  assert.match(doc, /Screen 2.*LOCKED/s);
  assert.match(doc, /MP-UX-LOCK-002A/);
  assert.match(doc, /NOT STARTED/);
  assert.ok(doc.includes("Hi, I" + CURLY + "m MilePilot."), "register records curly heading");
  assert.ok(!doc.includes("I'm MilePilot"), "register must not use straight apostrophe in heading");
});

test("tracking engine files present (protected)", () => {
  const trackingFiles = [
    "frontend/js/autopilot-motion.js",
    "frontend/js/tracking-provider.js",
    "src/expoLocationBridge.js",
  ];
  for (const rel of trackingFiles) {
    assert.ok(fs.existsSync(path.join(root, rel)), rel + " exists");
  }
  assert.match(html, /function initTrackingEngine\(/);
  assert.match(html, /function ensureAutopilotArmed\(/);
});

console.log("\nOnboarding Screen 2: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
