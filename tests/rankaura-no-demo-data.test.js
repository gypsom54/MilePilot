/**
 * Guard: no demo business identity in RankAura web onboarding / Growth Plan.
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "rankaura-web");
const banned = [
  "Portsmouth Hypnotherapy",
  "portsmouthhypnotherapy",
  "Harbour & Oak",
  "Northern Materials",
  "We help people overcome anxiety",
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|js|jsx|md)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = walk(root).filter((file) => {
  const rel = path.relative(root, file);
  return (
    rel.startsWith("components/onboarding/") ||
    rel.startsWith("services/onboarding/") ||
    rel.startsWith("services/growthPlan/") ||
    rel.startsWith("types/onboarding.ts") ||
    rel.startsWith("app/onboarding/") ||
    rel.startsWith("app/growth-plan/") ||
    rel.startsWith("components/growth-plan/")
  );
});
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  for (const term of banned) {
    assert.ok(
      !src.toLowerCase().includes(term.toLowerCase()),
      `Banned demo term "${term}" found in ${path.relative(root, file)}`,
    );
  }
}

const flow = fs.readFileSync(
  path.join(root, "components", "onboarding", "OnboardingFlow.tsx"),
  "utf8",
);
assert.ok(flow.includes("What should we call you?"));
assert.ok(flow.includes("Enter your first name"));
assert.ok(flow.includes("https://yourwebsite.co.uk"));
assert.ok(flow.includes("Enter your business name"));
assert.ok(flow.includes("Tell us about your business..."));
assert.ok(flow.includes("Nice to meet you"));
assert.ok(flow.includes("/growth-plan?site="));

const personalize = fs.readFileSync(
  path.join(root, "services", "growthPlan", "personalizeGrowthPlan.ts"),
  "utf8",
);
assert.ok(personalize.includes("your Growth Plan is ready"));
assert.ok(personalize.includes("businessName"));

console.log("rankaura-no-demo-data.test.js: OK");
