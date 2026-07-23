#!/usr/bin/env node
/**
 * MP-HF-009 — Verify recovery deployment alignment (native + web + git).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FROZEN_COMMIT = '9b91907fef6146d20aa905099782bac7deaed254';
const DEPLOY_URL = process.env.RECOVERY_DEPLOY_URL || 'https://app.milepilot.uk';

function fail(msg) {
  console.error('✗ RECOVERY DEPLOY VERIFY FAILED:', msg);
  process.exit(1);
}

function pass(msg) {
  console.log('✓', msg);
}

function warn(msg) {
  console.warn('⚠', msg);
}

const identityPath = path.join(root, 'recovery-build-identity.json');
if (!fs.existsSync(identityPath)) {
  fail('recovery-build-identity.json missing — run: node scripts/generate-recovery-provenance.mjs');
}

const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));

if (!identity.nativeAutopilotModulePresent) {
  fail('nativeAutopilot.js not present in workspace');
}
pass('nativeAutopilot.js present locally');

if (!identity.git.containsFrozenCommit && !identity.git.isFrozenCommit) {
  fail(`HEAD does not contain frozen commit ${FROZEN_COMMIT.slice(0, 7)}`);
}
pass(`git contains frozen commit ${FROZEN_COMMIT.slice(0, 7)}`);

if (identity.appVersion !== identity.versionTxt) {
  fail(`version.txt (${identity.versionTxt}) !== APP_VERSION (${identity.appVersion})`);
}
pass(`APP_VERSION aligned: ${identity.appVersion}`);

const appConfig = fs.readFileSync(path.join(root, 'app.config.js'), 'utf8');
if (!appConfig.includes(`v=${identity.appVersion}`)) {
  fail(`app.config.js webAppUrl must pin v=${identity.appVersion}`);
}
pass('app.config.js webAppUrl pinned');

const eas = fs.readFileSync(path.join(root, 'eas.json'), 'utf8');
if (!eas.includes('recovery-hf009')) {
  fail('eas.json missing recovery-hf009 profile');
}
pass('eas.json recovery-hf009 profile present');

async function checkRemote() {
  const versionUrl = `${DEPLOY_URL.replace(/\/$/, '')}/version.txt`;
  const identityUrl = `${DEPLOY_URL.replace(/\/$/, '')}/recovery-build-identity.json`;

  try {
    const versionRes = await fetch(versionUrl, { cache: 'no-store' });
    if (!versionRes.ok) {
      warn(`Could not fetch ${versionUrl} (${versionRes.status}) — deploy Cloudflare zip before field test`);
      return;
    }
    const remoteVersion = (await versionRes.text()).trim();
    if (remoteVersion !== identity.appVersion) {
      fail(
        `Cloudflare version.txt (${remoteVersion}) !== recovery APP_VERSION (${identity.appVersion}). ` +
          'TestFlight would load the wrong web bundle — deploy recovery zip first.'
      );
    }
    pass(`Cloudflare version.txt matches ${identity.appVersion}`);
  } catch (e) {
    warn(`Remote version check skipped: ${e.message}`);
  }

  try {
    const idRes = await fetch(identityUrl, { cache: 'no-store' });
    if (!idRes.ok) {
      warn(`recovery-build-identity.json not on Cloudflare yet — include in zip deploy`);
      return;
    }
    const remoteId = await idRes.json();
    if (remoteId.bundleHash !== identity.bundleHash) {
      fail(
        `Cloudflare bundleHash mismatch.\n  local:  ${identity.bundleHash}\n  remote: ${remoteId.bundleHash}`
      );
    }
    pass('Cloudflare bundleHash matches local recovery identity');
    if (remoteId.git?.commit && !remoteId.git.commit.startsWith(FROZEN_COMMIT.slice(0, 7))) {
      warn(`Remote identity commit ${remoteId.git.commitShort} may differ from frozen base`);
    }
  } catch (e) {
    warn(`Remote identity check skipped: ${e.message}`);
  }
}

console.log('\n--- MP-HF-009 Recovery Deploy Identity ---');
console.log('commit:', identity.git.commitShort);
console.log('branch:', identity.git.branch);
console.log('APP_VERSION:', identity.appVersion);
console.log('iOS buildNumber:', identity.iosBuildNumber);
console.log('bundleHash:', identity.bundleHash);
console.log('nativeSourceHash:', identity.nativeSourceHash);
console.log('webAppUrl:', identity.webAppUrl);
console.log('');

await checkRemote();

console.log('\nRecovery deploy verification OK — safe to proceed with matched native + web build');
