import { runEngineRegistryTests } from "./engine-registry.test.js";
import { runToolRegistryTests } from "./tool-registry.test.js";
import { runIntentRouterTests } from "./intent-router.test.js";
import { runWorkflowRunnerTests } from "./workflow-runner.test.js";

let passed = 0;
let failed = 0;

async function run(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    passed += 1;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error("  " + (error?.message || String(error)));
    failed += 1;
  }
}

await run("Engine Registry", runEngineRegistryTests);
await run("Tool Registry", runToolRegistryTests);
await run("Intent Router", runIntentRouterTests);
await run("Workflow Runner", runWorkflowRunnerTests);

console.log(`\nAMOS tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
