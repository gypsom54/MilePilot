import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BUSINESS_DISCOVERY_CAPABILITY_MANIFEST,
  createBusinessDiscoveryRuntime,
} from "../../../services/business-discovery/dist/index.js";

describe("Business Discovery contract", () => {
  it("publishes a capability manifest", () => {
    assert.equal(
      BUSINESS_DISCOVERY_CAPABILITY_MANIFEST.engine.id,
      "business-discovery",
    );
    assert.ok(
      BUSINESS_DISCOVERY_CAPABILITY_MANIFEST.capabilities.includes(
        "build_business_profile",
      ),
    );
    assert.ok(
      BUSINESS_DISCOVERY_CAPABILITY_MANIFEST.produces.includes(
        "business_profile",
      ),
    );
  });

  it("implements IntelligenceEngine and refuses optimisation recommendations", async () => {
    const runtime = createBusinessDiscoveryRuntime();
    const engine = runtime.engine;

    for (const method of ["analyse", "recommend", "automate", "health"]) {
      assert.equal(typeof engine[method], "function");
    }

    const recommend = await engine.recommend({});
    assert.equal(recommend.ok, false);
    if (!recommend.ok) {
      assert.equal(recommend.error.code, "ENGINE_DOES_NOT_RECOMMEND");
    }

    const created = await engine.analyse({
      operation: "create",
      business: {
        legalName: "Example Ltd",
        tradingName: "Example",
        website: "https://example.com",
        primaryDomain: "example.com",
        businessDescription: "Example business",
        industry: "Software",
        businessStage: "startup",
        companyType: "limited_company",
        primaryContact: "hello@example.com",
        timeZone: "UTC",
        primaryLanguage: "en",
      },
    });
    assert.equal(created.ok, true);
  });
});
