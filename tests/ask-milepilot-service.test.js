/**
 * MP-S5-002 — Ask MilePilot service regression (MPTaxEngine integration)
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadEngine(sandbox) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/mp-tax-engine.js'), 'utf8'), sandbox);
  sandbox.MPTaxEngine = sandbox.window.MPTaxEngine;
}

function loadAskService(sandbox) {
  loadEngine(sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/ask-milepilot-service.js'), 'utf8'), sandbox);
  return sandbox.window.MPAskMilePilotService;
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

run('claim this month uses MPTaxEngine not flat rate', () => {
  const sandbox = { window: {}, globalThis: {}, console, Date, localStorage: { getItem: () => null } };
  sandbox.window = sandbox.globalThis;
  const S = loadAskService(sandbox);
  const now = new Date('2026-07-15T12:00:00.000Z');
  S.init({
    getNow: () => now,
    getVehicle: () => 'car',
    getTrips: () => [
      {
        id: 't1',
        status: 'business',
        miles: 100,
        startISO: '2026-07-01T08:00:00.000Z',
        endISO: '2026-07-01T09:00:00.000Z',
        vehicle: 'car',
      },
    ],
    getShifts: () => [],
    claimFn: () => {
      throw new Error('claimFn must not be used for period totals');
    },
  });
  const result = S.MileageQueryService.claimThisMonth();
  assert.ok(result.hmrc > 0, 'expected engine-derived hmrc');
  assert.equal(result.hmrc, 55, '100 miles at 55p first tier in 2026-27');
});

run('handleQuestion routes claim intent', async () => {
  const sandbox = { window: {}, globalThis: {}, console, Date, localStorage: { getItem: () => null } };
  sandbox.window = sandbox.globalThis;
  const S = loadAskService(sandbox);
  S.init({
    getVehicle: () => 'car',
    getTrips: () => [],
    getShifts: () => [],
  });
  const response = await S.handleQuestion('How much can I claim this month?');
  assert.ok(response, 'expected formatted response');
  assert.ok(response.message || response.view, 'response has content');
});

console.log(`\nAsk MilePilot service: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
