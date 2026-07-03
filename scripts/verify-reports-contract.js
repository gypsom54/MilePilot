#!/usr/bin/env node
/**
 * MilePilot Reports Contract Verifier (MP-044)
 * Fails CI if report scheduling, PDF, or email pipeline is removed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contract = JSON.parse(fs.readFileSync(path.join(__dirname, "reports-contract.json"), "utf8"));

if (contract.vital) {
  console.log("\n⚠️  VITAL SYSTEM — " + (contract.businessCritical || "Business critical report pipeline") + "\n");
}

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
  pass(`file ${rel}`);
}

for (const rel of contract.companionFiles || []) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) fail(`Missing companion file: ${rel}`);
  else pass(`companion ${rel}`);
}

for (const entry of contract.requiredExports || []) {
  const filePath = path.join(root, entry.file);
  if (!fs.existsSync(filePath)) {
    fail(`Missing export file: ${entry.file}`);
    continue;
  }
  const src = fs.readFileSync(filePath, "utf8");
  const exportPattern = new RegExp(
    `(export\\s+(async\\s+)?function\\s+${entry.symbol}\\b|export\\s*\\{[^}]*\\b${entry.symbol}\\b|export\\s*\\*\\s+from)`
  );

  if (!exportPattern.test(src)) fail(`${entry.file}: missing export ${entry.symbol}`);
  else pass(`${entry.file}: ${entry.symbol}`);
}

for (const entry of contract.requiredPatterns || []) {
  const rel = entry.file || entry;
  const pattern = entry.pattern || entry;
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    fail(`Missing pattern file: ${rel}`);
    continue;
  }
  const src = fs.readFileSync(filePath, "utf8");
  if (!src.includes(pattern)) fail(`${rel}: missing pattern "${pattern}"`);
  else pass(`${rel}: "${pattern.slice(0, 40)}${pattern.length > 40 ? "…" : ""}"`);
}

for (const rel of contract.tripPersistenceFiles || []) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    fail(`Missing trip persistence file: ${rel}`);
    continue;
  }
  const src = fs.readFileSync(filePath, "utf8");
  for (const pattern of contract.tripPersistencePatterns || []) {
    if (!src.includes(pattern)) fail(`${rel}: missing trip pattern "${pattern}"`);
    else pass(`${rel}: ${pattern}`);
  }
}

if (failed) {
  console.error("\nREPORTS CONTRACT VIOLATION — scheduling, PDF, or email pipeline may be broken.");
  console.error("See docs/PRODUCTION_MONITORING_PLAN.md and docs/CRITICAL_FILES.md\n");
  process.exit(1);
}

console.log("\nReports contract OK (" + contract.id + " v" + contract.version + ")\n");
