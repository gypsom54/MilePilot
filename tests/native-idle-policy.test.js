/**
 * MP-047 Phase 0 — native idle policy unit tests
 */
import assert from 'node:assert/strict';
import { IDLE, shouldResetIdleTimer } from '../src/nativeIdlePolicy.js';

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

run('walking speed does not reset idle', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 80, speedMps: 1.2, accuracyM: 20 }),
    false
  );
});

run('soft creep at walking pace does not reset idle', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 30, speedMps: 1.4, accuracyM: 18 }),
    false
  );
});

run('slow driving at threshold resets idle', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 45, speedMps: 1.8, accuracyM: 18 }),
    true
  );
});

run('real driving movement resets idle', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 55, speedMps: 8, accuracyM: 12 }),
    true
  );
});

run('GPS drift without speed does not reset idle', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 50, speedMps: null, accuracyM: 25 }),
    false
  );
});

run('poor accuracy blocks idle reset', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 55, speedMps: 8, accuracyM: 90 }),
    false
  );
});

run('automotive activity with distance resets idle', () => {
  assert.equal(
    shouldResetIdleTimer({ distanceM: 42, speedMps: null, accuracyM: 20, activityAutomotive: true }),
    true
  );
});

run('IDLE constants match Phase 0 spec', () => {
  assert.equal(IDLE.DRIVING_MIN_SPEED_MPS, 1.8);
  assert.equal(IDLE.DRIVING_MIN_MOVE_M, 40);
  assert.equal(IDLE.WALKING_MAX_SPEED_MPS, 1.5);
});

console.log(`\nNative idle policy: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
