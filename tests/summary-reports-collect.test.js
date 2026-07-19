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

run("night shift daily report fires 90 minutes after shift ends", () => {
  const M = loadSummaryReports(createMockLocalStorage());
  const shiftEnd = new Date("2026-06-29T04:00:00.000Z");
  const fireAt = M.computeDailyReportFireAt(shiftEnd.toISOString());
  const expected = shiftEnd.getTime() + 90 * 60 * 1000;
  assert.equal(fireAt, expected);
});

run("day shift daily report fires at 11:59pm when later than 90 minutes", () => {
  const M = loadSummaryReports(createMockLocalStorage());
  const shiftEnd = new Date("2026-06-29T17:00:00");
  const fireAt = M.computeDailyReportFireAt(shiftEnd.toISOString());
  const endOfDay = new Date(shiftEnd);
  endOfDay.setHours(23, 59, 0, 0);
  assert.equal(fireAt, endOfDay.getTime());
});

run("daily frequency schedules report instead of sending immediately on shift end", () => {
  const ls = createMockLocalStorage();
  const M = loadSummaryReports(ls);
  let apiCalls = 0;
  M.init({
    getEmail: () => "driver@example.com",
    getDriver: () => "Alex",
    getFrequency: () => "daily",
    getTrips: () => [],
    getShifts: () => [
      {
        id: "shift_night",
        miles: 40,
        seconds: 14400,
        startISO: "2026-06-29T18:00:00.000Z",
        endISO: "2026-06-29T04:00:00.000Z",
        vehicle: "car",
        hmrc: 22,
        date: "29/06/2026",
      },
    ],
    fmt: (s) => String(s) + "s",
    apiPost: async () => {
      apiCalls++;
      return { res: { ok: true }, data: { sent: true } };
    },
    getHmrcRate: () => 0.55,
  });
  M.onShiftEnded(
    {
      id: "shift_night",
      miles: 40,
      endISO: "2026-06-29T04:00:00.000Z",
    },
    "auto"
  );
  assert.equal(apiCalls, 0, "daily should not email immediately on shift end");
  const pending = M.getPendingReport();
  assert.ok(pending, "pending daily report should be stored");
  assert.equal(pending.type, "Daily");
  assert.ok(pending.fireAt > Date.parse("2026-06-29T04:00:00.000Z"));
});

run("weekly frequency does not send immediately on shift end", async () => {
  const ls = createMockLocalStorage();
  const M = loadSummaryReports(ls);
  let apiCalls = 0;
  M.init({
    getEmail: () => "driver@example.com",
    getDriver: () => "Alex",
    getFrequency: () => "weekly",
    getTrips: () => [],
    getShifts: () => [],
    fmt: (s) => String(s) + "s",
    apiPost: async () => {
      apiCalls++;
      return { res: { ok: true }, data: { sent: true } };
    },
    getHmrcRate: () => 0.55,
  });

  const res = await M.onShiftEnded({ id: "shift_weekly", endISO: "2026-06-29T18:00:00.000Z" }, "auto");
  assert.equal(apiCalls, 0, "weekly should not email immediately on shift end");
  assert.equal(res && res.skipped, true);
});

run("manual frequency blocks automatic report sends", async () => {
  const ls = createMockLocalStorage();
  const M = loadSummaryReports(ls);
  let apiCalls = 0;
  M.init({
    getEmail: () => "driver@example.com",
    getDriver: () => "Alex",
    getFrequency: () => "off",
    getTrips: () => [],
    getShifts: () => [],
    fmt: (s) => String(s) + "s",
    apiPost: async () => {
      apiCalls++;
      return { res: { ok: true }, data: { sent: true } };
    },
    getHmrcRate: () => 0.55,
  });

  const res = await M.onShiftEnded({ id: "shift_manual", endISO: "2026-06-29T18:00:00.000Z" }, "manual");
  assert.equal(apiCalls, 0, "manual should block automatic emails");
  assert.equal(res && res.reason, "reports_off");
});

run("duplicate daily and weekly sends are blocked by dedupe keys", async () => {
  const ls = createMockLocalStorage();
  const M = loadSummaryReports(ls);
  let apiCalls = 0;
  M.init({
    getEmail: () => "driver@example.com",
    getDriver: () => "Alex",
    getFrequency: () => "daily",
    getTrips: () => [
      {
        id: "trip_daily",
        status: "business",
        miles: 10,
        seconds: 1800,
        startISO: "2026-06-29T08:00:00.000Z",
        endISO: "2026-06-29T08:30:00.000Z",
        vehicle: "car",
        hmrc: 5.5,
      },
      {
        id: "trip_weekly",
        status: "business",
        miles: 12,
        seconds: 2200,
        startISO: "2026-06-28T09:00:00.000Z",
        endISO: "2026-06-28T09:40:00.000Z",
        vehicle: "car",
        hmrc: 6.6,
      },
    ],
    getShifts: () => [],
    fmt: (s) => String(s) + "s",
    apiPost: async () => {
      apiCalls++;
      return { res: { ok: true }, data: { sent: true } };
    },
    getHmrcRate: () => 0.55,
  });

  const dailyAt = new Date("2026-06-29T23:59:00.000Z");
  const weekAt = new Date("2026-06-28T23:59:00.000Z");

  const d1 = await M.sendAutomaticReport("Daily", dailyAt);
  const d2 = await M.sendAutomaticReport("Daily", dailyAt);
  const w1 = await M.sendAutomaticReport("Weekly", weekAt);
  const w2 = await M.sendAutomaticReport("Weekly", weekAt);

  assert.equal(d1 && d1.sent, true, "first daily send should succeed");
  assert.equal(d2 && d2.reason, "already_sent", "second daily send should be deduped");
  assert.equal(w1 && w1.sent, true, "first weekly send should succeed");
  assert.equal(w2 && w2.reason, "already_sent", "second weekly send should be deduped");
  assert.equal(apiCalls, 2, "only first daily and first weekly sends should hit API");
});

console.log(`\nSummary reports collect: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
