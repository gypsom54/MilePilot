/**
 * Workspace routing resolver tests
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadRouting() {
  const sandbox = {
    console,
    window: {},
    globalThis: {},
  };
  sandbox.window = sandbox.globalThis;
  const src = fs.readFileSync(path.join(root, 'frontend/js/workspace-routing.js'), 'utf8');
  vm.runInNewContext(src, sandbox);
  return sandbox.window.MPWorkspaceRouting;
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

function resolveFor(profile, trackingMode, commandMode) {
  const routing = loadRouting();
  return routing.resolve({
    profile,
    trackingMode,
    commandMode,
    isActive: false,
    featureRegistry: {
      intelligence_layer: { experience: 'business', built: true },
      tracking: { experience: 'tracker', built: true },
    },
  });
}

run('tracker + autopilot shows AutoPilot badge', () => {
  const state = resolveFor({ experience: 'tracker', profession: 'driver' }, 'autopilot', 'morning');
  assert.equal(state.experience, 'tracker');
  assert.equal(state.trackingMode, 'autopilot');
  assert.equal(state.startup.allowTrackingInitialization, true);
  assert.equal(state.visibility.showAutoPilotBadge, true);
  assert.equal(state.visibility.showAutoPilotControls, true);
  assert.equal(state.visibility.showManualControls, false);
  assert.equal(state.visibility.showManualBanner, false);
  assert.equal(state.visibility.showIntelligenceLayer, false);
});

run('tracker + manual hides AutoPilot UI', () => {
  const state = resolveFor({ experience: 'tracker', profession: 'driver' }, 'manual', 'afternoon');
  assert.equal(state.experience, 'tracker');
  assert.equal(state.trackingMode, 'manual');
  assert.equal(state.startup.allowTrackingInitialization, true);
  assert.equal(state.visibility.showAutoPilotBadge, false);
  assert.equal(state.visibility.showAutoPilotControls, false);
  assert.equal(state.visibility.showAutoPilotSettings, false);
  assert.equal(state.visibility.showManualControls, true);
  assert.equal(state.visibility.showManualBanner, false);
  assert.equal(state.visibility.showIntelligenceLayer, false);
});

run('business workspace keeps trackingMode null and disables tracking init', () => {
  const state = resolveFor({ experience: 'business', profession: 'tradesperson' }, 'autopilot', 'afternoon');
  assert.equal(state.experience, 'business');
  assert.equal(state.trackingMode, null);
  assert.equal(state.startup.allowTrackingInitialization, false);
  assert.equal(state.visibility.showAutoPilotControls, false);
  assert.equal(state.visibility.showAutoPilotSettings, false);
  assert.equal(state.visibility.showManualControls, false);
  assert.equal(state.visibility.showAutoPilotBadge, false);
  assert.equal(state.visibility.showManualBanner, false);
  assert.equal(state.visibility.showIntelligenceLayer, true);
});

run('business workspace ignores manual mode coercion', () => {
  const state = resolveFor({ experience: 'business', profession: 'tradesperson' }, 'manual', 'evening');
  assert.equal(state.experience, 'business');
  assert.equal(state.trackingMode, null);
  assert.equal(state.startup.allowTrackingInitialization, false);
  assert.equal(state.visibility.showAutoPilotBadge, false);
  assert.equal(state.visibility.showManualBanner, false);
  assert.equal(state.visibility.showAutoPilotControls, false);
  assert.equal(state.visibility.showManualControls, false);
  assert.equal(state.visibility.showIntelligenceLayer, true);
});

run('autopilot workspace hides manual controls', () => {
  const state = resolveFor({ experience: 'tracker', profession: 'driver' }, 'autopilot', 'evening');
  assert.equal(state.trackingMode, 'autopilot');
  assert.equal(state.visibility.showManualControls, false);
  assert.equal(state.visibility.showAutoPilotControls, true);
});

run('legacy fallback maps unknown experience and mode safely', () => {
  const state = resolveFor({ experience: 'legacy_value', profession: 'other' }, 'legacy_mode', 'morning');
  assert.equal(state.experience, 'tracker');
  assert.equal(state.trackingMode, 'autopilot');
  assert.equal(state.legacy.fallbackExperience, true);
  assert.equal(state.legacy.fallbackTrackingMode, true);
});

console.log(`\nWorkspace routing: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
