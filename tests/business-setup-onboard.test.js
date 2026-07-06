/**
 * Onboarding flow repair — workspace branching
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

run('name requires at least 2 characters', () => {
  const M = loadModule(createMockLocalStorage());
  assert.equal(M.isValidName('J'), false);
  assert.equal(M.isValidName('Jo'), true);
  assert.equal(M.isValidName('  Sam  '), true);
});

// TEST 1 — Business only user
run('TEST 1: business-only path skips all mileage steps', () => {
  const M = loadModule(createMockLocalStorage());
  const goals = ['organise_receipts', 'help_vat', 'accountant'];
  assert.equal(M.getOnboardPath({ goals }), 'business');
  const flow = M.buildFlow({ goals, vehicleUse: 'no' });
  assert.ok(!flow.includes('vehicleUse'));
  assert.ok(!flow.includes('vehicleType'));
  assert.ok(!flow.includes('trackingPreference'));
  assert.ok(!flow.includes('ack'));
  assert.ok(!flow.includes('nameAck'));
  assert.ok(!flow.includes('businessBridge'));
  assert.ok(flow.includes('vat'));
  assert.ok(flow.includes('accountant'));
  assert.ok(flow.includes('reportEmail'));
  const copy = M.getReportEmailCopy({ goals });
  assert.match(copy.title, /business reports/i);
  assert.ok(!/mileage reports/i.test(copy.title));
  assert.match(copy.helper, /receipts, expenses, VAT summaries/);
  const rec = M.computeRecommendation({ goals, vatRegistered: 'yes' });
  assert.equal(rec.plan, 'business');
  assert.equal(rec.dashboardMode, 'business');
  assert.equal(rec.workspaceTitle, 'Business Hub');
});

// TEST 2 — Mileage only user
run('TEST 2: mileage-only path asks vehicle and tracking', () => {
  const M = loadModule(createMockLocalStorage());
  const goals = ['track_mileage'];
  assert.equal(M.getOnboardPath({ goals }), 'mileage');
  const flow = M.buildFlow({ goals, vehicleUse: 'daily', vehicleType: 'car', trackingPreference: 'autopilot' });
  assert.ok(flow.includes('vehicleUse'));
  assert.ok(flow.includes('vehicleType'));
  assert.ok(flow.includes('trackingPreference'));
  assert.ok(!flow.includes('vat'));
  assert.ok(!flow.includes('accountant'));
  assert.ok(flow.includes('reportEmail'));
  assert.ok(!flow.includes('scanReceipt'));
  const copy = M.getReportEmailCopy({ goals });
  assert.match(copy.title, /mileage reports/i);
  const rec = M.computeRecommendation({ goals, vehicleUse: 'daily', trackingPreference: 'autopilot' });
  assert.equal(rec.plan, 'core');
  assert.equal(rec.dashboardMode, 'mileage');
  assert.equal(rec.workspaceTitle, 'Mileage Workspace');
});

// TEST 3 — Combined user
run('TEST 3: combined path includes mileage and business setup', () => {
  const M = loadModule(createMockLocalStorage());
  const goals = ['track_mileage', 'organise_receipts', 'help_vat'];
  assert.equal(M.getOnboardPath({ goals }), 'combined');
  const flow = M.buildFlow({
    goals,
    vehicleUse: 'daily',
    vehicleType: 'car',
    trackingPreference: 'manual',
    vatRegistered: 'yes',
  });
  assert.ok(flow.includes('vehicleUse'));
  assert.ok(flow.includes('trackingPreference'));
  assert.ok(!flow.includes('businessBridge'));
  assert.ok(flow.includes('vat'));
  assert.ok(flow.includes('reportEmail'));
  const copy = M.getReportEmailCopy({ goals });
  assert.match(copy.title, /reports/i);
  assert.match(copy.helper, /mileage/i);
  const rec = M.computeRecommendation({ goals, vehicleUse: 'daily', vatRegistered: 'yes' });
  assert.equal(rec.plan, 'business');
  assert.equal(rec.dashboardMode, 'mixed');
  assert.equal(rec.workspaceTitle, 'MilePilot Business');
});

run('early flow is welcome → name → goals with no dead transitions', () => {
  const M = loadModule(createMockLocalStorage());
  const flow = M.buildFlow({ goals: ['track_mileage'] });
  assert.equal(flow.slice(0, 3).join(','), 'welcome,name,goals');
  assert.ok(!flow.includes('ack'));
  assert.ok(!flow.includes('nameAck'));
});

run('vehicle steps omitted when user does not use a vehicle', () => {
  const M = loadModule(createMockLocalStorage());
  const flow = M.buildFlow({ goals: ['track_mileage'], vehicleUse: 'no' });
  assert.ok(flow.includes('vehicleUse'));
  assert.ok(!flow.includes('vehicleType'));
  assert.ok(!flow.includes('trackingPreference'));
});

run('ready copy reflects workspace type', () => {
  const ls = createMockLocalStorage();
  ls.setItem(
    'mp_business_setup',
    JSON.stringify({ goals: ['organise_receipts'], onboardPath: 'business', dashboardMode: 'business' })
  );
  const M = loadModule(ls);
  const copy = M.getReadyCopy();
  assert.match(copy.lead, /Business Hub is ready/);
});

console.log(`\nBusiness setup flow repair: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
