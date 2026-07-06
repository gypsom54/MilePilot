/**
 * Business setup onboarding — two-workspace strategy
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

function loadModule(ls) {
  const src = fs.readFileSync(path.join(root, 'frontend/js/business-setup-onboard.js'), 'utf8');
  const sandbox = {
    localStorage: ls,
    window: { localStorage: ls },
    document: { getElementById: () => null, querySelectorAll: () => [] },
  };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPBusinessSetup;
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

run('mileage goal + vehicle gets Core Mileage Workspace', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['track_mileage'],
    vehicleUse: 'daily',
    vatRegistered: 'no',
  });
  assert.equal(rec.setup, 'mileage');
  assert.equal(rec.plan, 'core');
  assert.equal(rec.dashboardMode, 'mileage');
  assert.ok(rec.items.some((i) => i.includes('mileage tracking')));
});

run('mileage + reduce paperwork stays mileage-first Core', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['track_mileage', 'reduce_paperwork'],
    vehicleUse: 'daily',
  });
  assert.equal(rec.setup, 'mileage');
  assert.equal(rec.plan, 'core');
  assert.equal(M.wantsBusinessWorkspace({ goals: ['track_mileage', 'reduce_paperwork'] }), false);
});

run('business-only gets Business Workspace recommendation', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['organise_receipts', 'help_vat', 'accountant'],
    vehicleUse: 'no',
    vatRegistered: 'yes',
  });
  assert.equal(rec.setup, 'business');
  assert.equal(rec.plan, 'business');
  assert.equal(rec.dashboardMode, 'business');
  assert.ok(rec.items.includes('Business Workspace'));
  assert.ok(rec.items.includes('AI Receipt Scanner'));
  assert.ok(rec.items.includes('Business Inbox'));
  assert.ok(rec.items.includes('Business Health'));
});

run('mixed goals with vehicle gets combined workspace', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['track_mileage', 'organise_receipts', 'track_expenses', 'help_vat'],
    vehicleUse: 'daily',
    vatRegistered: 'yes',
  });
  assert.equal(rec.setup, 'mixed');
  assert.equal(rec.plan, 'business');
  assert.equal(rec.dashboardMode, 'mixed');
  assert.ok(rec.items.includes('Mileage tracking'));
  assert.ok(rec.items.includes('Business Workspace'));
});

run('business flow skips mileage questions', () => {
  const M = loadModule(createMockLocalStorage());
  const flow = M.buildFlow({ goals: ['organise_receipts', 'help_vat', 'accountant'] });
  assert.ok(!flow.includes('vehicleUse'));
  assert.ok(!flow.includes('trackingPreference'));
  assert.ok(flow.includes('vat'));
});

run('combined goal ack is a single message for mileage only', () => {
  const M = loadModule(createMockLocalStorage());
  const ack = M.getAckForGoals(['track_mileage']);
  assert.equal(ack.length, 1);
  assert.match(ack[0], /mileage tracking the centre/);
});

run('ready copy reflects workspace type', () => {
  const ls = createMockLocalStorage();
  ls.setItem(
    'mp_business_setup',
    JSON.stringify({ goals: ['organise_receipts'], dashboardMode: 'business', selectedPlan: 'business' })
  );
  const M = loadModule(ls);
  const copy = M.getReadyCopy();
  assert.match(copy.lead, /Business Workspace is ready/);
});

run('legacy goal ids migrate on load', () => {
  const ls = createMockLocalStorage();
  ls.setItem(
    'mp_business_setup',
    JSON.stringify({ goals: ['tracking_mileage', 'saving_receipts'], vehicleUse: 'daily' })
  );
  const M = loadModule(ls);
  const setup = M.loadSetup();
  assert.equal(setup.goals[0], 'track_mileage');
  assert.equal(setup.goals[1], 'organise_receipts');
});

console.log(`\nBusiness setup: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
