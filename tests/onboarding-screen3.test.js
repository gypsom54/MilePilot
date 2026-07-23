/**
 * MP-UX-LOCK-003 / MP-UX-LOCK-003A — Screen 3 How MilePilot Can Help contract tests.
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
  heading: "How can I help your business today?",
  support: "Choose the experience that's right for you.",
  supportSub: "You can always change this later.",
  cta: "Continue →",
  badge: "HMRC READY",
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
      benefits: [
        "📷 Scan receipts automatically",
        "💷 Track every business expense",
        "🧾 Stay on top of VAT",
        "📊 Generate business reports",
        "🤖 Ask questions about your business",
        "👨‍💼 Prepare accountant-ready summaries",
      ],
    },
    companion: {
      label: "Complete Business Companion",
      title: "Your business in one place.",
      outcomes: [
        "Automatic mileage tracking.",
        "Smart business tools.",
        "AI assistance whenever you need it.",
        "HMRC-ready reports.",
        "Everything working together to save you time.",
      ],
    },
  },
  placeholder: "Next onboarding screen awaiting approval.",
};

const REMOVED_COPY = [
  "How would you like MilePilot to help?",
  "Choose the experience that's right for you today.",
  "Everything MilePilot has to offer.",
  "AI Receipt Scanner",
  "Expense Tracking",
  "Accountant Packs",
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

forBoth("Screen 3 section exists", (src) => {
  assert.match(src, /id="helpChoice"/);
  assert.match(src, /data-mp="MP-UX-LOCK-003"/);
  assert.match(src, /data-mp-lock="003A"/);
});

forBoth("exact approved copy on Screen 3 (003A)", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.ok(block.includes(COPY.heading), "heading");
  assert.ok(block.includes(COPY.support), "support");
  assert.ok(block.includes(COPY.supportSub), "supportSub");
  for (const key of Object.keys(COPY.options)) {
    const opt = COPY.options[key];
    assert.ok(block.includes(opt.label), key + " label");
    assert.ok(block.includes(opt.title), key + " title");
    if (opt.body) assert.ok(block.includes(opt.body), key + " body");
  }
  for (const benefit of COPY.options.business.benefits) {
    assert.ok(block.includes(benefit), "benefit " + benefit);
  }
  for (const outcome of COPY.options.companion.outcomes) {
    assert.ok(block.includes(outcome), "outcome " + outcome);
  }
});

forBoth("removed pre-003A copy absent", (src) => {
  const block = extractSection(src, "helpChoice");
  for (const removed of REMOVED_COPY) {
    assert.ok(!block.includes(removed), "must not contain: " + removed);
  }
});

forBoth("HMRC READY badge on mileage card", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.ok(block.includes(COPY.badge), "badge text");
  assert.match(block, /mp-help-badge[^>]*>HMRC READY</);
  const mileageCard = block.match(/data-help-choice="mileage"[\s\S]*?<\/button>/)[0];
  assert.ok(mileageCard.includes("mp-help-badge"), "badge on mileage card");
});

forBoth("no pricing or subscription language on Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.doesNotMatch(block, /\bPro\b/i);
  assert.doesNotMatch(block, /subscription/i);
  assert.doesNotMatch(block, /pricing/i);
  assert.doesNotMatch(block, /£/);
});

forBoth("three equal choice cards", (src) => {
  const block = extractSection(src, "helpChoice");
  const cards = [...block.matchAll(/data-help-choice="/g)];
  assert.equal(cards.length, 3);
});

forBoth("companion card premium styling", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.match(block, /mp-help-card--premium/);
});

forBoth("selection stores choice only", (src) => {
  assert.match(src, /MP_HELP_CHOICE_KEY='mp_help_choice'/);
  assert.match(src, /function selectHelpChoice\(key\)\{[^}]*localStorage\.setItem\(MP_HELP_CHOICE_KEY,key\)/);
  assert.doesNotMatch(src, /function selectHelpChoice[\s\S]*?saveBusinessProfile/);
});

forBoth("continue hidden until selection", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.match(block, /id="mpHelpContinue"[^>]*hidden/);
  assert.match(block, /aria-hidden="true"/);
  assert.match(src, /classList\.add\('is-ready','is-visible'\)/);
  assert.match(src, /classList\.remove\('is-ready','is-visible'\)/);
  assert.ok(block.includes(COPY.cta), "cta label with arrow");
});

forBoth("continue goes to Screen 4 placeholder only", (src) => {
  assert.match(src, /function finishHelpChoice\(\)\{if\(!selectedHelpChoice\)return;localStorage\.setItem\('mp_onboard_step','awaiting'\);showScreen\('onboardAwaiting'\)\}/);
});

forBoth("enhanced selected card styling", (src) => {
  assert.match(src, /\.mp-help-card\.selected\{[^}]*translateY\(-2px\)/);
  assert.match(src, /\.mp-help-card\.selected\{[^}]*rgba\(13,107,255/);
});

forBoth("accessibility on Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.match(block, /role="radiogroup"/);
  assert.match(block, /role="radio"/);
  assert.match(block, /aria-labelledby="mpHelpHeading"/);
  assert.match(block, /id="mpHelpContinue"/);
  assert.match(src, /\.mp-help-card:focus-visible/);
  assert.match(src, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.mp-help-card/);
});

forBoth("responsive layout CSS", (src) => {
  assert.match(src, /#helpChoice\.active/);
  assert.match(src, /safe-area-inset/);
  assert.match(src, /@media\(min-width:768px\)[\s\S]*#helpChoice/);
});

forBoth("legacy onboarding still guarded", (src) => {
  assert.match(src, /function guardUxLockScreen/);
  assert.match(src, /if\(step==='helpChoice'\)return 'helpChoice'/);
});

forBoth("UX lock constants include 003A", (src) => {
  assert.match(src, /MP_UX_LOCK_003A/);
  assert.match(src, /MP_UX003_COPY/);
});

test("splash welcome section byte-identical to main", () => {
  assert.equal(extractSection(html, "welcome"), extractSection(mainHtml, "welcome"));
});

test("Screen 2 introduction section unchanged from locked 002A", () => {
  assert.equal(extractSection(html, "introduction"), extractSection(lockedScreen2Html, "introduction"));
});

test("docs register lists Screen 3 IN REVIEW with 003A", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 3.*IN REVIEW/s);
  assert.match(doc, /MP-UX-LOCK-003A/);
  assert.ok(doc.includes(COPY.heading));
});

test("tracking engine files present (protected)", () => {
  for (const rel of ["frontend/js/autopilot-motion.js", "frontend/js/tracking-provider.js", "src/expoLocationBridge.js"]) {
    assert.ok(fs.existsSync(path.join(root, rel)), rel + " exists");
  }
  assert.match(html, /function initTrackingEngine\(/);
  assert.match(html, /function ensureAutopilotArmed\(/);
});

console.log("\nOnboarding Screen 3: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
