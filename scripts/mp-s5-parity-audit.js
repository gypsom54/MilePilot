#!/usr/bin/env node
/**
 * MP-S5-005 — HMRC parity audit across Ask and MPTaxEngine
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadContext() {
  const sandbox = { window: {}, globalThis: {}, console, Date, localStorage: { getItem: () => null } };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/mp-tax-engine.js'), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/ask-milepilot-service.js'), 'utf8'), sandbox);
  return sandbox;
}

function trip(id, miles, startISO, vehicle = 'car') {
  return { id, miles, startISO, endISO: startISO, status: 'business', vehicle, hmrc: 0 };
}

function row(label, ask, engine) {
  return {
    case: label,
    eligibleMiles: engine.eligibleMiles,
    firstTierMiles: engine.firstTierMiles,
    secondTierMiles: engine.secondTierMiles,
    claim: engine.totalClaim,
    taxYear: engine.taxYear,
    vehicle: engine.vehicleType,
    businessJourneys: engine.journeyCount,
    askClaim: ask.hmrc,
    askMiles: ask.miles,
    match: ask.hmrc === engine.totalClaim && ask.miles === engine.eligibleMiles,
  };
}

const ctx = loadContext();
const E = ctx.MPTaxEngine;
const S = ctx.MPAskMilePilotService;
const asOf = new Date('2026-07-15T12:00:00.000Z');

const cases = [
  { label: 'A under 10k car', vehicle: 'car', trips: [trip('a', 5000, '2026-07-01T08:00:00.000Z')] },
  { label: 'B exactly 10k car', vehicle: 'car', trips: [trip('b', 10000, '2026-07-01T08:00:00.000Z')] },
  { label: 'C above 10k car', vehicle: 'car', trips: [trip('c', 12000, '2026-07-01T08:00:00.000Z')] },
  {
    label: 'D threshold crossing',
    vehicle: 'car',
    trips: [trip('d1', 9950, '2026-07-01T08:00:00.000Z'), trip('d2', 100, '2026-07-02T08:00:00.000Z')],
  },
  { label: 'E motorcycle', vehicle: 'motorcycle', trips: [trip('e', 200, '2026-07-01T08:00:00.000Z', 'motorcycle')] },
  { label: 'F bicycle', vehicle: 'bicycle', trips: [trip('f', 100, '2026-07-01T08:00:00.000Z', 'bicycle')] },
  {
    label: 'G tax year boundary',
    vehicle: 'car',
    trips: [trip('g', 100, '2026-04-06T08:00:00.000Z')],
    asOf: new Date('2026-04-06T12:00:00.000Z'),
  },
  { label: 'H unknown vehicle', vehicle: 'spaceship', trips: [trip('h', 50, '2026-07-01T08:00:00.000Z', 'spaceship')], expectInvalid: true },
];

const results = [];
let failed = 0;

for (const c of cases) {
  const ref = c.asOf || asOf;
  S.init({
    getNow: () => ref,
    getVehicle: () => c.vehicle,
    getTrips: () => c.trips,
    getShifts: () => [],
  });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(c.trips, [], c.vehicle);
  const engine = E.calculateTaxYearClaims({ journeys: all, vehicleType: c.vehicle, asOfDate: ref });
  if (c.expectInvalid) {
    const ok = engine.valid === false && ask.hmrc === 0;
    results.push({ case: c.label, match: ok, note: 'invalid vehicle — zero claim' });
    if (!ok) {
      failed++;
      console.error('✗', c.label, 'expected invalid vehicle zero claim');
    } else {
      console.log('✓', c.label, 'invalid vehicle safely returns zero');
    }
    continue;
  }
  const r = row(c.label, ask, engine);
  results.push(r);
  if (!r.match) {
    failed++;
    console.error('✗', c.label, 'mismatch ask', ask.hmrc, 'vs engine', engine.totalClaim);
  } else {
    console.log('✓', c.label, 'claim', engine.totalClaim, 'miles', engine.eligibleMiles, 'taxYear', engine.taxYear);
  }
}

console.log('\n--- HMRC Parity Matrix ---');
console.table(results);

if (failed) {
  console.error(`\nParity audit FAILED: ${failed} case(s)\n`);
  process.exit(1);
}
console.log(`\nParity audit PASSED: ${results.length}/${results.length} cases\n`);
