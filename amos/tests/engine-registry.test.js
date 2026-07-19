import assert from "node:assert/strict";
import { EngineRegistry } from "../engine-registry/engine-registry.js";

function createEngine({ id, healthy = true, throws = false } = {}) {
  return {
    id,
    name: `Engine ${id}`,
    version: "1.0.0",
    async healthCheck() {
      if (throws) throw new Error("health check crash");
      return { ok: healthy, details: healthy ? "ok" : "unhealthy" };
    },
    getTools() {
      return [];
    },
    async executeTool() {
      return { success: true, metadata: { engineId: id, toolId: "none", durationMs: 0 } };
    },
  };
}

export async function runEngineRegistryTests() {
  const registry = new EngineRegistry({ logger: { info() {}, error() {} } });

  registry.register(createEngine({ id: "journey" }));
  assert.ok(registry.getEngine("journey"), "registers a valid engine");

  assert.throws(() => {
    registry.register(createEngine({ id: "journey" }));
  }, /Duplicate engine id/, "rejects duplicate engine IDs");

  registry.register(createEngine({ id: "reporting", healthy: false }));
  registry.register(createEngine({ id: "failing", throws: true }));

  const health = await registry.runHealthChecks();
  const reporting = health.find((item) => item.engineId === "reporting");
  const failing = health.find((item) => item.engineId === "failing");

  assert.equal(reporting.healthy, false, "handles an unhealthy engine");
  assert.equal(failing.healthy, false, "does not crash when one engine fails");
  assert.ok(registry.getEngine("journey"), "healthy engine remains accessible");
}
