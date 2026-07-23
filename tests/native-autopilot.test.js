/**
 * Native AutoPilot closed-app detection logic (mirrors src/nativeAutopilot.js)
 */
const THRESH = { DRIVING_SPEED_MPS: 4.47, SUSTAINED_MS: 10000, MIN_SAMPLES: 2, SPEED_GATE_DT: 2 };

function distanceMeters(a, b) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const la1 = a.lat * rad;
  const la2 = b.lat * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function effectiveSpeedMps(sample, prev) {
  if (sample.speedMps != null && sample.speedMps >= THRESH.DRIVING_SPEED_MPS) return sample.speedMps;
  if (!prev) return 0;
  const d = distanceMeters(prev, sample);
  const dt = Math.max(0.001, (sample.t - prev.t) / 1000);
  return d / Math.max(dt, THRESH.SPEED_GATE_DT);
}

function simulateAutopilotStart(samples) {
  let candidateStartedAt = 0;
  let candidateSamples = 0;
  let lastSample = null;

  for (const raw of samples) {
    const sample = { lat: raw.lat, lon: raw.lon, t: raw.t, speedMps: raw.speedMps ?? null, acc: raw.acc ?? 25 };
    if (sample.acc > 80) continue;
    const prev = lastSample;
    const speed = effectiveSpeedMps(sample, prev);
    lastSample = sample;
    if (!prev && sample.speedMps == null) continue;
    if (speed < THRESH.DRIVING_SPEED_MPS) {
      candidateStartedAt = 0;
      candidateSamples = 0;
      continue;
    }
    if (!candidateStartedAt) {
      candidateStartedAt = sample.t;
      candidateSamples = 1;
      continue;
    }
    candidateSamples += 1;
    const sustained = sample.t - candidateStartedAt;
    if (sustained >= THRESH.SUSTAINED_MS && candidateSamples >= THRESH.MIN_SAMPLES) {
      return { started: true, startedAt: candidateStartedAt };
    }
  }
  return { started: false };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let failed = 0;

function run(name, fn) {
  try {
    fn();
    console.log('✓ ' + name);
  } catch (e) {
    failed++;
    console.error('✗ ' + name);
    console.error('  ' + e.message);
  }
}

run('device speed triggers candidate', () => {
  const t0 = Date.now();
  const r = simulateAutopilotStart([
    { lat: 51.5, lon: -0.1, t: t0, speedMps: 15 },
    { lat: 51.501, lon: -0.1, t: t0 + 5000, speedMps: 15 },
    { lat: 51.502, lon: -0.1, t: t0 + 12000, speedMps: 15 },
  ]);
  assert(r.started, 'expected auto-start with device speed');
});

run('null device speed uses GPS delta (iOS background)', () => {
  const t0 = Date.now();
  const r = simulateAutopilotStart([
    { lat: 51.5, lon: -0.1, t: t0, speedMps: null },
    { lat: 51.5012, lon: -0.1, t: t0 + 5000, speedMps: null },
    { lat: 51.5024, lon: -0.1, t: t0 + 12000, speedMps: null },
    { lat: 51.5036, lon: -0.1, t: t0 + 16000, speedMps: null },
  ]);
  assert(r.started, 'expected auto-start from position delta when speed is null');
});

run('walking speed does not start', () => {
  const t0 = Date.now();
  const r = simulateAutopilotStart([
    { lat: 51.5, lon: -0.1, t: t0, speedMps: 1 },
    { lat: 51.50001, lon: -0.1, t: t0 + 5000, speedMps: 1 },
    { lat: 51.50002, lon: -0.1, t: t0 + 12000, speedMps: 1 },
  ]);
  assert(!r.started, 'walking should not auto-start');
});

if (failed) {
  console.error(`\nNative AutoPilot: ${failed} failed`);
  process.exit(1);
}
console.log('\nNative AutoPilot: all tests passed');
