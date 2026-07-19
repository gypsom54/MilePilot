/**
 * MP-046 — Tracking mode unit tests
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
  const sandbox = {
    console,
    Date,
    localStorage: ls,
    window: {},
    globalThis: {},
  };
  sandbox.window = sandbox.globalThis;
  const modeSrc = fs.readFileSync(path.join(root, 'frontend/js/tracking-mode.js'), 'utf8');
  const intelSrc = fs.readFileSync(path.join(root, 'frontend/js/intelligence-recommendations.js'), 'utf8');
  vm.runInNewContext(intelSrc, sandbox);
  vm.runInNewContext(modeSrc, sandbox);
  return { MPTrackingMode: sandbox.window.MPTrackingMode, MPIntelligence: sandbox.window.MPIntelligence };
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

run('recommends AutoPilot for daily drivers', () => {
  const { MPTrackingMode } = loadModules(createMockLocalStorage());
  assert.equal(MPTrackingMode.recommendMode('daily'), 'autopilot');
  assert.equal(MPTrackingMode.recommendMode('weekly'), 'autopilot');
});

run('recommends Manual for occasional drivers', () => {
  const { MPTrackingMode } = loadModules(createMockLocalStorage());
  assert.equal(MPTrackingMode.recommendMode('occasionally'), 'manual');
});

run('manual mode disables background tracking', () => {
  const ls = createMockLocalStorage();
  const { MPTrackingMode } = loadModules(ls);
  MPTrackingMode.setMode('manual');
  assert.equal(MPTrackingMode.isManual(), true);
  assert.equal(MPTrackingMode.usesBackgroundTracking(), false);
  assert.equal(MPTrackingMode.usesAutoEnd(), false);
});

run('autopilot mode enables background features', () => {
  const ls = createMockLocalStorage();
  const { MPTrackingMode } = loadModules(ls);
  MPTrackingMode.setMode('autopilot', { frequency: 'daily' });
  assert.equal(MPTrackingMode.isAutoPilot(), true);
  assert.equal(MPTrackingMode.usesBackgroundTracking(), true);
  assert.equal(MPTrackingMode.getStartButtonLabel(), 'Start Shift');
});

run('manual mode uses journey labels', () => {
  const ls = createMockLocalStorage();
  const { MPTrackingMode } = loadModules(ls);
  MPTrackingMode.setMode('manual');
  assert.equal(MPTrackingMode.getStartButtonLabel(), 'Start Journey');
  assert.equal(MPTrackingMode.getEndButtonLabel(), 'End Journey');
});

run('falls back to AutoPilot labels when no mode selected', () => {
  const ls = createMockLocalStorage();
  const { MPTrackingMode } = loadModules(ls);
  assert.equal(MPTrackingMode.getMode(), null);
  assert.equal(MPTrackingMode.getStartButtonLabel(), 'Start Shift');
  assert.equal(MPTrackingMode.getEndButtonLabel(), 'End Shift');
  assert.equal(MPTrackingMode.isAutoPilot(), true);
});

run('legacy migrate defaults returning users to AutoPilot', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_onboard_complete', 'true');
  const { MPTrackingMode } = loadModules(ls);
  assert.equal(MPTrackingMode.getMode(), null);
  assert.equal(MPTrackingMode.migrateLegacyDefault(), true);
  assert.equal(MPTrackingMode.getMode(), 'autopilot');
  assert.equal(MPTrackingMode.migrateLegacyDefault(), false);
});

run('intelligence stubs return empty recommendations', () => {
  const { MPIntelligence } = loadModules(createMockLocalStorage());
  assert.equal(JSON.stringify(MPIntelligence.getPendingRecommendations()), '[]');
  assert.equal(MPIntelligence.evaluateModeRecommendation(), null);
});

run('intelligence records signals', () => {
  const ls = createMockLocalStorage();
  const { MPIntelligence } = loadModules(ls);
  MPIntelligence.recordSignal('test', { foo: 1 });
  assert.equal(MPIntelligence.loadSignals().length, 1);
});

console.log(`\nTracking mode: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
