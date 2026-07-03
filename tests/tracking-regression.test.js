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
  calcSpeedMps,
  shouldResetAutoEndIdle,
  distanceMeters,
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

run("indoor GPS drift does not reset auto-end idle timer", () => {
  const t0 = Date.now();
  const home = point(51.5, -0.12, t0, { acc: 22 });
  const drift = point(51.50003, -0.11997, t0 + 12000, { acc: 28, speedMps: 0 });
  const d = distanceMeters(home, drift);
  const calc = calcSpeedMps(d, drift, home);
  assert.ok(d < ENGINE.AUTO_END_SOFT_MOVE_M, "drift distance stays below auto-end threshold");
  assert.equal(shouldResetAutoEndIdle(d, calc, 0, drift.acc), false);
});

run("slow traffic still resets auto-end idle timer", () => {
  const t0 = Date.now();
  const start = point(51.5, -0.12, t0, { acc: 18, nativeGps: true });
  const creep = point(51.5002, -0.12, t0 + 12000, { acc: 18, nativeGps: true, speedMps: 0 });
  const d = distanceMeters(start, creep);
  const calc = calcSpeedMps(d, creep, start);
  assert.ok(d >= ENGINE.AUTO_END_SOFT_MOVE_M);
  assert.equal(shouldResetAutoEndIdle(d, calc, 0, creep.acc), true);
});

run("real driving movement resets auto-end idle timer", () => {
  const t0 = Date.now();
  const start = point(51.5, -0.12, t0, { acc: 12 });
  const drive = point(51.5005, -0.12, t0 + 10000, { acc: 12, speedMps: 8 });
  const d = distanceMeters(start, drive);
  const calc = calcSpeedMps(d, drive, start);
  assert.ok(d >= ENGINE.AUTO_END_MIN_MOVE_M);
  assert.equal(shouldResetAutoEndIdle(d, calc, 8, drive.acc), true);
});

run("poor GPS accuracy blocks auto-end idle reset", () => {
  const t0 = Date.now();
  const start = point(51.5, -0.12, t0, { acc: 80 });
  const jump = point(51.5005, -0.12, t0 + 10000, { acc: 90, speedMps: 8 });
  const d = distanceMeters(start, jump);
  const calc = calcSpeedMps(d, jump, start);
  assert.equal(shouldResetAutoEndIdle(d, calc, 8, jump.acc), false);
});

run("movementSpeedMps uses calculated speed when device reports zero", () => {
  const t0 = Date.now();
  const prev = point(51.5, -0.12, t0, { nativeGps: true });
  const p = point(51.5002, -0.12, t0 + 12000, { nativeGps: true, speedMps: 0 });
  const d = distanceMeters(prev, p);
  const speed = movementSpeedMps(d, p, prev, 0);
  assert.ok(speed > 0.5, "should not trust device zero when distance shows movement");
});

run("stale low device speed on 5m native hops does not halve mileage", () => {
  const t0 = Date.now();
  const segmentM = 5;
  const segmentLat = segmentM / 111000;
  const targetM = 4828;
  const nSegments = Math.round(targetM / segmentM);
  const pts = [point(51.5, -0.12, t0, { nativeGps: true })];
  for (let i = 1; i <= nSegments; i++) {
    pts.push(
      point(51.5 + i * segmentLat, -0.12, t0 + i * 5000, {
        nativeGps: true,
        speedMps: 0.6,
      })
    );
  }
  const state = simulateDrive(pts);
  const expectedMiles = targetM / 1609.344;
  assert.ok(state.miles > expectedMiles * 0.9, `expected ~${expectedMiles.toFixed(2)} mi, got ${state.miles.toFixed(2)}`);
  assert.ok(state.miles < expectedMiles * 1.1, `expected ~${expectedMiles.toFixed(2)} mi, got ${state.miles.toFixed(2)}`);
});

run("small GPS segments accumulate via pendingMeters odometer", () => {
  const t0 = Date.now();
  const segmentM = 3.5;
  const segmentLat = segmentM / 111000;
  const nSegments = Math.round(4828 / segmentM);
  const pts = [point(51.5, -0.12, t0, { nativeGps: true, speedMps: 0 })];
  for (let i = 1; i <= nSegments; i++) {
    pts.push(point(51.5 + i * segmentLat, -0.12, t0 + i * 2000, { nativeGps: true, speedMps: 0 }));
  }
  const state = simulateDrive(pts);
  const expectedMiles = (nSegments * segmentM) / 1609.344;
  assert.ok(state.miles > expectedMiles * 0.9, `expected ~${expectedMiles.toFixed(2)} mi, got ${state.miles.toFixed(2)}`);
  assert.ok(state.miles < expectedMiles * 1.1, `expected ~${expectedMiles.toFixed(2)} mi, got ${state.miles.toFixed(2)}`);
});

console.log(`\nTracking regression: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
