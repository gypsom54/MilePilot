/**
 * RankAura Sprint 1 — onboarding contract tests
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

assert(html.includes("RankAura"), "brand present on welcome");
assert(html.includes("Launch Growth Plan"), "final CTA copy present");
assert(html.includes("What’s your name?"), "name screen uses curly apostrophe");
assert(html.includes("We’ll keep things personal"), "support copy uses curly apostrophe");

const stages = [
  "Business",
  "Industry",
  "Competitors",
  "Keywords",
  "Website",
  "Technical SEO",
  "Local Presence",
  "Content Opportunities",
  "Authority",
  "Growth Plan",
];

stages.forEach((stage) => {
  assert(js.includes('name: "' + stage + '"'), "analysis stage: " + stage);
});

assert(css.includes("--ra-accent"), "design tokens defined");
assert(css.includes("Fraunces"), "display font defined");
assert(css.includes("Outfit"), "body font defined");
assert(css.includes(".ra-screen.is-active"), "screen transition styles present");
assert(!html.includes("dashboard"), "no dashboard markup in onboarding");
assert(!js.includes("showScreen("), "does not touch MilePilot showScreen");

if (process.exitCode) {
  console.error("\nRankAura Sprint 1 contract failed.");
  process.exit(1);
}

console.log("\nRankAura Sprint 1 contract passed.");
