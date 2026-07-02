/**
 * Report collection regression — shift must appear even when business trips exist
 */
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}

function loadSummaryReports(ls) {
  const src = fs.readFileSync(path.join(root, "frontend/js/summary-reports.js"), "utf8");
  const sandbox = {
    console,
    Date,
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout,
    localStorage: ls,
    window: {},
    globalThis: {},
  };
  sandbox.window = sandbox.globalThis;
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPSummaryReports;
}

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

run("daily report includes newly ended shift when older business trips exist", () => {
  const now = new Date("2026-06-29T12:00:00.000Z");
  const M = loadSummaryReports(createMockLocalStorage());
  M.init({
    getEmail: () => "driver@example.com",
    getDriver: () => "Alex",
    getFrequency: () => "daily",
    getTrips: () => [
      {
        id: "trip_old",
        status: "business",
        miles: 5,
        seconds: 3600,
        startISO: "2026-06-01T08:00:00.000Z",
        endISO: "2026-06-01T09:00:00.000Z",
        shiftId: "shift_old",
        vehicle: "car",
        hmrc: 2.75,
      },
    ],
    getShifts: () => [
      {
        id: "shift_new",
        miles: 12,
        seconds: 1800,
        startISO: "2026-06-29T08:00:00.000Z",
        endISO: "2026-06-29T10:00:00.000Z",
        vehicle: "car",
        hmrc: 6.6,
        date: "29/06/2026",
      },
    ],
    fmt: (s) => String(s) + "s",
    apiPost: async () => ({ res: { ok: true }, data: { sent: true } }),
    getHmrcRate: () => 0.55,
  });
  const payload = M.buildPayload("Daily", now);
  const ids = payload.shifts.map((s) => s.id);
  assert.ok(ids.includes("shift_new"), "new shift must be in daily payload");
  assert.ok(payload.totals.miles >= 12, "daily totals must include new shift miles");
});

console.log(`\nSummary reports collect: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
