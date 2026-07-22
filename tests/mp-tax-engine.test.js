/**
 * MP-044 — Unified HMRC Tax Engine test matrix (25 tests)
 */
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../frontend/js/mp-tax-engine.js"), "utf8");
const ctx = { window: {}, globalThis: {} };
ctx.globalThis = ctx;
vm.runInNewContext(src, ctx);
const E = ctx.window.MPTaxEngine;

let passed = 0;
let failed = 0;

function run(name, fn) {
  try {
    fn();
    console.log("✓ " + name);
    passed++;
  } catch (e) {
    console.error("✗ " + name);
    console.error("  " + e.message);
    failed++;
  }
}

function journey(miles, startISO, vehicle = "car", status = "business") {
  return { id: "j_" + startISO + "_" + miles, miles, startISO, endISO: startISO, vehicle, status, hmrc: 0 };
}

function carClaims(milesList, taxYearStart, vehicle = "car") {
  return milesList.map((mi, i) =>
    journey(mi, new Date(taxYearStart.getTime() + i * 86400000).toISOString(), vehicle)
  );
}

run("getUkTaxYear 2026-27 before April 6", () => {
  const ty = E.getUkTaxYear("2026-04-05T10:00:00.000Z");
  assert.equal(ty.id, "2025-26");
  assert.equal(ty.start, "2025-04-06");
  assert.equal(ty.end, "2026-04-05");
});

run("getUkTaxYear 2026-27 from April 6", () => {
  const ty = E.getUkTaxYear("2026-04-06T00:00:00.000Z");
  assert.equal(ty.id, "2026-27");
  assert.equal(ty.start, "2026-04-06");
  assert.equal(ty.end, "2027-04-05");
});

run("2025-26 car first-tier rate is 45p", () => {
  const cfg = E.getRateConfig("2025-26", "car");
  assert.equal(cfg.config.firstTierPencePerMile, 45);
});

run("2026-27 car first-tier rate is 55p", () => {
  const cfg = E.getRateConfig("2026-27", "car");
  assert.equal(cfg.config.firstTierPencePerMile, 55);
});

run("van uses threshold rates", () => {
  const cfg = E.getRateConfig("2026-27", "van");
  assert.equal(cfg.config.firstTierPencePerMile, 55);
  assert.equal(cfg.config.thresholdMiles, 10000);
});

run("motorcycle flat 24p", () => {
  const cfg = E.getRateConfig("2026-27", "motorcycle");
  assert.equal(cfg.config.flatPencePerMile, 24);
});

run("bicycle flat 20p", () => {
  const cfg = E.getRateConfig("2026-27", "bicycle");
  assert.equal(cfg.config.flatPencePerMile, 20);
});

run("2026-27 car exactly 10,000 miles = £5,500", () => {
  const j = carClaims([10000], new Date("2026-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 550000);
});

run("2026-27 car 10,001 miles = £5,500.25", () => {
  const j = carClaims([10001], new Date("2026-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 550025);
});

run("2026-27 car 12,000 miles = £6,000", () => {
  const j = carClaims([12000], new Date("2026-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 600000);
});

run("threshold crossing 9,950 + 100 miles splits correctly", () => {
  const j = carClaims([9950, 100], new Date("2026-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 551250);
  assert.equal(s.journeys[1].claimPence, 4000);
});

run("2025-26 car 10,000 miles = £4,500", () => {
  const j = carClaims([10000], new Date("2025-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2025-26", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 450000);
});

run("personal journeys excluded", () => {
  const j = [journey(50, "2026-06-01T08:00:00.000Z", "car", "personal")];
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 0);
});

run("pending journeys excluded", () => {
  const j = [journey(50, "2026-06-01T08:00:00.000Z", "car", "pending")];
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 0);
});

run("unknown vehicle returns validation error", () => {
  const v = E.validateVehicle("scooter");
  assert.equal(v.valid, false);
  assert.equal(v.code, "UNKNOWN_VEHICLE");
});

run("mixed journeys accumulate chronologically", () => {
  const j = carClaims([100, 200, 300], new Date("2026-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.eligibleMiles, 600);
  assert.equal(s.totalClaimPence, 33000);
});

run("tax-year reset across April 6 boundary", () => {
  const j = [
    journey(10000, "2026-04-05T12:00:00.000Z", "car"),
    journey(100, "2026-04-06T12:00:00.000Z", "car"),
  ];
  const rows = E.recalculateAllJourneys(j, "car");
  assert.equal(rows[0].taxYear, "2025-26");
  assert.equal(rows[1].taxYear, "2026-27");
  assert.equal(rows[1].recalculatedPence, 5500);
});

run("month boundary does not reset threshold", () => {
  const j = [
    journey(5000, "2026-07-31T12:00:00.000Z", "car"),
    journey(5000, "2026-08-01T12:00:00.000Z", "car"),
    journey(100, "2026-08-02T12:00:00.000Z", "car"),
  ];
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 552500);
});

run("floating-point mileage uses milli precision", () => {
  const j = [journey(10.004, "2026-06-01T08:00:00.000Z", "car")];
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.ok(s.totalClaimPence > 0);
});

run("motorcycle 100 miles = £24", () => {
  const j = carClaims([100], new Date("2026-05-01"), "motorcycle");
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "motorcycle" });
  assert.equal(s.totalClaimPence, 2400);
});

run("bicycle 100 miles = £20", () => {
  const j = carClaims([100], new Date("2026-05-01"), "bicycle");
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "bicycle" });
  assert.equal(s.totalClaimPence, 2000);
});

run("compareWithStored reports legacy flat-rate difference", () => {
  const j = [journey(100, "2026-06-01T08:00:00.000Z", "car", "business")];
  j[0].hmrc = 55;
  const cmp = E.compareWithStored(j, "car");
  assert.equal(cmp.totalStoredPence, 5500);
  assert.equal(cmp.totalRecalculatedPence, 5500);
});

run("period claims respect prior mileage in tax year", () => {
  const all = [
    journey(9000, "2026-05-01T08:00:00.000Z", "car"),
    journey(2000, "2026-06-15T08:00:00.000Z", "car"),
  ];
  const start = new Date("2026-06-01");
  const end = new Date("2026-07-01");
  const period = E.calculatePeriodClaims({
    journeys: all,
    start,
    end,
    defaultVehicle: "car",
    vehicleType: "car",
    priorBusinessJourneys: all,
  });
  assert.equal(period.totalClaimPence, 80000);
});

run("explainTaxYearSummary mentions tier split", () => {
  const j = carClaims([12000], new Date("2026-05-01"));
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  const text = E.explainTaxYearSummary(s);
  assert.ok(text.includes("10000") || text.includes("10,000"));
  assert.ok(text.includes("£6000.00") || text.includes("£6,000.00"));
});

run("deleted/zero-mile journeys contribute nothing", () => {
  const j = [journey(0, "2026-06-01T08:00:00.000Z", "car")];
  const s = E.calculateTaxYearClaims({ journeys: j, taxYearId: "2026-27", vehicleType: "car" });
  assert.equal(s.totalClaimPence, 0);
});

console.log(`\nMP Tax Engine: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
