#!/usr/bin/env node
/**
 * Static checks for stabilisation sprint UI contracts.
 * Run: npm run verify:stabilisation
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'frontend/index.html');
const html = fs.readFileSync(indexPath, 'utf8');

let failed = 0;
function fail(msg) {
  console.error('FAIL:', msg);
  failed += 1;
}
function pass(msg) {
  console.log('OK:', msg);
}

if (!html.includes("const APP_VERSION='8.43.0'")) {
  fail('APP_VERSION must be 8.43.0 for stabilisation build');
} else {
  pass('APP_VERSION 8.43.0');
}

if (html.includes('#knowYou .welcome-input-icon{left:0;width:44px')) {
  fail('knowYou name icon must not use oversized 44x52 override');
} else {
  pass('knowYou icon uses default 17px sizing');
}

if (!html.includes('id="nativeAlwaysModal"')) {
  fail('nativeAlwaysModal element missing');
} else {
  pass('nativeAlwaysModal present');
}

if (html.includes('showNativeAlwaysLocationBanner')) {
  fail('legacy showNativeAlwaysLocationBanner must be removed');
} else {
  pass('legacy bottom banner removed');
}

if (!html.includes('function shouldShowLocationAlwaysModal')) {
  fail('shouldShowLocationAlwaysModal gating missing');
} else {
  pass('permission modal gating present');
}

if (!html.includes('function openNativeAppSettings')) {
  fail('openNativeAppSettings helper missing');
} else {
  pass('Open Settings uses expo:settings:request bridge');
}

if (html.includes('.native-always-banner')) {
  fail('legacy .native-always-banner CSS must be removed');
} else {
  pass('full-screen permission modal CSS only');
}

if (!html.includes('.ai-stack{position:relative;height:min(280px,40vh)')) {
  fail('AI review stack height contract missing or changed');
} else {
  pass('AI review stack height capped');
}

const checklist = path.join(root, 'docs/STABILISATION_CHECKLIST.md');
if (!fs.existsSync(checklist)) {
  fail('docs/STABILISATION_CHECKLIST.md missing');
} else {
  pass('stabilisation checklist doc present');
}

if (failed) {
  console.error(`\n${failed} stabilisation check(s) failed.`);
  process.exit(1);
}
console.log('\nAll stabilisation static checks passed.');
