/**
 * MP-044 — Legacy HMRC comparison report (no migration)
 * Compares stored trip.hmrc values with MPTaxEngine recalculated claims.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../frontend/js/mp-tax-engine.js"), "utf8");
const ctx = { window: {}, globalThis: {} };
ctx.globalThis = ctx;
vm.runInNewContext(src, ctx);
const E = ctx.window.MPTaxEngine;

function loadSampleJourneys() {
  const samples = [
    { id: "s1", status: "business", miles: 24.5, vehicle: "car", startISO: "2026-06-30T08:00:00.000Z", hmrc: 13.48 },
    { id: "s2", status: "business", miles: 10000, vehicle: "car", startISO: "2026-05-01T08:00:00.000Z", hmrc: 5500 },
    { id: "s3", status: "business", miles: 100, vehicle: "car", startISO: "2026-06-15T08:00:00.000Z", hmrc: 55 },
    { id: "s4", status: "pending", miles: 12, vehicle: "car", startISO: "2026-06-20T08:00:00.000Z", hmrc: 0 },
    { id: "s5", status: "business", miles: 50, vehicle: "motorcycle", startISO: "2026-06-10T08:00:00.000Z", hmrc: 27.5 },
  ];
  return samples;
}

const journeys = loadSampleJourneys();
const report = E.compareWithStored(journeys, "car");

console.log("MP-044 Legacy HMRC Comparison Report");
console.log("==================================");
console.log("Stored total:      " + E.formatPence(report.totalStoredPence));
console.log("Recalculated total:" + E.formatPence(report.totalRecalculatedPence));
console.log("Difference:        " + E.formatPence(report.totalDiffPence));
console.log("");
console.log("Per journey:");
report.rows.forEach(function (r) {
  if (r.recalculatedPence == null) return;
  console.log(
    [
      r.id || "(no id)",
      (r.miles || 0) + " mi",
      "stored " + E.formatPence(r.storedHmrcPence || 0),
      "recalc " + E.formatPence(r.recalculatedPence || 0),
      "diff " + E.formatPence(r.diffPence || 0),
    ].join(" · ")
  );
});

const outPath = path.join(__dirname, "../docs/MP-044-LEGACY-COMPARISON.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log("\nWritten: " + outPath);
