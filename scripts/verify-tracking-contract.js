#!/usr/bin/env node
/**
 * MilePilot Tracking Contract Verifier
 * Fails CI if background GPS resilience is removed from the PWA.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contract = JSON.parse(fs.readFileSync(path.join(__dirname, "tracking-contract.json"), "utf8"));

let failed = false;

function fail(msg) {
  console.error("✗ " + msg);
  failed = true;
}

function pass(msg) {
  console.log("✓ " + msg);
}

for (const rel of contract.files) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    fail(`Missing tracked file: ${rel}`);
    continue;
  }

  const src = fs.readFileSync(filePath, "utf8");
  console.log(`\nVerifying ${rel}…`);

  for (const name of contract.requiredConstants) {
    if (!src.includes(name)) fail(`${rel}: missing constant ${name}`);
    else pass(`${rel}: ${name}`);
  }

  for (const name of contract.requiredFunctions) {
    const fnPattern = new RegExp(`function\\s+${name}\\s*\\(`);
    if (!fnPattern.test(src)) fail(`${rel}: missing function ${name}()`);
    else pass(`${rel}: ${name}()`);
  }

  for (const pattern of contract.requiredPatterns) {
    if (!src.includes(pattern)) fail(`${rel}: missing pattern "${pattern}"`);
    else pass(`${rel}: pattern "${pattern.slice(0, 48)}${pattern.length > 48 ? "…" : ""}"`);
  }

  const engineMatch = src.match(/TRACKING_ENGINE_V\s*=\s*(\d+)/);
  const engineV = engineMatch ? Number(engineMatch[1]) : 0;
  if (engineV < contract.minTrackingEngineVersion) {
    fail(`${rel}: TRACKING_ENGINE_V=${engineV} is below minimum ${contract.minTrackingEngineVersion}`);
  } else {
    pass(`${rel}: TRACKING_ENGINE_V=${engineV}`);
  }
}

if (failed) {
  console.error("\nTRACKING CONTRACT VIOLATION — background GPS resilience may be broken.");
  console.error("See docs/TRACKING_CONTRACT.md before changing tracking code.\n");
  process.exit(1);
}

console.log("\nTracking contract OK (" + contract.id + ")\n");
