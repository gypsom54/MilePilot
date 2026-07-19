import assert from "node:assert/strict";
import { AmosCore, createJourneyEngineAdapter } from "../core/index.js";
import { createJourneyDependencies } from "./helpers.js";

function createSprintTwoTrips() {
  const now = new Date();
  const todayMorning = new Date(now);
  todayMorning.setHours(8, 20, 0, 0);
  const todayMid = new Date(now);
  todayMid.setHours(9, 5, 0, 0);
  const todayLate = new Date(now);
  todayLate.setHours(12, 30, 0, 0);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(18, 5, 0, 0);

  return [
    {
      id: "trip_yesterday_business",
      status: "business",
      miles: 14.2,
      seconds: 2100,
      hmrc: 7.81,
      vehicle: "car",
      startISO: yesterday.toISOString(),
      endISO: new Date(yesterday.getTime() + 25 * 60 * 1000).toISOString(),
      shiftId: "shift_yesterday",
    },
    {
      id: "trip_today_business",
      status: "business",
      miles: 8.4,
      seconds: 1600,
      hmrc: 4.62,
      vehicle: "car",
      startISO: todayMorning.toISOString(),
      endISO: new Date(todayMorning.getTime() + 22 * 60 * 1000).toISOString(),
      shiftId: "shift_today_1",
    },
    {
      id: "trip_today_pending",
      status: "pending",
      miles: 5.7,
      seconds: 1200,
      hmrc: 0,
      vehicle: "car",
      startISO: todayMid.toISOString(),
      endISO: new Date(todayMid.getTime() + 18 * 60 * 1000).toISOString(),
      shiftId: "shift_today_2",
    },
    {
      id: "trip_today_personal",
      status: "personal",
      miles: 3.1,
      seconds: 840,
      hmrc: 0,
      vehicle: "car",
      startISO: todayLate.toISOString(),
      endISO: new Date(todayLate.getTime() + 10 * 60 * 1000).toISOString(),
      shiftId: "shift_today_3",
    },
  ];
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
  const trips = createSprintTwoTrips();
  const engine = createJourneyEngineAdapter({
    trustedJourneyDependencies: createJourneyDependencies(trips),
    logger: { info() {}, error() {} },
  });

  await core.registerEngine(engine);
  assert.equal(core.getDiagnostics().tools.length, 5, "discovers all journey tools");

  const okResult = await core.run("How many business miles have I driven this week?");
  assert.equal(okResult.response.success, true, "routes and executes supported request");
  assert.equal(okResult.response.data.currency, "GBP", "returns trusted structured result");
  assert.ok(typeof okResult.response.data.businessMiles === "number", "returns numeric business miles");

  const today = await core.run("Show today's journeys.");
  assert.equal(today.response.success, true, "returns today's journeys through AMOS");
  assert.equal(today.response.data.tripCount, 3, "returns today's trip count from production logic");

  const lastJourney = await core.run("Show my last journey.");
  assert.equal(lastJourney.response.success, true, "returns last journey through AMOS");
  assert.equal(lastJourney.response.data.journeys.length, 1, "limits last journey lookup to one result");
  assert.equal(lastJourney.response.data.journeys[0].id, "trip_today_personal", "returns most recent journey");

  const pending = await core.run("Show my journeys awaiting review.");
  assert.equal(pending.response.success, true, "returns pending reviews through AMOS");
  assert.equal(pending.response.data.pendingCount, 1, "returns journeys awaiting review from production logic");

  const byId = await engine.executeTool(
    "journey.getJourneyById",
    { journeyId: "trip_today_pending" },
    {
      workflowId: "direct_lookup",
      requestText: "direct",
      timestamp: new Date().toISOString(),
    }
  );
  assert.equal(byId.success, true, "executes direct journey lookup tool successfully");
  assert.equal(byId.data.journey.id, "trip_today_pending", "returns requested journey by id");

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
