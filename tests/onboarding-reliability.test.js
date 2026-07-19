/**
 * Emergency reliability contract checks for onboarding activation and frequency authority.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');

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

function mustMatch(pattern, text, message) {
  assert.ok(pattern.test(text), message);
}

run('defines authoritative activation function', () => {
  mustMatch(/async function activateAutopilotReliably\(opts\)\{/, indexHtml, 'activateAutopilotReliably missing');
  mustMatch(/bridgeRequestTimeout\('expo:autopilot:arm',\{background:true\},10000\)/, indexHtml, 'native arm call missing');
  mustMatch(/bridgeRequestTimeout\('expo:autopilot:verify-persisted',\{\},8000\)/, indexHtml, 'persisted verify call missing');
});

run('onboarding completion runs critical activation before exit', () => {
  mustMatch(/const setup=await completeCriticalAutopilotSetup\(\);/, indexHtml, 'critical setup call missing');
  mustMatch(/localStorage\.setItem\('mp_onboard_complete','true'\)/, indexHtml, 'onboarding complete write missing');
  mustMatch(/if\(isAutoPilotTracking\(\)&&shouldInitTrackingStartup\(\)\)await activateAutopilotReliably\(\{requestPermission:false,requireBackground:false\}\);/, indexHtml, 'post-complete activation reconciliation missing');
});

run('startup reconciliation invokes authoritative activation', () => {
  mustMatch(/if\(shouldInitTracking\)\{activateAutopilotReliably\(\{requestPermission:false,requireBackground:false\}\)\.catch\(function\(\)\{\}\)\}/, indexHtml, 'startup activation reconciliation missing');
});

run('repeated arming is idempotent in ensureAutopilotArmed', () => {
  mustMatch(/if\(window\.__autopilotArmInFlight\)return window\.__autopilotArmInFlight;/, indexHtml, 'in-flight guard missing');
  mustMatch(/if\(recentlyArmed&&healthyArmed\)\{/, indexHtml, 'recently armed fast-path missing');
});

run('daily weekly manual are the only onboarding frequencies', () => {
  mustMatch(/function isValidOnboardFrequency\(freq\)\{return freq==='daily'\|\|freq==='weekly'\|\|freq==='off'\}/, indexHtml, 'onboarding frequencies not constrained');
  mustMatch(/id="onboardFreqManual" data-freq="off"/, indexHtml, 'manual onboarding option missing');
});

run('subscription sync allows only daily and weekly', () => {
  mustMatch(/if\(!\['daily','weekly'\]\.includes\(frequency\)\)return;/, indexHtml, 'subscription frequency gate incorrect');
});

run('report frequency source normalizes to daily weekly manual', () => {
  mustMatch(/function normalizeReportFrequency\(freq\)\{/, indexHtml, 'normalizeReportFrequency missing');
  mustMatch(/function getReportFrequency\(\)\{return normalizeReportFrequency\(localStorage\.getItem\('mp_report_frequency'\)\|\|'off'\)\}/, indexHtml, 'normalized getReportFrequency missing');
});

console.log(`\nOnboarding reliability contract: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
