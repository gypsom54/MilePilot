/**
 * MP-UX-LOCK-003 / MP-UX-LOCK-003A — Screen 3 final copy contract tests.
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
  support: "Choose how you'd like me to help.",
  supportSub: "You can always change this later.",
  cta: "Continue →",
  badge: "HMRC READY",
  options: {
    mileage: {
      label: "Track my mileage",
      title: "Never miss another business mile.",
      body:
        "Automatically record your journeys, calculate your claims and generate HMRC-ready mileage reports so you stay organised and claim what you're entitled to.",
    },
    business: {
      label: "Help run my business",
      title: "Spend less time on paperwork.",
      body: "Everything you need to stay organised in one place.",
      benefits: [
        "Scan receipts automatically",
        "Track every business expense",
        "Stay on top of VAT",
        "Generate business reports",
        "Ask questions about your business",
        "Prepare accountant-ready summaries",
      ],
    },
    companion: {
      label: "Everything MilePilot",
      title: "Your business in one place.",
      outcomes: [
        "Automatic mileage tracking",
        "Smart business tools",
        "AI assistance whenever you need it",
        "HMRC-ready reports",
        "Everything working together to save you time",
      ],
    },
  },
};

const FORBIDDEN = [
  "How would you like MilePilot to help?",
  "Choose the experience that's right for you.",
  "Complete Business Companion",
  "to help you stay organised",
  "AI Receipt Scanner",
  "Expense Tracking",
  "Accountant Packs",
  "📷",
  "💷",
  "🧾",
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

forBoth("exact final production copy on Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.ok(block.includes(COPY.heading));
  assert.ok(block.includes(COPY.support));
  assert.ok(block.includes(COPY.supportSub));
  for (const key of Object.keys(COPY.options)) {
    const opt = COPY.options[key];
    assert.ok(block.includes(opt.label), key + " label");
    assert.ok(block.includes(opt.title), key + " title");
    if (opt.body) assert.ok(block.includes(opt.body), key + " body");
  }
  assert.ok(block.includes(COPY.badge));
  assert.ok(block.includes(COPY.options.mileage.body));
  for (const benefit of COPY.options.business.benefits) {
    assert.ok(block.includes(benefit), "benefit: " + benefit);
  }
  for (const outcome of COPY.options.companion.outcomes) {
    assert.ok(block.includes(outcome), "outcome: " + outcome);
  }
});

forBoth("forbidden copy absent from Screen 3", (src) => {
  const block = extractSection(src, "helpChoice");
  for (const bad of FORBIDDEN) {
    assert.ok(!block.includes(bad), "must not contain: " + bad);
  }
});

forBoth("HMRC READY badge on mileage card only", (src) => {
  const block = extractSection(src, "helpChoice");
  const mileageCard = block.match(/data-help-choice="mileage"[\s\S]*?<\/button>/)[0];
  assert.ok(mileageCard.includes("mp-help-badge"));
  assert.ok(mileageCard.includes("HMRC READY"));
});

forBoth("no pricing or subscription language", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.doesNotMatch(block, /\bPro\b/i);
  assert.doesNotMatch(block, /subscription/i);
  assert.doesNotMatch(block, /pricing/i);
});

forBoth("continue hidden until selection", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.match(block, /id="mpHelpContinue"[^>]*hidden/);
  assert.match(block, /aria-hidden="true"/);
  assert.ok(block.includes(COPY.cta));
  assert.match(src, /classList\.add\('is-ready','is-visible'\)/);
});

forBoth("selection stores choice only", (src) => {
  assert.match(src, /MP_HELP_CHOICE_KEY='mp_help_choice'/);
  assert.doesNotMatch(src, /function selectHelpChoice[\s\S]*?saveBusinessProfile/);
});

forBoth("accessibility preserved", (src) => {
  const block = extractSection(src, "helpChoice");
  assert.match(block, /role="radiogroup"/);
  assert.match(block, /role="radio"/);
  assert.match(block, /aria-labelledby="mpHelpHeading"/);
  assert.match(src, /\.mp-help-card:focus-visible/);
  assert.match(src, /@media\(prefers-reduced-motion:reduce\)/);
});

test("splash welcome section byte-identical to main", () => {
  assert.equal(extractSection(html, "welcome"), extractSection(mainHtml, "welcome"));
});

test("Screen 2 introduction section unchanged from locked 002A", () => {
  assert.equal(extractSection(html, "introduction"), extractSection(lockedScreen2Html, "introduction"));
});

test("Screen 3 helpChoice section byte-identical to locked 003A", () => {
  const locked = execSync("git show f49337e:frontend/index.html", { cwd: root, encoding: "utf8" });
  assert.equal(extractSection(html, "helpChoice"), extractSection(locked, "helpChoice"));
});

test("UX Lock Register Screen 3 LOCKED with final copy", () => {
  const doc = fs.readFileSync(path.join(root, "docs/MILEPILOT-UX-LOCK-REGISTER.md"), "utf8");
  assert.match(doc, /Screen 1.*LOCKED/s);
  assert.match(doc, /Screen 2.*LOCKED/s);
  assert.match(doc, /Screen 3.*LOCKED/s);
  assert.match(doc, /UX LOCK RULE 001/);
  assert.ok(doc.includes(COPY.heading));
  assert.ok(doc.includes("Everything MilePilot"));
});

test("tracking engine files present (protected)", () => {
  for (const rel of ["frontend/js/autopilot-motion.js", "frontend/js/tracking-provider.js", "src/expoLocationBridge.js"]) {
    assert.ok(fs.existsSync(path.join(root, rel)), rel);
  }
});

console.log("\nOnboarding Screen 3: " + passed + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
