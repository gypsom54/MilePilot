/**
 * MilePilot Intelligence Engine (MIE) — habit model, confidence, auto-sort
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

function loadMIE(ls) {
  const mieSrc = fs.readFileSync(path.join(root, 'frontend/js/mie-intelligence-engine.js'), 'utf8');
  const aliasSrc = fs.readFileSync(path.join(root, 'frontend/js/ai-mileage-review.js'), 'utf8');
  const sandbox = {
    localStorage: ls,
    window: { localStorage: ls },
    globalThis: { localStorage: ls },
    console,
    Date,
  };
  vm.runInNewContext(mieSrc, sandbox);
  vm.runInNewContext(aliasSrc, sandbox);
  return sandbox.window.MPMIE;
}

function sampleTrip(id, startISO, miles, lat, lon) {
  return {
    id,
    status: 'pending',
    miles,
    seconds: 600,
    startISO,
    endISO: startISO,
    startLat: lat,
    startLon: lon,
    endLat: lat + 0.01,
    endLon: lon + 0.01,
    route: [
      { lat, lon },
      { lat: lat + 0.01, lon: lon + 0.01 },
    ],
  };
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

run('new route suggests review with low confidence', () => {
  const MIE = loadMIE(createMockLocalStorage());
  const trip = sampleTrip('t1', '2026-06-29T08:15:00.000Z', 3.2, 51.5, -0.12);
  const s = MIE.analyseTrip(trip);
  assert.equal(s.needsReview, true);
  assert.equal(s.likelyLabel, 'Needs Review');
  assert.ok(s.confidence < MIE.BUSINESS_AUTO_THRESHOLD);
  assert.ok(s.reason.toLowerCase().includes('new route'));
  assert.ok(s.explanation.reason === s.reason);
});

run('learned route auto-sorts with high confidence', () => {
  const ls = createMockLocalStorage();
  const MIE = loadMIE(ls);
  const trip = sampleTrip('t2', '2026-06-29T10:40:00.000Z', 5.1, 51.51, -0.11);

  for (let i = 0; i < 10; i++) {
    MIE.learnFromClassification(trip, 'business', { status: 'business', confidence: 0.9 }, 'accepted');
  }

  const s = MIE.analyseTrip(trip);
  assert.equal(s.status, 'business');
  assert.equal(s.autoSort, true);
  assert.equal(s.likelyLabel, 'Likely Business');
  assert.ok(s.confidence >= MIE.BUSINESS_AUTO_THRESHOLD);
});

run('prepareDailyReview auto-classifies confident trips only', () => {
  const ls = createMockLocalStorage();
  const MIE = loadMIE(ls);
  const trips = [
    sampleTrip('a', '2026-06-29T08:00:00.000Z', 2, 51.5, -0.12),
    sampleTrip('b', '2026-06-29T09:00:00.000Z', 3, 51.52, -0.08),
  ];

  for (let i = 0; i < 10; i++) {
    MIE.learnFromClassification(trips[0], 'business', null, 'accepted');
  }

  const statuses = {};
  const review = MIE.prepareDailyReview(trips, new Date('2026-06-29T12:00:00.000Z'), function (id, status) {
    statuses[id] = status;
    const t = trips.find((x) => x.id === id);
    if (t) t.status = status;
  });

  assert.equal(statuses.a, 'business');
  assert.ok(!statuses.b);
  assert.equal(review.needsReview, 1);
  assert.ok(review.headline.includes('found 2'));
  assert.ok(review.subheadline.includes('Only 1 need your review'));
});

run('user correction is recorded in MIE event history', () => {
  const ls = createMockLocalStorage();
  const MIE = loadMIE(ls);
  const trip = sampleTrip('c', '2026-06-29T16:00:00.000Z', 4, 51.49, -0.15);
  MIE.onUserClassification(trip, 'personal', { status: 'business', confidence: 0.7 });
  const model = MIE.loadModel();
  assert.ok(model.events.length >= 1);
  const last = model.events[model.events.length - 1];
  assert.equal(last.corrected, true);
  assert.equal(last.final, 'personal');
});

run('never auto-claims business without high confidence', () => {
  const MIE = loadMIE(createMockLocalStorage());
  const trip = sampleTrip('d', '2026-06-29T14:00:00.000Z', 2.5, 51.48, -0.14);
  const s = MIE.analyseTrip(trip);
  assert.equal(s.autoSortBusiness, false);
  assert.equal(s.needsReview, true);
});

console.log(`\nMIE intelligence engine: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
