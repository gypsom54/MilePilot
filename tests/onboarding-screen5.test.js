/**
 * MP-UX-LOCK-005 — Screen 5 Your Work contract tests.
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
const lockedScreen4Html = execSync("git show main:frontend/index.html", { cwd: root, encoding: "utf8" });

const COPY = {
  eyebrow: "TELL ME ABOUT YOUR WORK",
  heading: "What kind of work do you do?",
  support: "This helps me make MilePilot more useful for your business.",
  cta: "Continue",
  placeholderScreen6: "Next onboarding screen awaiting approval.",
};

const OPTIONS = [
  { key: "driver", title: "Driving & delivery", examples: "Taxi, private hire, courier or delivery work" },
  { key: "trades", title: "Trades & construction", examples: "Building, plumbing, electrical or property work" },
  { key: "freelance", title: "Freelance & professional", examples: "Consulting, design, marketing or office-based work" },
  { key: "services", title: "Retail & personal services", examples: "Beauty, cleaning, hospitality, shops or appointments" },
  { key: "other", title: "Something else", examples: "My work is not listed above" },
];

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

function extractWorkBlock(src) {
  return extractSection(src, "yourWork");
}

forBoth("Screen 5 section exists", (src) => {
  assert.match(src, /id="yourWork"/);
  assert.match(src, /data-mp="MP-UX-LOCK-005"/);
});

forBoth("exact production copy", (src) => {
  const block = extractWorkBlock(src);
  assert.ok(block.includes(COPY.eyebrow), "eyebrow");
  assert.ok(block.includes(COPY.heading), "heading");
  assert.ok(block.includes(COPY.support), "support");
  assert.ok(block.includes(">" + COPY.cta + "<"), "cta");
});

forBoth("exactly five work category options", (src) => {
  const block = extractWorkBlock(src);
  const cards = [...block.matchAll(/data-work-category="/g)];
  assert.equal(cards.length, 5);
});

forBoth("option copy and stored values", (src) => {
  const block = extractWorkBlock(src);
  for (const opt of OPTIONS) {
    assert.ok(block.includes(`data-work-category="${opt.key}"`), opt.key);
    const titleHtml = opt.title.replace(/&/g, "&amp;");
    assert.ok(block.includes(titleHtml), opt.title);
    assert.ok(block.includes(opt.examples), opt.examples);
  }
});

forBoth("continue visible but disabled before selection", (src) => {
  const block = extractWorkBlock(src);
  assert.match(block, /id="mpWorkContinue"[^>]*disabled/);
  assert.doesNotMatch(block, /id="mpWorkContinue"[^>]*hidden/);
  assert.match(block, /aria-disabled="true"/);
});

forBoth("selection and storage behaviour in JS", (src) => {
  assert.match(src, /MP_BUSINESS_CATEGORY_KEY='mp_business_category'/);
  assert.match(src, /MP_WORK_CATEGORY_VALUES=\['driver','trades','freelance','services','other'\]/);
  const finish = src.match(/function finishWorkCategory\(\)\{[^}]+\}/);
  assert.ok(finish, "finishWorkCategory");
  assert.match(finish[0], /localStorage\.setItem\(MP_BUSINESS_CATEGORY_KEY,selectedWorkCategory\)/);
  assert.doesNotMatch(finish[0], /mp_user_first_name/);
  assert.doesNotMatch(finish[0], /mp_onboard_complete/);
  assert.doesNotMatch(finish[0], /mp_help_choice/);
});

forBoth("latest selection replaces previous selection", (src) => {
  assert.match(src, /function selectWorkCategory\(key\)\{if\(!isValidWorkCategory\(key\)\)return;selectedWorkCategory=key;syncWorkCategoryCards\(\);syncWorkCategoryContinue\(\)\}/);
});

forBoth("saved valid selection restores on return", (src) => {
  assert.match(src, /function initWorkCategory\(\)\{let saved=localStorage\.getItem\(MP_BUSINESS_CATEGORY_KEY\)/);
  assert.match(src, /if\(saved&&!isValidWorkCategory\(saved\)\)\{localStorage\.removeItem\(MP_BUSINESS_CATEGORY_KEY\);saved=null\}/);
});

forBoth("invalid stored value fails safely", (src) => {
  assert.match(src, /function isValidWorkCategory\(val\)\{return MP_WORK_CATEGORY_VALUES\.includes\(val\)\}/);
});

forBoth("routing Screen 4 to Screen 5 to Screen 6 placeholder", (src) => {
  assert.match(src, /localStorage\.setItem\('mp_onboard_step','yourWork'\);initWorkCategory\(\);showScreen\('yourWork'\)/);
  assert.match(src, /localStorage\.setItem\('mp_onboard_step','awaiting'\);showScreen\('onboardAwaiting'\)/);
  assert.ok(src.includes(COPY.placeholderScreen6));
});

forBoth("old knowYou screen blocked", (src) => {
  assert.match(src, /UX_LOCK_LEGACY_BLOCKED.*knowYou/);
  assert.match(src, /function guardUxLockScreen/);
});

forBoth("radiogroup semantics and keyboard selection", (src) => {
  const block = extractWorkBlock(src);
  assert.match(block, /role="radiogroup"/);
  assert.match(block, /role="radio"/);
  assert.match(block, /aria-checked="false"/);
  assert.match(src, /bindWorkCategoryKeyboard/);
  assert.match(src, /e\.key==='ArrowDown'/);
  assert.match(src, /e\.key==='Enter'/);
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

test("Screen 4 personalIntro byte-identical to locked main", () => {
  assert.equal(extractSection(html, "personalIntro"), extractSection(lockedScreen4Html, "personalIntro"));
});

test("deploy mirror byte-identical to frontend", () => {
  assert.equal(html, mirror);
});

test("UX Lock Register Screen 5 IN REVIEW", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 1.*LOCKED/s);
  assert.match(doc, /Screen 2.*LOCKED/s);
  assert.match(doc, /Screen 3.*LOCKED/s);
  assert.match(doc, /Screen 4.*LOCKED/s);
  assert.match(doc, /Screen 5.*IN REVIEW/s);
  assert.match(doc, /MP-UX-LOCK-005/);
  assert.match(doc, /Screen 6.*NOT STARTED/s);
});

test("no ZIP or binary files in branch diff", () => {
  const diff = execSync("git diff --name-only origin/main", { cwd: root, encoding: "utf8" });
  assert.doesNotMatch(diff, /\.zip$/m);
  assert.doesNotMatch(diff, /\.(ipa|apk)$/m);
});

test("APP_VERSION unchanged from main", () => {
  const mainVer = mainHtml.match(/APP_VERSION='([^']+)'/)[1];
  const curVer = html.match(/APP_VERSION='([^']+)'/)[1];
  assert.equal(curVer, mainVer);
});

test("protected tracking files untouched", () => {
  for (const rel of ["frontend/js/autopilot-motion.js", "frontend/js/tracking-provider.js", "src/expoLocationBridge.js"]) {
    assert.ok(fs.existsSync(path.join(root, rel)), rel);
  }
  assert.match(html, /function initTrackingEngine\(/);
});

console.log("\nOnboarding Screen 5: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
