/**
 * RankAura Sprint 1 — onboarding contract tests
 * Locked by rankaura/docs/SPRINT_01.md + UX_PHILOSOPHY.md
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "rankaura");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "onboarding.css"), "utf8");
const js = fs.readFileSync(path.join(root, "js", "onboarding.js"), "utf8");

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("OK:", msg);
  }
}

const docs = [
  "README_FIRST.md",
  "RANKAURA_CONSTITUTION.md",
  "PRODUCT_VISION.md",
  "UX_PHILOSOPHY.md",
  "DESIGN_SYSTEM.md",
  "CURSOR_RULES.md",
  "ROADMAP.md",
  "SPRINT_01.md",
];

docs.forEach((file) => {
  assert(fs.existsSync(path.join(root, "docs", file)), "docs present: " + file);
});

const requiredScreens = [
  "ra-welcome",
  "ra-name",
  "ra-businessName",
  "ra-website",
  "ra-description",
  "ra-analysis",
  "ra-summary",
  "ra-launch",
];

requiredScreens.forEach((id) => {
  assert(html.includes('id="' + id + '"'), "screen present: " + id);
});

assert(html.includes("We Help Grow Businesses."), "locked welcome copy");
assert(html.includes(">Get Started<"), "locked welcome CTA");
assert(html.includes("What should we call you?"), "locked name copy");
assert(html.includes("What’s your business called?"), "locked business copy");
assert(html.includes("What’s your website?"), "locked website copy");
assert(html.includes("Tell us about your business."), "locked description copy");
assert(html.includes("Your Growth Team has started work."), "locked analysis intro");
assert(html.includes("We’ve finished learning about your business."), "locked summary copy");
assert(html.includes("Launch Growth Plan"), "locked final CTA");
assert(html.includes("Demo preview"), "demo data clearly labelled");
assert(html.includes('assets/rankaura-logo.svg'), "welcome uses RankAura logo asset");
assert(fs.existsSync(path.join(root, "assets", "rankaura-logo.svg")), "logo file exists");

const stages = [
  "Understanding your business",
  "Researching your industry",
  "Analysing competitors",
  "Discovering keyword opportunities",
  "Crawling your website",
  "Reviewing technical performance",
  "Finding content opportunities",
  "Reviewing local presence",
  "Reviewing authority and trust",
  "Building your Growth Plan",
];

stages.forEach((stage) => {
  assert(js.includes('name: "' + stage + '"'), "analysis stage: " + stage);
});

assert(js.includes("Try again") || html.includes("Try again"), "analysis retry present");
assert(js.includes('params.has("fresh")'), "fresh start query supported");
assert(css.includes("--ra-accent"), "design tokens defined");
assert(css.includes(".ra-screen.is-active"), "screen transition styles present");
assert(!html.includes("dashboard"), "no dashboard markup in onboarding");
assert(!js.includes("showScreen("), "does not touch MilePilot showScreen");
assert(!html.includes("Fix All"), "avoids banned CTA Fix All");
assert(!html.includes("Technical SEO"), "no SEO jargon label in HTML");

if (process.exitCode) {
  console.error("\nRankAura Sprint 1 contract failed.");
  process.exit(1);
}

console.log("\nRankAura Sprint 1 contract passed.");
