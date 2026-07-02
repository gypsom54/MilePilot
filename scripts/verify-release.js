#!/usr/bin/env node
/**
 * Release gate — blocks TestFlight/Cloudflare deploy if versions are mismatched.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(msg) {
  console.error('✗ RELEASE GATE FAILED:', msg);
  process.exit(1);
}

function pass(msg) {
  console.log('✓', msg);
}

const index = read('frontend/index.html');
const versionMatch = index.match(/const APP_VERSION='([^']+)'/);
const appVersion = versionMatch ? versionMatch[1] : null;
const versionTxt = read('frontend/version.txt').trim();
const appConfig = read('app.config.js');
const eas = read('eas.json');

if (!appVersion) fail('APP_VERSION not found in frontend/index.html');
if (versionTxt !== appVersion) fail(`version.txt (${versionTxt}) !== APP_VERSION (${appVersion})`);
pass(`PWA version aligned: ${appVersion}`);

const buildMatch = appConfig.match(/buildNumber:\s*'(\d+)'/);
const buildNumber = buildMatch ? buildMatch[1] : null;
if (!buildNumber) fail('ios.buildNumber not found in app.config.js');
pass(`iOS buildNumber: ${buildNumber}`);

const webUrlMatch = appConfig.match(/webAppUrl:[\s\S]*?v=([\d.]+)/);
if (!webUrlMatch || webUrlMatch[1] !== appVersion) {
  fail(`app.config.js webAppUrl must pin v=${appVersion}`);
}
pass('app.config.js webAppUrl pinned');

const easPins = [...eas.matchAll(/v=([\d.]+)/g)].map((m) => m[1]);
const badEas = easPins.filter((v) => v !== appVersion);
if (badEas.length) fail(`eas.json has mismatched version pins: ${badEas.join(', ')}`);
pass('eas.json WEB_APP_URL pins aligned');

console.log('\nRelease gate OK — safe to deploy Cloudflare zip and EAS build', appVersion, 'build', buildNumber);
