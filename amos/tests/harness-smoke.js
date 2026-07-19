import { AmosCore, createJourneyEngineAdapter } from "../core/index.js";
import { createJourneyDependencies, loadFixtureTrips } from "./helpers.js";

const fixtureTrips = loadFixtureTrips();

async function main() {
  const amos = new AmosCore();
  const adapter = createJourneyEngineAdapter({
    trustedJourneyDependencies: createJourneyDependencies(fixtureTrips),
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
