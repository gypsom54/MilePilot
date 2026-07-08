/**
 * MP-048 — Native auto-start prefs contract tests
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

function loadMotion(ls) {
  const sandbox = {
    console,
    Date,
    Math,
    localStorage: ls,
    window: {},
    globalThis: {},
    setInterval: () => 1,
    clearInterval: () => {},
    setTimeout: (fn) => {
      if (typeof fn === 'function') fn();
      return 1;
    },
  };
  sandbox.window = sandbox.globalThis;
  const src = fs.readFileSync(path.join(root, 'frontend/js/autopilot-motion.js'), 'utf8');
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPAutoPilotMotion;
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

run('auto business defaults to needs review (opt-in)', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  assert.equal(M.getTripStatusForSave(), 'pending');
});

run('auto business only when explicitly enabled', () => {
  const ls = createMockLocalStorage();
  const M = loadMotion(ls);
  M.setAutoBusiness(true);
  assert.equal(M.getTripStatusForSave(), 'business');
  M.setAutoBusiness(false);
  assert.equal(M.getTripStatusForSave(), 'pending');
});

run('native auto-start modules exist', () => {
  const files = [
    'src/nativeAutoStart.js',
    'src/nativeDriveDetector.js',
    'src/nativeAutopilotPrefs.js',
  ];
  files.forEach((f) => {
    assert.ok(fs.existsSync(path.join(root, f)), `${f} missing`);
  });
});

run('bridge handles native prefs sync message', () => {
  const bridge = fs.readFileSync(path.join(root, 'src/expoLocationBridge.js'), 'utf8');
  assert.ok(bridge.includes("case 'expo:autopilot:prefs:sync'"));
  assert.ok(bridge.includes('armNativeAutoStart'));
});

run('location task feeds idle auto-start path', () => {
  const task = fs.readFileSync(path.join(root, 'src/locationTask.js'), 'utf8');
  assert.ok(task.includes('onIdleLocationForAutoStart'));
});

console.log(`\nNative auto-start contract: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
