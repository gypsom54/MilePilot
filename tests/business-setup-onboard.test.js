/**
 * Business setup onboarding — branching workspace builder
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

run('mileage goal + vehicle gets Core recommendation', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['track_mileage'],
    vehicleUse: 'daily',
    vatRegistered: 'no',
  });
  assert.equal(rec.setup, 'mileage');
  assert.equal(rec.plan, 'core');
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
  assert.equal(M.wantsBusinessHub({ goals: ['track_mileage', 'reduce_paperwork'] }), false);
});

run('VAT goals without vehicle gets Business recommendation', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['organise_receipts', 'help_vat'],
    vehicleUse: 'no',
    vatRegistered: 'yes',
  });
  assert.equal(rec.setup, 'business');
  assert.equal(rec.plan, 'business');
  assert.ok(rec.items.includes('Business Hub'));
  assert.ok(rec.items.includes('VAT summaries'));
});

run('mixed goals with vehicle gets Business mixed setup', () => {
  const M = loadModule(createMockLocalStorage());
  const rec = M.computeRecommendation({
    goals: ['track_mileage', 'organise_receipts', 'track_expenses', 'help_vat'],
    vehicleUse: 'daily',
    vatRegistered: 'yes',
  });
  assert.equal(rec.setup, 'mixed');
  assert.equal(rec.plan, 'business');
  assert.ok(rec.items.includes('Mileage tracking'));
  assert.ok(rec.items.includes('Business Hub'));
  assert.ok(rec.items.includes('VAT summaries'));
});

run('combined goal ack is a single message for mileage only', () => {
  const M = loadModule(createMockLocalStorage());
  const ack = M.getAckForGoals(['track_mileage']);
  assert.equal(ack.length, 1);
  assert.match(ack[0], /mileage tracking the centre/);
});

run('combined goal ack for mileage plus business goals', () => {
  const M = loadModule(createMockLocalStorage());
  const ack = M.getAckForGoals(['track_mileage', 'organise_receipts', 'help_vat']);
  assert.equal(ack.length, 1);
  assert.match(ack[0], /mileage, receipts and VAT/);
});

run('six goal options only', () => {
  const M = loadModule(createMockLocalStorage());
  assert.equal(M.GOALS.length, 6);
  assert.ok(!M.GOALS.some((g) => g.id === 'understand_business'));
});

run('no vehicle suppresses mileage workspace even with mileage goal', () => {
  const M = loadModule(createMockLocalStorage());
  assert.equal(M.wantsMileageWorkspace({ goals: ['track_mileage'], vehicleUse: 'no' }), false);
});

run('mileage flow includes vehicle and tracking steps only when relevant', () => {
  const M = loadModule(createMockLocalStorage());
  const mileageFlow = M.buildFlow({ goals: ['track_mileage'], vehicleUse: 'daily' });
  assert.ok(mileageFlow.includes('vehicleUse'));
  assert.ok(mileageFlow.includes('trackingPreference'));
  assert.ok(!mileageFlow.includes('vat'));

  const businessFlow = M.buildFlow({ goals: ['organise_receipts', 'help_vat', 'accountant'] });
  assert.ok(!businessFlow.includes('vehicleUse'));
  assert.ok(!businessFlow.includes('trackingPreference'));
  assert.ok(businessFlow.includes('vat'));
});

run('ready checklist only includes selected modules', () => {
  const ls = createMockLocalStorage();
  ls.setItem(
    'mp_business_setup',
    JSON.stringify({
      goals: ['track_mileage'],
      vehicleUse: 'daily',
      trackingPreference: 'autopilot',
    })
  );
  const M = loadModule(ls);
  const list = M.getReadyChecklist();
  assert.ok(list.includes('Mileage tracking ready'));
  assert.ok(list.includes('Reports ready'));
  assert.ok(!list.includes('Business Hub ready'));
});

console.log(`\nBusiness setup: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
