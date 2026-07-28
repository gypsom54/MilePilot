import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST,
  createCrawlIntelligenceRuntime,
} from "../../../services/crawl/dist/index.js";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".ts") || full.endsWith(".js") || full.endsWith(".mjs")) {
      out.push(full);
    }
  }
  return out;
}

describe("Crawl Intelligence contract", () => {
  it("publishes observation-only capability manifest", () => {
    assert.equal(
      CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST.engine.id,
      "crawl-intelligence",
    );
    const blob = JSON.stringify(CRAWL_INTELLIGENCE_CAPABILITY_MANIFEST);
    for (const banned of [
      "seo_scoring",
      "ranking",
      "content_generation",
      "dashboard",
      "opportunity",
      "ask_orchestration",
      "performance_scoring",
      "indexability",
      "accessibility",
    ]) {
      assert.equal(blob.includes(banned), false, banned);
    }
  });

  it("recommend() refuses SEO and optimisation judgement", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const result = await runtime.engine.recommend({
      intent: "fix broken links and rewrite metadata",
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "ENGINE_DOES_NOT_RECOMMEND");
      assert.match(
        result.error.message,
        /SEO|metadata|broken-link|performance|linking|rewriting|strategic/i,
      );
    }
  });

  it("health lists excluded judgement and crawler capabilities", async () => {
    const runtime = createCrawlIntelligenceRuntime();
    const health = await runtime.engine.health();
    const excluded = health.details?.excluded ?? [];
    for (const item of [
      "live_http_crawler",
      "playwright",
      "chromium",
      "seo_scoring",
      "indexability_judgement",
      "accessibility_judgement",
      "performance_scoring",
      "dashboards",
      "ask_orchestration",
      "website_intelligence_overwrite",
    ]) {
      assert.ok(excluded.includes(item), item);
    }
  });

  it("source tree contains no production network crawler or Playwright", () => {
    const root = join(process.cwd(), "services/crawl/src");
    const files = walk(root);
    const bannedPatterns = [
      /from\s+["']playwright["']/,
      /from\s+["']puppeteer["']/,
      /require\(\s*["']playwright["']\s*\)/,
      /from\s+["']node:https?["']/,
      /from\s+["']https?["']/,
      /from\s+["']undici["']/,
      /\bfetch\s*\(/,
      /new\s+Chromium/,
      /launchPersistentContext/,
    ];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const pattern of bannedPatterns) {
        assert.equal(
          pattern.test(text),
          false,
          `${file} must not match ${pattern}`,
        );
      }
    }
  });
});
