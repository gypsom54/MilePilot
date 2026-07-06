/**
 * Business setup onboarding — recommendation engine (conversational lockdown)
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
  const ls = createMockLocalStorage();
  const M = loadModule(ls);
  const rec = M.computeRecommendation({
    goals: ['tracking_mileage'],
    businessType: 'taxi',
    vehicleUse: 'daily',
    vatRegistered: 'no',
  });
  assert.equal(rec.setup, 'mileage');
  assert.equal(rec.plan, 'core');
});

run('VAT goals without vehicle gets Business recommendation', () => {
  const ls = createMockLocalStorage();
  const M = loadModule(ls);
  const rec = M.computeRecommendation({
    goals: ['saving_receipts', 'adding_vat'],
    businessType: 'freelancer',
    vehicleUse: 'no',
    vatRegistered: 'yes',
  });
  assert.equal(rec.setup, 'business');
  assert.equal(rec.plan, 'business');
});

run('mixed goals with vehicle gets Business mixed setup', () => {
  const ls = createMockLocalStorage();
  const M = loadModule(ls);
  const rec = M.computeRecommendation({
    goals: ['tracking_mileage', 'saving_receipts'],
    businessType: 'tradesperson',
    vehicleUse: 'daily',
    vatRegistered: 'yes',
  });
  assert.equal(rec.setup, 'mixed');
  assert.equal(rec.plan, 'business');
});

run('no vehicle suppresses mileage even with mileage goal', () => {
  const ls = createMockLocalStorage();
  const M = loadModule(ls);
  assert.equal(M.wantsMileage({ goals: ['tracking_mileage'], vehicleUse: 'no' }), false);
});

console.log(`\nBusiness setup: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
