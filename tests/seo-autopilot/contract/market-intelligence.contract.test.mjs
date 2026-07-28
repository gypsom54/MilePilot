import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PlatformEventName } from "../../../packages/shared/dist/index.js";
import {
  MARKET_INTELLIGENCE_CAPABILITY_MANIFEST,
  createMarketIntelligenceRuntime,
} from "../../../services/market-intelligence/dist/index.js";

describe("Market Intelligence contract", () => {
  it("publishes capability manifest without crawl/content/orchestration", () => {
    assert.equal(
      MARKET_INTELLIGENCE_CAPABILITY_MANIFEST.engine.id,
      "market-intelligence",
    );
    const blob = JSON.stringify(MARKET_INTELLIGENCE_CAPABILITY_MANIFEST);
    assert.equal(blob.includes("crawl"), false);
    assert.equal(blob.includes("content_generation"), false);
    assert.equal(blob.includes("ask"), false);
    assert.equal(blob.includes("dashboard"), false);
  });

  it("recommend() refuses strategic output", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const result = await runtime.engine.recommend({});
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "ENGINE_DOES_NOT_RECOMMEND");
      assert.match(result.error.message, /Opportunity Intelligence|Ask SEO AutoPilot/);
    }
  });

  it("health excludes crawler/content/ranking/orchestration capabilities", async () => {
    const runtime = createMarketIntelligenceRuntime();
    const health = await runtime.engine.health();
    assert.deepEqual(health.details?.excluded, [
      "crawler",
      "seo_scoring",
      "rankings",
      "content_generation",
      "ask_orchestration",
      "dashboards",
      "external_providers",
    ]);
  });

  it("emits canonical Volume 5 events with correlation ids", async () => {
    const runtime = createMarketIntelligenceRuntime();
    /** @type {Array<{ name: string, correlationId?: string }>} */
    const events = [];
    runtime.events.subscribeAll((event) => {
      events.push({ name: event.name, correlationId: event.correlationId });
    });

    const created = await runtime.service.defineMarket(
      {
        tenantId: "tenant_a",
        name: "UK research peptides",
        description: "Market for research peptides",
        industryScope: "Life sciences",
        geographicScope: "national",
      },
      "corr-1",
    );
    assert.equal(created.ok, true);
    assert.ok(
      events.some(
        (event) =>
          event.name === PlatformEventName.MarketDefined &&
          event.correlationId === "corr-1",
      ),
    );
  });
});
