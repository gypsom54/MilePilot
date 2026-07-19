import { AmosCore, createJourneyEngineAdapter } from "../core/index.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureTrips = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../tests/fixtures/amos-week-trips.json"), "utf8")
);

function createMemoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed).map(([k, v]) => [k, String(v)]));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

async function main() {
  const amos = new AmosCore();
  const adapter = createJourneyEngineAdapter({
    trustedSummaryDependencies: {
      localStorage: createMemoryStorage(),
      getEmail: () => "driver@example.com",
      getDriver: () => "Driver",
      getFrequency: () => "weekly",
      getTrips: () => fixtureTrips,
      getShifts: () => [],
      fmt: (seconds) => `${seconds}s`,
      apiPost: async () => ({ res: { ok: true }, data: { sent: true } }),
      getHmrcRate: () => 0.55,
    },
  });

  await amos.registerEngine(adapter);

  const request = "How many business miles have I driven this week?";
  const result = await amos.run(request);

  console.log("REQUEST:", request);
  console.log("WORKFLOW:", result.workflowId);
  console.log("RESPONSE:", JSON.stringify(result.response, null, 2));
  console.log("AUDIT:", JSON.stringify(amos.getDiagnostics().audits.at(-1), null, 2));
}

main().catch((error) => {
  console.error("AMOS harness failed:", error?.message || String(error));
  process.exit(1);
});
