/**
 * Deterministic Growth Plan mock checks (no React).
 * Run: node tests/rankaura-growth-plan-mock.test.js
 */
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..", "rankaura-web", "services", "growthPlan");

function loadTsAsRoughObject(filePath) {
  // Not executing TS — validate files exist and contain locked markers.
  const src = fs.readFileSync(filePath, "utf8");
  return src;
}

const existingSrc = loadTsAsRoughObject(path.join(root, "mockExistingGrowthPlan.ts"));
const newSrc = loadTsAsRoughObject(path.join(root, "mockNewLaunchPlan.ts"));
const typesSrc = fs.readFileSync(
  path.join(__dirname, "..", "rankaura-web", "types", "growthPlan.ts"),
  "utf8",
);

const REQUIRED_CATEGORIES = [
  "website_health",
  "keyword_strategy",
  "competitor_intelligence",
  "content_strategy",
  "reddit_community",
  "local_seo",
  "authority_building",
  "digital_pr",
  "social_media",
  "reviews_reputation",
  "analytics_tracking",
  "ai_monitoring",
  "business_intelligence",
];

for (const id of REQUIRED_CATEGORIES) {
  assert.ok(existingSrc.includes(`id: "${id}"`), `existing mock missing ${id}`);
  assert.ok(newSrc.includes(`id: "${id}"`), `new mock missing ${id}`);
}

assert.ok(existingSrc.includes("Your Growth Plan is Ready"));
assert.ok(newSrc.includes("Your Launch Plan is Ready"));
assert.ok(existingSrc.includes("Review & Fix"));
assert.ok(newSrc.includes("View Strategy"));
assert.ok(existingSrc.includes("Website analysed"));
assert.ok(!newSrc.includes("Website analysed"), "new site must not claim website analysed");
assert.ok(existingSrc.includes("reddit_community"));
assert.ok(newSrc.includes("original research"));
assert.ok(typesSrc.includes("existing_needs_access"));
assert.ok(typesSrc.includes("new_pre_launch"));

console.log("rankaura-growth-plan-mock.test.js: OK");
