/**
 * MP-UX-LOCK-003 — Screen 3 How MilePilot Can Help contract tests.
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

const COPY = {
  heading: "How would you like MilePilot to help?",
  support: "Choose the experience that's right for you today.",
  supportSub: "You can always change this later.",
  cta: "Continue",
  options: {
    mileage: {
      label: "Track my mileage",
      title: "Never miss another business mile.",
      body:
        "Automatically record your journeys, calculate your claims and generate HMRC-ready mileage reports to help you stay organised and claim what you're entitled to.",
    },
    business: {
      label: "Help run my business",
      title: "Spend less time on paperwork.",
      body: "Everything you need to stay organised in one place.",
      features: [
        "AI Receipt Scanner",
        "Expense Tracking",
        "VAT Tracking",
        "Business Reports",
        "Ask MilePilot",
        "Accountant Packs",
      ],
    },
    companion: {
      label: "Complete Business Companion",
      title: "Everything MilePilot has to offer.",
      body:
        "Automatic mileage tracking together with powerful business tools, giving you one place to organise your business, reduce admin and save time every week.",
    },
  },
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

function extractSection(src, id) {
  const m = src.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`));
  assert.ok(m, id + " section");
  return m[0];
}

forBoth("Screen 3 section exists", (src) => {
  assert.match(src, /id="helpChoice"/);
  assert.match(src, /data-mp="MP-UX-LOCK-003"/);
});

forBoth("exact approved copy on Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.ok(block.includes(COPY.heading), "heading");
  assert.ok(block.includes(COPY.support), "support");
  assert.ok(block.includes(COPY.supportSub), "supportSub");
  for (const key of Object.keys(COPY.options)) {
    const opt = COPY.options[key];
    assert.ok(block.includes(opt.label), key + " label");
    assert.ok(block.includes(opt.title), key + " title");
    assert.ok(block.includes(opt.body), key + " body");
  }
  for (const feat of COPY.options.business.features) {
    assert.ok(block.includes(feat), "feature " + feat);
  }
});

forBoth("no pricing or plan language on Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.doesNotMatch(block, /\bPro\b/i);
  assert.doesNotMatch(block, /subscription/i);
  assert.doesNotMatch(block, /pricing/i);
  assert.doesNotMatch(block, /£/);
  assert.doesNotMatch(block, /badge/i);
});

forBoth("three equal choice cards", (src) => {
  const block = extractSection(src, "helpChoice");
  const cards = [...block.matchAll(/data-help-choice="/g)];
  assert.equal(cards.length, 3);
  assert.match(block, /data-help-choice="mileage"/);
  assert.match(block, /data-help-choice="business"/);
  assert.match(block, /data-help-choice="companion"/);
});

forBoth("selection stores choice only", (src) => {
  assert.match(src, /MP_HELP_CHOICE_KEY='mp_help_choice'/);
  assert.match(src, /function selectHelpChoice\(key\)\{[^}]*localStorage\.setItem\(MP_HELP_CHOICE_KEY,key\)/);
  assert.doesNotMatch(src, /function selectHelpChoice[\s\S]*?saveBusinessProfile/);
});

forBoth("continue goes to Screen 4 placeholder only", (src) => {
  assert.match(src, /function finishHelpChoice\(\)\{if\(!selectedHelpChoice\)return;localStorage\.setItem\('mp_onboard_step','awaiting'\);showScreen\('onboardAwaiting'\)\}/);
  assert.match(src, /id="onboardAwaiting"/);
  assert.ok(src.includes(COPY.placeholder));
});

forBoth("flow wiring Screen 2 to Screen 3", (src) => {
  assert.match(src, /function finishIntroduction\(\)\{localStorage\.setItem\('mp_onboard_step','helpChoice'\);initHelpChoice\(\);showScreen\('helpChoice'\)\}/);
});

forBoth("accessibility on Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.match(block, /role="radiogroup"/);
  assert.match(block, /role="radio"/);
  assert.match(block, /aria-labelledby="mpHelpHeading"/);
  assert.match(block, /id="mpHelpContinue"/);
  assert.match(block, /aria-disabled/);
  assert.match(src, /\.mp-help-card:focus-visible/);
});

forBoth("responsive layout CSS", (src) => {
  assert.match(src, /#helpChoice\.active/);
  assert.match(src, /safe-area-inset/);
  assert.match(src, /@media\(min-width:768px\)[\s\S]*#helpChoice/);
  assert.match(src, /\.mp-help-cards/);
  assert.match(src, /\.mp-help-card\.selected/);
});

forBoth("legacy onboarding still guarded", (src) => {
  assert.match(src, /function guardUxLockScreen/);
  assert.match(src, /if\(step==='helpChoice'\)return 'helpChoice'/);
});

test("splash welcome section byte-identical to main", () => {
  const mainWelcome = extractSection(mainHtml, "welcome");
  const currWelcome = extractSection(html, "welcome");
  assert.equal(currWelcome, mainWelcome);
});

test("Screen 2 introduction section unchanged from locked 002A", () => {
  const lockedIntro = extractSection(lockedScreen2Html, "introduction");
  const currIntro = extractSection(html, "introduction");
  assert.equal(currIntro, lockedIntro, "introduction section must remain locked");
});

test("docs register lists Screen 3 IN REVIEW", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 1.*LOCKED/s);
  assert.match(doc, /Screen 2.*LOCKED/s);
  assert.match(doc, /Screen 3.*IN REVIEW/s);
  assert.match(doc, /MP-UX-LOCK-003/);
  assert.match(doc, /Screen 4.*NOT STARTED/s);
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

console.log("\nOnboarding Screen 3: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
