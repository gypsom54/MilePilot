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
  assert.equal(dbg.watchdogActive, true);
});

run('movement resets deadline', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '60000');
  const M = loadTripAutoEnd(ls);
  const t0 = 1_700_000_000_000;
  M.onTripStarted('shift_1', t0);
  M.onMovementDetected(t0 + 30000);
  assert.equal(M.getDebugState(true).lastMovementAt, t0 + 30000);
  assert.equal(M.shouldAutoEnd(t0 + 50000), false);
});

run('inactivity reaches threshold and triggers auto-end', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '60000');
  const M = loadTripAutoEnd(ls);
  let ended = null;
  M.setTickCallback((r) => { ended = r; });
  const t0 = 1_700_000_000_000;
  M.onTripStarted('shift_1', t0);
  assert.equal(M.checkInactivity(t0 + 61001), true);
  assert.equal(ended, 'auto');
});

run('auto-end performs callback exactly once', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_debug_auto_end_ms', '5000');
  const M = loadTripAutoEnd(ls);
  let count = 0;
  M.setTickCallback(() => { count++; });
  const t0 = 1_700_000_000_000;
  M.onTripStarted('s', t0);
  M.checkInactivity(t0 + 5001);
  M.checkInactivity(t0 + 10000);
  assert.equal(count, 1);
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
  assert.equal(M.getDebugState(false).watchdogActive, false);
});

console.log(`\nTrip auto-end: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
