import assert from "node:assert/strict";
import { AmosCore, createJourneyEngineAdapter } from "../core/index.js";
import { createMemoryStorage, loadFixtureTrips } from "./helpers.js";

function buildJourneyDependencies({ healthy = true } = {}) {
  const trips = loadFixtureTrips();
  const ls = createMemoryStorage();

  return {
    localStorage: ls,
    getEmail: () => "driver@example.com",
    getDriver: () => "Driver",
    getFrequency: () => "weekly",
    getTrips: () => trips,
    getShifts: () => [],
    fmt: (seconds) => `${seconds}s`,
    apiPost: async () => ({ res: { ok: true }, data: { sent: true } }),
    getHmrcRate: () => 0.55,
    healthy,
  };
}

function createUnavailableEngine() {
  return {
    id: "journey-engine",
    name: "Journey Engine Adapter",
    version: "1.0.0",
    async healthCheck() {
      return { ok: false, details: "forced unavailable" };
    },
    getTools() {
      return [
        {
          id: "journey.getMileageSummary",
          engineId: "journey-engine",
          name: "Get Weekly Mileage Summary",
          description: "Returns trusted business mileage totals for the current week.",
          permission: "read",
          confirmationRequired: false,
          inputSchema: {},
          outputSchema: {},
          version: "1.0.0",
        },
      ];
    },
    async executeTool() {
      return {
        success: false,
        error: { code: "UNAVAILABLE", message: "unavailable", retryable: true },
        metadata: { engineId: "journey-engine", toolId: "journey.getMileageSummary", durationMs: 1 },
      };
    },
  };
}

export async function runWorkflowRunnerTests() {
  const core = new AmosCore({ logger: { info() {}, error() {} } });
  const engine = createJourneyEngineAdapter({
    trustedSummaryDependencies: buildJourneyDependencies(),
    logger: { info() {}, error() {} },
  });

  await core.registerEngine(engine);

  const okResult = await core.run("How many business miles have I driven this week?");
  assert.equal(okResult.response.success, true, "routes and executes supported request");
  assert.equal(okResult.response.data.currency, "GBP", "returns trusted structured result");
  assert.ok(typeof okResult.response.data.businessMiles === "number", "returns numeric business miles");

  const unsupported = await core.run("Turn off my app notifications");
  assert.equal(unsupported.response.success, false, "returns unsupported response for unrelated intent");

  const auditsAfterSuccess = core.getDiagnostics().audits;
  assert.ok(auditsAfterSuccess.length >= 2, "writes audit record on success and unsupported path");

  const coreUnavailable = new AmosCore({ logger: { info() {}, error() {} } });
  await coreUnavailable.registerEngine(createUnavailableEngine());
  const unavailable = await coreUnavailable.run("What is my mileage this week?");
  assert.equal(unavailable.response.success, false, "returns graceful unavailable-engine response");

  const audits = coreUnavailable.getDiagnostics().audits;
  const failed = audits.find((item) => item.status === "failed");
  assert.ok(failed, "writes audit record on failure");
}
