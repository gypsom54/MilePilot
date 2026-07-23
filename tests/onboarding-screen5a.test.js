/**
 * MP-UX-LOCK-005A — Screen 5A Travel Method contract tests.
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

const CURLY = "\u2019";
const COPY = {
  eyebrow: "YOUR WORK JOURNEYS",
  support: "We" + CURLY + "ll tailor MilePilot around how you normally travel for work.",
  cta: "Continue",
  headingFallback: "What do you usually use for your work journeys?",
  headingTemplate: "{name}, what do you usually use for your work journeys?",
  businessPlaceholder: "Business onboarding screen awaiting approval.",
  screen6Placeholder: "Next onboarding screen awaiting approval.",
};

const OPTIONS = [
  { key: "car_van", title: "Car or van", support: "For driving between customers, jobs or deliveries." },
  { key: "motorcycle", title: "Motorcycle", support: "For work journeys made by motorbike or scooter." },
  { key: "bicycle", title: "Bicycle", support: "For business journeys made by bike." },
  { key: "public_transport", title: "Public transport", support: "Train, bus or tram." },
  { key: "none", title: "None of these", support: "I don't normally travel for work." },
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

function extractTravelBlock(src) {
  return extractSection(src, "travelMethod");
}

forBoth("Screen 5A section exists", (src) => {
  assert.match(src, /id="travelMethod"/);
  assert.match(src, /data-mp="MP-UX-LOCK-005A"/);
});

forBoth("mileage choice routes to Screen 5A", (src) => {
  assert.match(src, /function routeAfterPersonalIntro\(\)\{[\s\S]*?helpChoice==='business'[\s\S]*?showScreen\('onboardBusinessAwaiting'\)[\s\S]*?showScreen\('travelMethod'\)/);
});

forBoth("companion and mileage route to travelMethod", (src) => {
  assert.match(src, /function routeAfterPersonalIntro\(\)\{[\s\S]*?showScreen\('travelMethod'\)/);
  assert.match(src, /initTravelMethod\(\);showScreen\('travelMethod'\)/);
});

forBoth("business choice skips Screen 5A", (src) => {
  assert.match(src, /helpChoice==='business'\)\{localStorage\.setItem\('mp_onboard_step','businessAwaiting'\);showScreen\('onboardBusinessAwaiting'\)/);
  assert.ok(src.includes(COPY.businessPlaceholder));
});

forBoth("missing help choice returns to Screen 3", (src) => {
  assert.match(src, /if\(!isValidHelpChoice\(helpChoice\)\)\{localStorage\.setItem\('mp_onboard_step','helpChoice'\);initHelpChoice\(\);showScreen\('helpChoice'\)/);
  assert.match(src, /MP_HELP_CHOICE_VALUES=\['mileage','business','companion'\]/);
});

forBoth("exact production copy", (src) => {
  const block = extractTravelBlock(src);
  assert.ok(block.includes(COPY.eyebrow), "eyebrow");
  assert.ok(block.includes(COPY.headingFallback), "heading fallback");
  assert.ok(block.includes(COPY.support), "support");
  assert.ok(block.includes(">" + COPY.cta + "<"), "cta");
  assert.ok(!block.includes("I'll"), "no straight apostrophe in support");
  assert.ok(!block.includes("I" + CURLY + "ll use"), "old support copy removed");
});

forBoth("saved first name inserted safely via textContent", (src) => {
  assert.match(src, /heading\.textContent=getTravelMethodHeadingText\(\)/);
  assert.match(src, /MP_UX005A_COPY\.headingTemplate\.replace\('\{name\}',saved\.trim\(\)\)/);
  assert.doesNotMatch(src, /mpTravelHeading[^;]*innerHTML/);
});

forBoth("missing name uses fallback heading", (src) => {
  assert.match(src, /return MP_UX005A_COPY\.headingFallback/);
});

forBoth("exactly five travel method options", (src) => {
  const block = extractTravelBlock(src);
  const cards = [...block.matchAll(/data-travel-method="/g)];
  assert.equal(cards.length, 5);
});

forBoth("option copy and stored values", (src) => {
  const block = extractTravelBlock(src);
  for (const opt of OPTIONS) {
    assert.ok(block.includes(`data-travel-method="${opt.key}"`), opt.key);
    assert.ok(block.includes(opt.title), opt.title);
    assert.ok(block.includes(opt.support), opt.support);
  }
});

forBoth("continue visible but disabled before selection", (src) => {
  const block = extractTravelBlock(src);
  assert.match(block, /id="mpTravelContinue"[^>]*disabled/);
  assert.doesNotMatch(block, /id="mpTravelContinue"[^>]*hidden/);
});

forBoth("selection stores only on Continue", (src) => {
  assert.match(src, /MP_TRAVEL_METHOD_KEY='mp_travel_method'/);
  assert.match(src, /MP_TRAVEL_METHOD_VALUES=\['car_van','motorcycle','bicycle','public_transport','none'\]/);
  const selectFn = src.match(/function selectTravelMethod\(key\)\{[^}]+\}/);
  assert.ok(selectFn);
  assert.doesNotMatch(selectFn[0], /localStorage\.setItem/);
  const finish = src.match(/function finishTravelMethod\(\)\{[^}]+\}/);
  assert.ok(finish);
  assert.match(finish[0], /localStorage\.setItem\(MP_TRAVEL_METHOD_KEY,selectedTravelMethod\)/);
  assert.match(finish[0], /localStorage\.setItem\('mp_onboard_step','awaiting'\)/);
});

forBoth("latest selection replaces previous selection", (src) => {
  assert.match(src, /function selectTravelMethod\(key\)\{if\(!isValidTravelMethod\(key\)\)return;selectedTravelMethod=key;syncTravelMethodCards\(\);syncTravelMethodContinue\(\)\}/);
});

forBoth("valid saved value restores on return", (src) => {
  assert.match(src, /function initTravelMethod\(\)\{let saved=localStorage\.getItem\(MP_TRAVEL_METHOD_KEY\)/);
});

forBoth("invalid saved value removed safely", (src) => {
  assert.match(src, /if\(saved&&!isValidTravelMethod\(saved\)\)\{localStorage\.removeItem\(MP_TRAVEL_METHOD_KEY\);saved=null\}/);
});

forBoth("only permitted storage keys written on finish", (src) => {
  const finish = src.match(/function finishTravelMethod\(\)\{[^}]+\}/)[0];
  assert.doesNotMatch(finish, /mp_user_first_name/);
  assert.doesNotMatch(finish, /mp_help_choice/);
  assert.doesNotMatch(finish, /mp_onboard_complete/);
  assert.doesNotMatch(finish, /mp_business_category/);
  assert.doesNotMatch(finish, /mp_vehicle/);
});

forBoth("no permissions or tracking actions", (src) => {
  const block = extractTravelBlock(src);
  assert.doesNotMatch(block, /permission/i);
  assert.doesNotMatch(block, /AutoPilot/i);
  assert.doesNotMatch(block, /GPS/i);
  const finish = src.match(/function finishTravelMethod\(\)\{[^}]+\}/)[0];
  assert.doesNotMatch(finish, /initTrackingEngine/);
  assert.doesNotMatch(finish, /enableGpsPermission/);
});

forBoth("Screen 6 remains placeholder", (src) => {
  assert.ok(src.includes(COPY.screen6Placeholder));
  assert.match(src, /showScreen\('onboardAwaiting'\)/);
});

forBoth("radiogroup semantics and keyboard selection", (src) => {
  const block = extractTravelBlock(src);
  assert.match(block, /role="radiogroup"/);
  assert.match(block, /role="radio"/);
  assert.match(block, /aria-checked="false"/);
  assert.match(src, /bindTravelMethodKeyboard/);
  assert.match(src, /e\.key==='ArrowDown'/);
  assert.match(src, /e\.key==='Enter'/);
});

forBoth("no internal card list scrolling", (src) => {
  assert.doesNotMatch(src, /\.mp-travel-cards\{[^}]*overflow-y:auto/);
  assert.match(src, /\.mp-travel-card\{[^}]*min-height:58px/);
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

test("UX Lock Register Screen 5A IN REVIEW", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 1.*LOCKED/s);
  assert.match(doc, /Screen 2.*LOCKED/s);
  assert.match(doc, /Screen 3.*LOCKED/s);
  assert.match(doc, /Screen 4.*LOCKED/s);
  assert.match(doc, /Screen 5A.*IN REVIEW/s);
  assert.match(doc, /MP-UX-LOCK-005A/);
  assert.match(doc, /Screen 5B.*NOT STARTED/s);
  assert.match(doc, /Screen 6\+.*NOT STARTED/s);
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

console.log("\nOnboarding Screen 5A: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
