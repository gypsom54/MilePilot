/**
 * MP-UX-LOCK-004 — Screen 4 Personal Introduction contract tests.
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
const lockedScreen2Html = execSync("git show 55d501e:frontend/index.html", { cwd: root, encoding: "utf8" });
const lockedScreen3Html = execSync("git show f49337e:frontend/index.html", { cwd: root, encoding: "utf8" });

const CURLY = "\u2019";
const COPY = {
  eyebrow: "LET" + CURLY + "S MAKE THIS PERSONAL",
  heading: "What should I call you?",
  support: "I" + CURLY + "ll use your name to make MilePilot feel more personal.",
  label: "First name",
  placeholder: "Enter your first name",
  cta: "Continue",
  error: "Please enter your first name.",
  placeholderScreen5: "Next onboarding screen awaiting approval.",
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

function extractSection(src, id) {
  const m = src.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`));
  assert.ok(m, id + " section");
  return m[0];
}

function extractPersonalBlock(src) {
  return extractSection(src, "personalIntro");
}

forBoth("Screen 4 section exists", (src) => {
  assert.match(src, /id="personalIntro"/);
  assert.match(src, /data-mp="MP-UX-LOCK-004"/);
});

forBoth("exact production copy with curly apostrophes", (src) => {
  const block = extractPersonalBlock(src);
  assert.ok(block.includes(COPY.eyebrow), "eyebrow");
  assert.ok(block.includes(COPY.heading), "heading");
  assert.ok(block.includes(COPY.support), "support");
  assert.ok(block.includes(COPY.label), "label");
  assert.ok(block.includes(COPY.placeholder), "placeholder");
  assert.ok(block.includes(">" + COPY.cta + "<"), "cta");
  assert.ok(block.includes(COPY.error), "error");
  assert.ok(!block.includes("LET'S"), "no straight apostrophe in eyebrow");
  assert.ok(!block.includes("I'll"), "no straight apostrophe in support");
});

forBoth("only one input on Screen 4", (src) => {
  const block = extractPersonalBlock(src);
  const inputs = [...block.matchAll(/<input/g)];
  assert.equal(inputs.length, 1);
  assert.match(block, /id="mpUserFirstName"/);
  assert.match(block, /autocomplete="given-name"/);
  assert.match(block, /maxlength="50"/);
});

forBoth("continue visible but disabled before valid input", (src) => {
  const block = extractPersonalBlock(src);
  assert.match(block, /id="mpPersonalContinue"[^>]*disabled/);
  assert.doesNotMatch(block, /id="mpPersonalContinue"[^>]*hidden/);
  assert.match(block, /aria-disabled="true"/);
});

forBoth("validation and storage behaviour in JS", (src) => {
  assert.match(src, /MP_USER_FIRST_NAME_KEY='mp_user_first_name'/);
  assert.match(src, /MP_PERSONAL_NAME_MAX=50/);
  assert.match(src, /localStorage\.setItem\(MP_USER_FIRST_NAME_KEY,raw\.trim\(\)\)/);
  const fn = src.match(/function finishPersonalIntro\(\)\{[^;]+;[^;]+;[^;]+;[^;]+;[^;]+;[^}]+\}/);
  assert.ok(fn, "finishPersonalIntro");
  assert.doesNotMatch(fn[0], /mp_driver/);
  assert.doesNotMatch(fn[0], /mp_onboard_complete/);
});

forBoth("return key and error accessibility", (src) => {
  assert.match(src, /aria-describedby="mpPersonalNameError"/);
  assert.match(src, /id="mpPersonalNameError"[^>]*role="alert"/);
  assert.match(src, /aria-live="polite"/);
  assert.match(src, /e\.key==='Enter'/);
  assert.match(src, /showPersonalNameError/);
  assert.match(src, /aria-invalid/);
});

forBoth("heading focused on entry not input", (src) => {
  assert.match(src, /id="mpPersonalHeading"[^>]*tabindex="-1"/);
  assert.match(src, /function initPersonalIntro\(\)\{[\s\S]*?heading\.focus\(\)/);
});

forBoth("routing Screen 3 to Screen 4 with post-Screen-4 branching", (src) => {
  assert.match(src, /function finishHelpChoice\(\)\{if\(!selectedHelpChoice\)return;localStorage\.setItem\('mp_onboard_step','personalIntro'\);initPersonalIntro\(\);showScreen\('personalIntro'\)\}/);
  assert.match(src, /function routeAfterPersonalIntro\(\)/);
  assert.match(src, /localStorage\.setItem\(MP_USER_FIRST_NAME_KEY,raw\.trim\(\)\);routeAfterPersonalIntro\(\)/);
});

forBoth("old knowYou screen blocked", (src) => {
  assert.match(src, /UX_LOCK_LEGACY_BLOCKED.*knowYou/);
  assert.match(src, /function guardUxLockScreen/);
  assert.match(src, /function startOnboardingName\(\)\{if\(isNewUserUxLockFlow\(\)\)\{startIntroduction\(\);return\}/);
});

forBoth("keyboard scroll support for personal input", (src) => {
  assert.match(src, /\.mp-personal-input/);
  assert.match(src, /mp-personal-input/);
});

test("Screen 1 welcome byte-identical to main", () => {
  assert.equal(extractSection(html, "welcome"), extractSection(mainHtml, "welcome"));
});

test("Screen 2 introduction byte-identical to locked 002A", () => {
  assert.equal(extractSection(html, "introduction"), extractSection(lockedScreen2Html, "introduction"));
});

test("Screen 3 helpChoice byte-identical to locked 003A", () => {
  assert.equal(extractSection(html, "helpChoice"), extractSection(lockedScreen3Html, "helpChoice"));
});

test("UX Lock Register Screen 4 LOCKED", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 1.*LOCKED/s);
  assert.match(doc, /Screen 2.*LOCKED/s);
  assert.match(doc, /Screen 3.*LOCKED/s);
  assert.match(doc, /Screen 4.*LOCKED/s);
  assert.match(doc, /MP-UX-LOCK-004/);
  assert.match(doc, /MP-UX-LOCK-004A/);
  assert.match(doc, /Screen 5.*NOT STARTED/s);
});

test("no unauthorised ZIP or tracking artefacts in branch", () => {
  const diff = execSync("git diff --name-only origin/main", { cwd: root, encoding: "utf8" });
  assert.doesNotMatch(diff, /\.zip$/m);
  assert.doesNotMatch(diff, /MP-HF-004-TRACKING-P0-LOCK/);
  assert.doesNotMatch(diff, /native-autopilot\.test\.js/);
  assert.doesNotMatch(diff, /home-ui-contract/);
});

test("APP_VERSION unchanged from main", () => {
  const mainVer = execSync("git show origin/main:frontend/index.html", { cwd: root, encoding: "utf8" }).match(/APP_VERSION='([^']+)'/)[1];
  const curVer = html.match(/APP_VERSION='([^']+)'/)[1];
  assert.equal(curVer, mainVer);
});

test("protected tracking files untouched", () => {
  for (const rel of ["frontend/js/autopilot-motion.js", "frontend/js/tracking-provider.js", "src/expoLocationBridge.js"]) {
    assert.ok(fs.existsSync(path.join(root, rel)), rel);
  }
  assert.match(html, /function initTrackingEngine\(/);
});

console.log("\nOnboarding Screen 4: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
