import { AmosCore, createJourneyEngineAdapter } from "../amos/core/index.js";
import { createMemoryStorage } from "../amos/core/trusted-summary-reports-loader.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildDependencies(payload) {
  const trips = asArray(payload?.trips);
  const shifts = asArray(payload?.shifts);
  const vehicle = asText(payload?.vehicle) || "car";
  const hmrcRate = asNumber(payload?.hmrcRate, 0.55);

  return {
    localStorage: createMemoryStorage({
      mp_trips: JSON.stringify(trips),
      mp_vehicle: vehicle,
    }),
    getEmail: () => asText(payload?.email) || "",
    getDriver: () => asText(payload?.driver) || "",
    getFrequency: () => "weekly",
    getVehicle: () => vehicle,
    getTrips: () => trips,
    getShifts: () => shifts,
    fmt: (seconds) => `${Math.max(0, Number(seconds) || 0)}s`,
    apiPost: async () => ({ res: { ok: true }, data: { sent: true } }),
    getHmrcRate: () => hmrcRate,
  };
}

export async function runAmosQuery(payload) {
  const requestText = asText(payload?.query || payload?.requestText);
  if (!requestText) {
    return {
      ok: false,
      statusCode: 400,
      message: "A query is required.",
    };
  }

  const deps = buildDependencies(payload);
  const core = new AmosCore({ logger: { info() {}, error() {} } });

  await core.registerEngine(
    createJourneyEngineAdapter({
      trustedJourneyDependencies: deps,
      trustedSummaryDependencies: deps,
      logger: { info() {}, error() {} },
    })
  );

  const result = await core.run(requestText);
  return {
    ok: true,
    statusCode: 200,
    result,
  };
}
