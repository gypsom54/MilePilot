import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST,
  createWebsiteIntelligenceRuntime,
} from "../../../services/website-intelligence/dist/index.js";

describe("Website Intelligence contract", () => {
  it("publishes manifest without excluded capabilities", () => {
    assert.equal(
      WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST.engine.id,
      "website-intelligence",
    );
    const blob = JSON.stringify(WEBSITE_INTELLIGENCE_CAPABILITY_MANIFEST);
    for (const banned of [
      "crawl",
      "seo_scoring",
      "ranking",
      "content_generation",
      "dashboard",
      "opportunity",
      "ask_orchestration",
      "performance",
    ]) {
      assert.equal(blob.includes(banned), false, banned);
    }
  });

  it("recommend() refuses optimisation", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const result = await runtime.engine.recommend({});
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "ENGINE_DOES_NOT_RECOMMEND");
      assert.match(result.error.message, /optimisation|scoring|strategy/i);
    }
  });

  it("health lists excluded crawl/SEO/content/Ask capabilities", async () => {
    const runtime = createWebsiteIntelligenceRuntime();
    const health = await runtime.engine.health();
    assert.ok(health.details?.excluded?.includes("crawler"));
    assert.ok(health.details?.excluded?.includes("seo_scoring"));
    assert.ok(health.details?.excluded?.includes("ask_orchestration"));
  });
});
