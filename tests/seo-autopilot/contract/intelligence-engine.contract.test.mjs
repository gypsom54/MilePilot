import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  InMemoryEngineRegistry,
} from "../../../packages/engine-sdk/dist/index.js";
import {
  InMemoryEventBus,
  StructuredEngineLogger,
  createDefaultEngineConfig,
} from "../../../packages/shared/dist/index.js";
import {
  createBusinessDiscoveryEngineRegistration,
} from "../../../services/business-discovery/dist/index.js";

const REQUIRED_METHODS = ["analyse", "recommend", "automate", "health"];

describe("IntelligenceEngine contract", () => {
  it("registers Business Discovery with required surface", async () => {
    const events = new InMemoryEventBus();
    const config = createDefaultEngineConfig({
      name: "business-discovery",
      version: "0.1.0",
      description: "Business Discovery Intelligence Engine",
    });
    const logger = new StructuredEngineLogger(config.name, () => {});
    const registration = createBusinessDiscoveryEngineRegistration({
      config,
      events,
      logger,
    });

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

    const registry = new InMemoryEngineRegistry();
    registry.register(registration);

    const health = await registry.healthCheck("business-discovery");
    assert.equal(health?.status, "healthy");

    const analyse = await registration.engine.analyse({});
    assert.equal(analyse.ok, false);
    if (!analyse.ok) {
      assert.equal(analyse.error.code, "ENGINE_NOT_IMPLEMENTED");
    }
  });
});
