import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InMemoryEngineRegistry } from "../../../packages/engine-sdk/dist/index.js";
import {
  createBusinessDiscoveryRuntime,
  registerBusinessDiscovery,
} from "../../../services/business-discovery/dist/index.js";

const REQUIRED_METHODS = ["analyse", "recommend", "automate", "health"];

describe("IntelligenceEngine contract", () => {
  it("registers Business Discovery with required surface", async () => {
    const runtime = createBusinessDiscoveryRuntime();
    const registry = new InMemoryEngineRegistry();
    registerBusinessDiscovery(runtime, registry);

    const registration = registry.get("business-discovery");
    assert.ok(registration);

    for (const method of REQUIRED_METHODS) {
      assert.equal(typeof registration.engine[method], "function");
    }

    assert.equal(registration.engine.name, "business-discovery");
    assert.ok(registration.engine.purpose.length > 0);
    assert.ok(registration.engine.version.length > 0);
    assert.ok(Array.isArray(registration.engine.inputs));
    assert.ok(Array.isArray(registration.engine.outputs));
    assert.ok(Array.isArray(registration.engine.events));
    assert.ok(Array.isArray(registration.engine.dependencies));

    const health = await registry.healthCheck("business-discovery");
    assert.equal(health?.status, "healthy");

    const recommend = await registration.engine.recommend({});
    assert.equal(recommend.ok, false);
    if (!recommend.ok) {
      assert.equal(recommend.error.code, "ENGINE_DOES_NOT_RECOMMEND");
    }
  });
});
