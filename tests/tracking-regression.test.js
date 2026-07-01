/**
 * VITAL — Background GPS / trip tracking regression tests (MP-043)
 */
import assert from "node:assert/strict";
import {
  ENGINE,
  createShiftState,
  processGpsPoint,
  buildActiveShiftPayload,
  restoreShiftState,
  simulateDrive,
  point,
  movementSpeedMps,
} from "./tracking-engine-core.js";

function test(name, fn) {
  try {
    fn();
    console.log("✓ " + name);
    return true;
  } catch (e) {
    console.error("✗ " + name);
    console.error("  " + e.message);
    return false;
  }
}

let passed = 0;
let failed = 0;

function run(name, fn) {
  if (test(name, fn)) passed++;
  else failed++;
}

// --- Native speed gate: fast bursts must still accumulate miles ---
run("native GPS bursts accumulate miles (speed gate)", () => {
  const t0 = Date.now();
  const pts = [
    point(51.5, -0.12, t0, { nativeGps: true }),
    point(51.501, -0.12, t0 + 200, { nativeGps: true }),
    point(51.502, -0.12, t0 + 400, { nativeGps: true }),
    point(51.503, -0.12, t0 + 600, { nativeGps: true }),
  ];
  const state = simulateDrive(pts);
  assert.ok(state.miles > 0.01, "miles should increase with native burst points");
});

// --- Lock screen: nativeGps points continue when WebView is hidden ---
run("lock-screen tracking continues via nativeGps bursts", () => {
  const t0 = Date.now();
  let state = createShiftState();
  state = processGpsPoint(state, point(51.5, -0.12, t0, { nativeGps: true }));
  state = processGpsPoint(state, point(51.501, -0.12, t0 + 8000, { nativeGps: true, speedMps: 8 }));
  state = processGpsPoint(state, point(51.503, -0.12, t0 + 16000, { nativeGps: true, speedMps: 8 }));
  assert.ok(state.miles > 0.01, "nativeGps must record miles while screen is locked");
});

// --- Background: points after long gap still process ---
run("tracking continues after background gap (nativeGps reconnect)", () => {
  const t0 = Date.now();
  let state = createShiftState();
  state = processGpsPoint(state, point(51.5, -0.12, t0, { nativeGps: true }));
  state = processGpsPoint(state, point(51.502, -0.12, t0 + 5000, { nativeGps: true }));
  const gap = 5 * 60 * 1000;
  const milesBefore = state.miles;
  // Large jump discarded (simulates GPS reconnect) — lastPoint bridges forward
  state = processGpsPoint(state, point(51.52, -0.12, t0 + gap, { nativeGps: true, speedMps: 12 }));
  state = processGpsPoint(state, point(51.522, -0.12, t0 + gap + 15000, { nativeGps: true, speedMps: 12 }));
  assert.ok(state.miles > milesBefore, "miles should accumulate after gap once GPS resumes");
});

// --- Background polling: multiple points over time ---
run("background polling simulation accumulates miles", () => {
  const t0 = Date.now();
  const interval = ENGINE.BG_GPS_POLL_MS;
  const pts = [];
  for (let i = 0; i < 8; i++) {
    pts.push(point(51.5 + i * 0.002, -0.12, t0 + i * interval, { nativeGps: true }));
  }
  const state = simulateDrive(pts);
  assert.ok(state.miles > 0.05, "background poll interval should record meaningful miles");
});

// --- Stationary: short stop does NOT end trip (only records stop event) ---
run("short stationary period does not end trip", () => {
  const t0 = Date.now();
  let state = createShiftState();
  state = processGpsPoint(state, point(51.5, -0.12, t0));
  state = processGpsPoint(state, point(51.5, -0.12, t0 + 30000)); // 30s same spot
  assert.equal(state.ccState ?? "active", "active", "trip must remain active");
  assert.ok(state.miles >= 0, "trip still valid");
  // STOP_AFTER_MS is 90s — 30s should not create stop yet
  assert.equal(state.shiftStops.length, 0, "no stop recorded before STOP_AFTER_MS");
});

run("stationary timeout records stop but trip continues", () => {
  const t0 = Date.now();
  let state = createShiftState();
  const loc = { lat: 51.5, lon: -0.12 };
  state = processGpsPoint(state, point(loc.lat, loc.lon, t0));
  state = processGpsPoint(state, point(loc.lat, loc.lon, t0 + 5000));
  state = processGpsPoint(state, point(loc.lat, loc.lon, t0 + 5000 + ENGINE.STOP_AFTER_MS + 1000));
  assert.equal(state.shiftStops.length, 1, "stop recorded after STOP_AFTER_MS");
  state = processGpsPoint(state, point(51.5005, loc.lon, t0 + 5000 + ENGINE.STOP_AFTER_MS + 20000));
  assert.ok(state.miles > 0, "miles continue after stationary stop");
});

// --- Trip persistence roundtrip ---
run("active shift payload persists and restores correctly", () => {
  const t0 = Date.now();
  const driven = simulateDrive([
    point(51.5, -0.12, t0),
    point(51.51, -0.12, t0 + 60000),
    point(51.52, -0.12, t0 + 120000),
  ]);
  driven.startedAt = t0 - 3600000;
  driven.elapsed = 3600;
  const payload = buildActiveShiftPayload(driven);
  const json = JSON.stringify(payload);
  const restored = restoreShiftState(JSON.parse(json));
  assert.equal(restored.miles.toFixed(3), driven.miles.toFixed(3));
  assert.equal(restored.routePoints.length, driven.routePoints.length);
  assert.ok(restored.lastPoint);
});

// --- Accuracy gate lives in handlePos; engine records all points passed in ---
run("processGpsPoint records movement regardless of acc (acc filtered in handlePos)", () => {
  const t0 = Date.now();
  let state = createShiftState();
  state = processGpsPoint(state, point(51.5, -0.12, t0, { acc: 100 }));
  state = processGpsPoint(state, point(51.5003, -0.12, t0 + 10000, { acc: 180 }));
  assert.ok(state.miles > 0, "engine records when points reach processGpsPoint");
});

// --- Engine constants locked ---
run("STOP_AFTER_MS is 90 seconds (stationary grace)", () => {
  assert.equal(ENGINE.STOP_AFTER_MS, 90000);
});

run("BG_GPS_POLL_MS is 12 seconds", () => {
  assert.equal(ENGINE.BG_GPS_POLL_MS, 12000);
});

run("ACC_SOFT_MAX allows weak signal in handlePos layer", () => {
  assert.equal(ENGINE.ACC_SOFT_MAX, 220);
  assert.ok(ENGINE.ACC_SOFT_MAX > ENGINE.ACC_MAX, "soft max is more permissive than hard max");
});

console.log(`\nTracking regression: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
