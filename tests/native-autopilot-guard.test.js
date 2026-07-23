/**
 * MP-HF-008 — Static guard: native AutoPilot module must exist and be wired.
 * Does not prove field behaviour; fails CI if the recovered chain is removed.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    failed++;
    console.error('✗ ' + msg);
    return;
  }
  console.log('✓ ' + msg);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    assert(false, 'missing file: ' + rel);
    return '';
  }
  assert(true, 'file present: ' + rel);
  return fs.readFileSync(p, 'utf8');
}

const nativeAutopilot = read('src/nativeAutopilot.js');
const locationTask = read('src/locationTask.js');
const bridge = read('src/expoLocationBridge.js');
const webView = read('src/MilePilotWebView.js');
const indexJs = read('index.js');
const indexHtml = read('frontend/index.html');
const contract = read('scripts/tracking-contract.json');

const requiredExports = [
  'hydrateNativeAutopilot',
  'setNativeAutopilotArmed',
  'isNativeAutopilotArmed',
  'loadNativeAutopilotState',
  'onAutopilotBackgroundLocation',
  'ensureAutopilotBackgroundLocation',
];

for (const sym of requiredExports) {
  assert(
    new RegExp('export\\s+(async\\s+)?function\\s+' + sym).test(nativeAutopilot),
    'nativeAutopilot.js exports ' + sym
  );
}

assert(locationTask.includes("from './nativeAutopilot'"), 'locationTask imports nativeAutopilot');
assert(locationTask.includes('hydrateNativeAutopilot'), 'locationTask calls hydrateNativeAutopilot');
assert(locationTask.includes('onAutopilotBackgroundLocation'), 'locationTask calls onAutopilotBackgroundLocation');

assert(bridge.includes("from './nativeAutopilot'"), 'expoLocationBridge imports nativeAutopilot');
assert(bridge.includes('setNativeAutopilotArmed(true)'), 'expo:autopilot:arm sets native armed');
assert(bridge.includes('loadNativeAutopilotState'), 'initNativeTracking loads native autopilot state');
assert(bridge.includes('ensureAutopilotBackgroundLocation'), 'bridge ensures autopilot BG location');

assert(webView.includes("from './nativeAutopilot'"), 'MilePilotWebView imports nativeAutopilot');
assert(webView.includes('initNativeTracking'), 'MilePilotWebView calls initNativeTracking on mount');
assert(webView.includes('ensureAutopilotBackgroundLocation'), 'MilePilotWebView ensures autopilot BG on lock');

assert(indexJs.includes('./src/locationTask'), 'index.js registers location task before app mount');

assert(indexHtml.includes('ensureAutopilotArmed'), 'index.html has ensureAutopilotArmed');
assert(indexHtml.includes('finishOnboarding'), 'index.html has finishOnboarding');
assert(indexHtml.includes('initTrackingEngine();initAutoPilotMotion()'), 'boot order: tracking before motion');
assert(indexHtml.includes('restoreNativeTripIfNeeded'), 'index.html restores native trip on boot');
assert(indexHtml.includes('applyNativeTripSync'), 'index.html reconciles native trip sync');
assert(indexHtml.includes('expo:autopilot:arm'), 'index.html arms native via bridge');

assert(contract.includes('src/nativeAutopilot.js'), 'tracking-contract lists nativeAutopilot.js');
assert(contract.includes('hydrateNativeAutopilot'), 'tracking-contract requires hydrateNativeAutopilot symbol');

if (failed) {
  console.error('\nNative AutoPilot guard: ' + failed + ' failed');
  process.exit(1);
}
console.log('\nNative AutoPilot guard: all static checks passed');
