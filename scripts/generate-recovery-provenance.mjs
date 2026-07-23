#!/usr/bin/env node
/**
 * MP-HF-009 — Generate recovery build identity (read-only provenance).
 * Run before Cloudflare zip and EAS build.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FROZEN_COMMIT = '9b91907fef6146d20aa905099782bac7deaed254';
const ALTERNATE_CANDIDATE = 'a84a0c4';

const BUNDLE_FILES = [
  'frontend/index.html',
  'frontend/js/tracking-debug.js',
  'frontend/js/tracking-provider.js',
  'frontend/js/native-platform.js',
  'frontend/js/trip-auto-end.js',
  'frontend/js/autopilot-motion.js',
  'frontend/js/trip-store.js',
];

const NATIVE_FILES = [
  'index.js',
  'src/nativeAutopilot.js',
  'src/expoLocationBridge.js',
  'src/locationTask.js',
  'src/MilePilotWebView.js',
  'src/nativeTrackingEngine.js',
  'src/nativeAutoEnd.js',
  'app.config.js',
];

function sha256File(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
}

function sha256Concat(rels) {
  const hash = crypto.createHash('sha256');
  for (const rel of rels) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    hash.update(rel);
    hash.update(fs.readFileSync(abs));
  }
  return hash.digest('hex');
}

function readAppVersion() {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  const m = html.match(/const APP_VERSION='([^']+)'/);
  return m ? m[1] : null;
}

function readBuildNumber() {
  const cfg = fs.readFileSync(path.join(root, 'app.config.js'), 'utf8');
  const m = cfg.match(/buildNumber:\s*'(\d+)'/);
  return m ? m[1] : null;
}

function git(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

const appVersion = readAppVersion();
const buildNumber = readBuildNumber();
const head = git('git rev-parse HEAD');
const branch = git('git rev-parse --abbrev-ref HEAD');
const shortHead = head ? head.slice(0, 7) : null;

const identity = {
  spec: 'MP-HF-009',
  label: 'Historical Recovery Build Validation',
  recoveryCandidate: true,
  frozenCommit: FROZEN_COMMIT,
  frozenCommitShort: FROZEN_COMMIT.slice(0, 7),
  alternateCandidate: ALTERNATE_CANDIDATE,
  generatedAt: new Date().toISOString(),
  git: {
    commit: head,
    commitShort: shortHead,
    branch,
    isFrozenCommit: head === FROZEN_COMMIT,
    containsFrozenCommit: !!git(`git merge-base --is-ancestor ${FROZEN_COMMIT} HEAD && echo yes`),
  },
  appVersion,
  versionTxt: fs.existsSync(path.join(root, 'frontend/version.txt'))
    ? fs.readFileSync(path.join(root, 'frontend/version.txt'), 'utf8').trim()
    : null,
  iosBuildNumber: buildNumber,
  easProfile: 'recovery-hf009',
  webAppUrl:
    process.env.WEB_APP_URL ||
    `https://app.milepilot.uk/?runtime=expo&build=recovery-hf009&commit=${FROZEN_COMMIT.slice(0, 7)}&v=${appVersion}`,
  bundleHash: sha256Concat(BUNDLE_FILES),
  bundleFiles: BUNDLE_FILES,
  nativeSourceHash: sha256Concat(NATIVE_FILES),
  nativeFiles: NATIVE_FILES,
  fileHashes: {
    'frontend/index.html': sha256File('frontend/index.html'),
    'src/nativeAutopilot.js': sha256File('src/nativeAutopilot.js'),
    'src/expoLocationBridge.js': sha256File('src/expoLocationBridge.js'),
    'src/locationTask.js': sha256File('src/locationTask.js'),
  },
  nativeAutopilotModulePresent: fs.existsSync(path.join(root, 'src/nativeAutopilot.js')),
  nativeBridgePresent: fs.existsSync(path.join(root, 'src/expoLocationBridge.js')),
};

const outPaths = [
  path.join(root, 'frontend/recovery-build-identity.json'),
  path.join(root, 'recovery-build-identity.json'),
];

for (const out of outPaths) {
  fs.writeFileSync(out, JSON.stringify(identity, null, 2) + '\n');
}

console.log('MP-HF-009 recovery build identity generated');
console.log('  commit:', shortHead, identity.git.isFrozenCommit ? '(frozen)' : '(descendant of frozen)');
console.log('  APP_VERSION:', appVersion);
console.log('  iOS buildNumber:', buildNumber);
console.log('  bundleHash:', identity.bundleHash.slice(0, 16) + '…');
console.log('  nativeSourceHash:', identity.nativeSourceHash.slice(0, 16) + '…');
console.log('  nativeAutopilot.js:', identity.nativeAutopilotModulePresent ? 'present' : 'MISSING');

if (!identity.nativeAutopilotModulePresent) {
  console.error('✗ nativeAutopilot.js missing — not a valid recovery candidate');
  process.exit(1);
}

if (identity.versionTxt && identity.versionTxt !== appVersion) {
  console.warn('⚠ version.txt !== APP_VERSION — fix before deploy');
}
