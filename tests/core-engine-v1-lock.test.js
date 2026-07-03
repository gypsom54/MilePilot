/**
 * Core Tracking Engine v1.0 lock manifest — ensures sign-off doc and contract stay aligned.
 * Run: node tests/core-engine-v1-lock.test.js
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const contract = JSON.parse(readFileSync(join(root, 'scripts/tracking-contract.json'), 'utf8'));
const manifestPath = join(root, contract.lockManifest);

let failed = 0;

function fail(msg) {
  console.error('✗ ' + msg);
  failed++;
}

function pass(msg) {
  console.log('✓ ' + msg);
}

if (!contract.coreEngineVersion) {
  fail('tracking-contract.json: missing coreEngineVersion');
} else {
  pass(`coreEngineVersion=${contract.coreEngineVersion}`);
}

if (contract.coreEngineStatus !== 'LOCKED') {
  fail(`tracking-contract.json: coreEngineStatus must be LOCKED (got ${contract.coreEngineStatus})`);
} else {
  pass('coreEngineStatus=LOCKED');
}

if (!existsSync(manifestPath)) {
  fail(`Missing lock manifest: ${contract.lockManifest}`);
} else {
  pass(`lock manifest exists: ${contract.lockManifest}`);
  const manifest = readFileSync(manifestPath, 'utf8');

  const requiredSections = [
    'Real-world validation',
    'Frozen components',
    'Trusted foundation for future features',
    'Change policy',
    'Protection layers',
  ];
  for (const section of requiredSections) {
    if (!manifest.includes(section)) fail(`manifest missing section: ${section}`);
    else pass(`manifest section: ${section}`);
  }

  const frozenItems = [
    'GPS tracking logic',
    'Distance calculations',
    'Background task handling',
    'Shift lifecycle',
    'Mileage calculations',
    'Report generation trigger',
    'Email generation trigger',
  ];
  for (const item of frozenItems) {
    if (!manifest.includes(item)) fail(`manifest missing frozen item: ${item}`);
    else pass(`frozen: ${item}`);
  }

  const futureFeatures = [
    'AutoPilot Motion Detection',
    'AI Journey Learning',
    'Business / Personal Classification',
    'Automatic Shift Detection',
    'Confidence Scoring',
  ];
  for (const feature of futureFeatures) {
    if (!manifest.includes(feature)) fail(`manifest missing future feature: ${feature}`);
    else pass(`future extension: ${feature}`);
  }
}

if (failed) {
  console.error(`\n${failed} core engine v1 lock check(s) failed.\n`);
  process.exit(1);
}

console.log('\nCore Tracking Engine v1.0 lock OK\n');
