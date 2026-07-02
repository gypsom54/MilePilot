/**
 * Subscription module — 7-day trial and paywall gates
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

function loadSubscription(ls) {
  const src = fs.readFileSync(path.join(root, 'frontend/js/subscription.js'), 'utf8');
  const sandbox = {
    localStorage: ls,
    window: { localStorage: ls },
    globalThis: { localStorage: ls },
  };
  sandbox.globalThis.window = sandbox.window;
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPSubscription;
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

run('new user trial is active for 7 days', () => {
  const ls = createMockLocalStorage();
  const S = loadSubscription(ls);
  S.startTrialIfNeeded();
  assert.equal(S.isTrialActive(), true);
  assert.equal(S.hasFullAccess(), true);
  assert.equal(S.canTrack(), true);
  assert.equal(S.getTrialDaysRemaining(), 7);
});

run('expired trial blocks active features until subscribed', () => {
  const ls = createMockLocalStorage();
  const S = loadSubscription(ls);
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  ls.setItem(S.STORAGE.TRIAL_STARTED, eightDaysAgo);
  assert.equal(S.isTrialActive(), false);
  assert.equal(S.hasFullAccess(), false);
  assert.equal(S.canTrack(), false);
  S.activateSubscription();
  assert.equal(S.hasFullAccess(), true);
});

run('history remains available without subscription', () => {
  const ls = createMockLocalStorage();
  const S = loadSubscription(ls);
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  ls.setItem(S.STORAGE.TRIAL_STARTED, eightDaysAgo);
  assert.equal(S.canViewHistory(), true);
});

run('value proposition copy avoids unlimited free trips language', () => {
  const ls = createMockLocalStorage();
  const S = loadSubscription(ls);
  const copy = S.VALUE_PROP.toLowerCase();
  assert.ok(copy.includes('7 days'));
  assert.ok(copy.includes('£4.99/month'));
  assert.ok(!copy.includes('unlimited'));
});

console.log(`\nSubscription: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
