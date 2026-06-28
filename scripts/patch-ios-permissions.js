#!/usr/bin/env node
/**
 * Adds iOS location permission strings and background location mode after cap sync.
 */
const fs = require('fs');
const path = require('path');

const plistPath = path.join(__dirname, '..', 'ios', 'App', 'App', 'Info.plist');
if (!fs.existsSync(plistPath)) process.exit(0);

const WHEN_IN_USE =
  'MilePilot uses location to record your business journeys while you are working.';
const ALWAYS =
  'MilePilot uses background location so your mileage can continue recording when your phone is locked.';

let xml = fs.readFileSync(plistPath, 'utf8');
let changed = false;

function ensureKey(key, value) {
  const re = new RegExp(`<key>${key}</key>\\s*<string>[^<]*</string>`);
  if (re.test(xml)) return;
  const insert = `\t<key>${key}</key>\n\t<string>${value}</string>\n`;
  xml = xml.replace('</dict>\n</plist>', insert + '</dict>\n</plist>');
  changed = true;
}

ensureKey('NSLocationWhenInUseUsageDescription', WHEN_IN_USE);
ensureKey('NSLocationAlwaysAndWhenInUseUsageDescription', ALWAYS);
ensureKey('NSLocationAlwaysUsageDescription', ALWAYS);

if (!xml.includes('<string>location</string>') && xml.includes('UIBackgroundModes')) {
  xml = xml.replace(
    /(<key>UIBackgroundModes<\/key>\s*<array>)([\s\S]*?)(<\/array>)/,
    (m, open, inner, close) => {
      if (inner.includes('location')) return m;
      changed = true;
      return open + inner + '\t\t<string>location</string>\n\t' + close;
    }
  );
} else if (!xml.includes('UIBackgroundModes')) {
  const block =
    '\t<key>UIBackgroundModes</key>\n\t<array>\n\t\t<string>location</string>\n\t</array>\n';
  xml = xml.replace('</dict>\n</plist>', block + '</dict>\n</plist>');
  changed = true;
}

if (changed) {
  fs.writeFileSync(plistPath, xml);
  console.log('patch-ios-permissions: added location usage descriptions');
}
