/**
 * Journey review — classification helpers and business totals
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

function loadModules(ls) {
  const taxSrc = fs.readFileSync(path.join(root, 'frontend/js/mp-tax-engine.js'), 'utf8');
  const tripSrc = fs.readFileSync(path.join(root, 'frontend/js/trip-store.js'), 'utf8');
  const reviewSrc = fs.readFileSync(path.join(root, 'frontend/js/journey-review.js'), 'utf8');
  const sandbox = {
    localStorage: ls,
    window: {},
    globalThis: {},
    console,
    Date,
  };
  sandbox.window = sandbox.globalThis;
  vm.runInNewContext(taxSrc, sandbox);
  sandbox.MPTaxEngine = sandbox.window.MPTaxEngine;
  vm.runInNewContext(tripSrc, sandbox);
  vm.runInNewContext(reviewSrc, sandbox);
  return { MPTrips: sandbox.window.MPTrips, MPJourneyReview: sandbox.window.MPJourneyReview };
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

run('migrated shifts start as pending for review', () => {
  const { MPTrips } = loadModules(createMockLocalStorage());
  const trips = MPTrips.migrateShiftToTrips(
    {
      id: 'shift_1',
      miles: 3.2,
      seconds: 600,
      startISO: '2026-06-29T08:15:00.000Z',
      endISO: '2026-06-29T08:30:00.000Z',
      vehicle: 'car',
    },
    () => 0.55
  );
  assert.equal(trips.length, 1);
  assert.equal(trips[0].status, 'pending');
});

run('only business trips count toward daily totals', () => {
  const { MPTrips, MPJourneyReview } = loadModules(createMockLocalStorage());
  const date = new Date('2026-06-29T12:00:00.000Z');
  const trips = [
    MPTrips.normaliseTrip({ id: 'a', status: 'business', miles: 3.2, seconds: 100, startISO: '2026-06-29T08:15:00.000Z', endISO: '2026-06-29T08:30:00.000Z' }, 'car', () => 0.55),
    MPTrips.normaliseTrip({ id: 'b', status: 'personal', miles: 1.1, seconds: 80, startISO: '2026-06-29T10:40:00.000Z', endISO: '2026-06-29T10:50:00.000Z' }, 'car', () => 0.55),
    MPTrips.normaliseTrip({ id: 'c', status: 'pending', miles: 6.8, seconds: 200, startISO: '2026-06-29T16:05:00.000Z', endISO: '2026-06-29T16:40:00.000Z' }, 'car', () => 0.55),
  ];
  const totals = MPJourneyReview.businessTotalsForDate(trips, [], date);
  assert.equal(totals.mi, 3.2);
  assert.equal(totals.journeys, 1);
  assert.equal(MPJourneyReview.tripsNeedingReview(trips, date).length, 1);
});

run('classify all pending marks every journey for the day', () => {
  const ls = createMockLocalStorage();
  const { MPTrips, MPJourneyReview } = loadModules(ls);
  const trips = MPTrips.loadTrips('car', () => 0.55);
  trips.push(
    MPTrips.normaliseTrip({ id: 'p1', status: 'pending', miles: 2, startISO: '2026-06-29T09:00:00.000Z', endISO: '2026-06-29T09:20:00.000Z' }, 'car', () => 0.55),
    MPTrips.normaliseTrip({ id: 'p2', status: 'pending', miles: 4, startISO: '2026-06-29T14:00:00.000Z', endISO: '2026-06-29T14:30:00.000Z' }, 'car', () => 0.55)
  );
  MPJourneyReview.classifyAllForDate(trips, new Date('2026-06-29T12:00:00.000Z'), 'business', () => 0.55, 'car');
  assert.equal(trips.filter((t) => t.status === 'business').length, 2);
});

console.log(`\nJourney review: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
