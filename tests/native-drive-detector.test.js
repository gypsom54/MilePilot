/**
 * MP-048 — Native drive detector unit tests
 */
import assert from 'node:assert/strict';
import {
  DETECTOR,
  createDriveDetectorState,
  ingestDriveSample,
  isDrivingSpeed,
  calcSpeedMps,
} from '../src/nativeDriveDetector.js';

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

function drivingSample(t, speedMps, latOffset = 0) {
  return { lat: 51.5 + latOffset, lon: -0.1, acc: 25, t, speedMps };
}

run('walking speed does not confirm driving', () => {
  let state = createDriveDetectorState();
  const base = Date.now();
  const r1 = ingestDriveSample(state, drivingSample(base, 1.5, 0.0001));
  state = r1.state;
  const r2 = ingestDriveSample(state, drivingSample(base + 15000, 1.8, 0.0002));
  assert.equal(r2.confirmed, false);
});

run('sustained driving confirms auto-start', () => {
  let state = createDriveDetectorState();
  const base = Date.now() - 30000;
  let confirmed = false;
  for (let i = 0; i < 6; i++) {
    const result = ingestDriveSample(state, drivingSample(base + i * 5000, 6, i * 0.0003));
    state = result.state;
    if (result.confirmed) confirmed = true;
  }
  assert.equal(confirmed, true);
});

run('short burst does not confirm driving', () => {
  let state = createDriveDetectorState();
  const base = Date.now();
  const r1 = ingestDriveSample(state, drivingSample(base, 8, 0.0001));
  state = r1.state;
  const r2 = ingestDriveSample(state, drivingSample(base + 20000, 7, 0.0002));
  assert.equal(r2.confirmed, false);
});

run('poor GPS blocks candidate', () => {
  let state = createDriveDetectorState();
  const result = ingestDriveSample(state, {
    lat: 51.5,
    lon: -0.1,
    acc: 200,
    t: Date.now(),
    speedMps: 10,
  });
  assert.equal(result.confirmed, false);
  assert.equal(result.reason, 'poor_gps');
});

run('driving speed threshold is ~9 mph', () => {
  assert.equal(isDrivingSpeed(4.0), true);
  assert.equal(isDrivingSpeed(2.5), false);
});

run('calcSpeedMps prefers device speed', () => {
  const speed = calcSpeedMps({ lat: 51.5, lon: -0.1, t: 2000, speedMps: 6 }, { lat: 51.5, lon: -0.1, t: 1000 });
  assert.equal(speed, 6);
});

run('DETECTOR sustained window is 25 seconds', () => {
  assert.equal(DETECTOR.SUSTAINED_MS, 25000);
});

console.log(`\nNative drive detector: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
