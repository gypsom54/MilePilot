/**
 * MP-045 — Trip auto-end inactivity service unit tests
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

function loadTripAutoEnd(ls) {
  const src = fs.readFileSync(path.join(root, 'frontend/js/trip-auto-end.js'), 'utf8');
  const sandbox = {
    console,
    Date,
    localStorage: ls,
    window: {},
    globalThis: {},
  };
  sandbox.window = sandbox.globalThis;
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPTripAutoEnd;
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

run('timer starts when trip begins', () => {
  const ls = createMockLocalStorage();
  const M = loadTripAutoEnd(ls);
  const t0 = Date.now();
  M.onTripStarted('shift_1', t0);
  const dbg = M.getDebugState(true);
  assert.equal(dbg.tripStatus, 'active');
  assert.equal(dbg.lastMovementAt, t0);
  assert.ok(dbg.countdownMs >= 89 * 60 * 1000);
});

run('movement resets inactivity timer', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '60000');
  const M = loadTripAutoEnd(ls);
  const t0 = 1_700_000_000_000;
  M.onTripStarted('shift_1', t0);
  M.onMovementDetected(t0 + 30000, 5);
  assert.equal(M.getDebugState(true).lastMovementAt, t0 + 30000);
  assert.equal(M.shouldAutoEnd(t0 + 50000), false);
});

run('inactivity reaches threshold and triggers auto-end', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '60000');
  const M = loadTripAutoEnd(ls);
  let ended = null;
  const t0 = 1_700_000_000_000;
  M.onTripStarted('shift_1', t0);
  assert.equal(M.checkInactivity(t0 + 61001, (r) => { ended = r; }), true);
  assert.equal(ended, 'auto');
});

run('auto-end performs callback exactly once', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '5000');
  const M = loadTripAutoEnd(ls);
  let count = 0;
  const t0 = 1_700_000_000_000;
  M.onTripStarted('s', t0);
  M.checkInactivity(t0 + 5001, () => { count++; });
  M.checkInactivity(t0 + 10000, () => { count++; });
  assert.equal(count, 1);
});

run('GPS drift below speed threshold does not reset timer', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '60000');
  const M = loadTripAutoEnd(ls);
  const t0 = 1_700_000_000_000;
  M.onTripStarted('shift_1', t0);
  M.onMovementDetected(t0 + 5000, 0.2);
  assert.equal(M.getDebugState(true).lastMovementAt, t0);
});

run('onGpsTick triggers auto-end when idle threshold reached', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '60000');
  const M = loadTripAutoEnd(ls);
  let ended = false;
  M.setTickCallback(() => { ended = true; });
  const t0 = 1_700_000_000_000;
  M.onTripStarted('shift_1', t0);
  M.onGpsTick(t0 + 61000);
  assert.equal(ended, true);
});

run('90 minute default threshold', () => {
  const ls = createMockLocalStorage();
  const M = loadTripAutoEnd(ls);
  assert.equal(M.getInactivityMs(), 90 * 60 * 1000);
});

run('trip end clears auto-end state', () => {
  const ls = createMockLocalStorage();
  const M = loadTripAutoEnd(ls);
  M.onTripStarted('s', 1);
  M.onTripEnded('manual');
  assert.equal(M.getDebugState(false).shiftId, null);
});

console.log(`\nTrip auto-end: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
