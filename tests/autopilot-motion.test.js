/**
 * MP-047 — AutoPilot motion detection unit tests
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

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

function loadMotion(ls, extra) {
  const sandbox = {
    console,
    Date,
    Math,
    localStorage: ls,
    window: {},
    globalThis: {},
    setInterval: () => 1,
    clearInterval: () => {},
    setTimeout: (fn) => {
      if (typeof fn === 'function') fn();
      return 1;
    },
  };
  sandbox.window = sandbox.globalThis;
  Object.assign(sandbox, extra || {});
  const src = fs.readFileSync(path.join(root, 'frontend/js/autopilot-motion.js'), 'utf8');
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPAutoPilotMotion;
}

let passed = 0;
let failed = 0;

function run(name, fn) {
  try {
    fn();
    console.log('✓ ' + name);
    passed++;
  } catch (e) {
    console.error('✗ ' + name);
    console.error('  ' + e.message);
    failed++;
  }
}

function drivingSample(t, speedMps) {
  return { lat: 51.5 + t * 0.0001, lon: -0.1, acc: 25, t: t, speedMps: speedMps };
}

run('OFF when AutoPilot disabled', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  M.init({ isEnabled: () => false, isShiftActive: () => false });
  assert.equal(M.getState(), M.STATES.OFF);
});

run('walking speed does not reach candidate', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  let state = M.STATES.ARMED;
  M.init({
    isEnabled: () => true,
    isShiftActive: () => false,
    hasPermissions: () => true,
    onStateChange: (_p, n) => {
      state = n;
    },
  });
  M.onGpsSample(drivingSample(1000, 1.5));
  M.onGpsSample(drivingSample(15000, 1.8));
  assert.notEqual(state, M.STATES.MOVING_CANDIDATE);
});

run('sustained driving triggers auto-start', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  let started = false;
  M.init({
    isEnabled: () => true,
    isShiftActive: () => false,
    hasPermissions: () => true,
    canStartTrip: () => true,
    onAutoStart: () => {
      started = true;
      return true;
    },
  });
  const base = Date.now() - 140000;
  for (let i = 0; i < 10; i++) {
    M.onGpsSample(drivingSample(base + i * 15000, 6));
  }
  assert.equal(started, true);
  assert.equal(M.getState(), M.STATES.TRACKING);
});

run('short movement does not start trip', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  let started = false;
  M.init({
    isEnabled: () => true,
    isShiftActive: () => false,
    hasPermissions: () => true,
    canStartTrip: () => true,
    onAutoStart: () => {
      started = true;
      return true;
    },
  });
  M.onGpsSample(drivingSample(1000, 8));
  M.onGpsSample(drivingSample(4000, 7));
  assert.equal(started, false);
});

run('poor GPS blocks candidate', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  let state = M.STATES.ARMED;
  M.init({
    isEnabled: () => true,
    isShiftActive: () => false,
    hasPermissions: () => true,
    onStateChange: (_p, n) => {
      state = n;
    },
  });
  M.onGpsSample({ lat: 51.5, lon: -0.1, acc: 200, t: Date.now(), speedMps: 10 });
  assert.notEqual(state, M.STATES.MOVING_CANDIDATE);
});

run('auto business defaults true, pending when off', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  assert.equal(M.getTripStatusForSave(), 'business');
  M.setAutoBusiness(false);
  assert.equal(M.getTripStatusForSave(), 'pending');
});

run('driving speed threshold ~10 mph', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  assert.equal(M.isDrivingSpeed(4.47), true);
  assert.equal(M.isDrivingSpeed(2), false);
});

run('auto-start passes candidate route meta', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  let meta = null;
  M.init({
    isEnabled: () => true,
    isShiftActive: () => false,
    hasPermissions: () => true,
    canStartTrip: () => true,
    onAutoStart: (m) => {
      meta = m;
      return true;
    },
  });
  const base = Date.now() - 140000;
  for (let i = 0; i < 10; i++) {
    M.onGpsSample(drivingSample(base + i * 15000, 6));
  }
  assert.ok(meta);
  assert.ok(meta.candidateStartedAt > 0);
  assert.ok(Array.isArray(meta.candidateRoute));
  assert.ok(meta.candidateRoute.length >= 2);
});

run('manual shift active keeps TRACKING state', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  M.init({
    isEnabled: () => true,
    isShiftActive: () => true,
    hasPermissions: () => true,
  });
  M.onTripStarted({ manual: true });
  assert.equal(M.getState(), M.STATES.TRACKING);
});

console.log('\nAutoPilot motion: ' + passed + ' passed, ' + failed + ' failed\n');
if (failed) process.exit(1);
