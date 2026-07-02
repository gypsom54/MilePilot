/**
 * Mileage vital scenario map — documents which automated tests cover each regression scenario.
 * Run: npm run test:mileage-checklist
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SCENARIOS = [
  {
    name: 'Start trip',
    tests: ['tests/tracking-regression.test.js', 'tests/trip-persistence.test.js'],
    symbols: ['mp_active_shift', 'MPTrips', 'active trip'],
  },
  {
    name: 'Track distance',
    tests: ['tests/tracking-regression.test.js'],
    symbols: ['processGpsPoint', 'pendingMeters'],
  },
  {
    name: 'End trip manually',
    tests: ['tests/trip-persistence.test.js'],
    symbols: ['mp_trips', 'completed trips'],
  },
  {
    name: 'Auto-end trip after inactivity',
    tests: ['tests/trip-auto-end.test.js'],
    symbols: ['MPTripAutoEnd', 'inactivity'],
  },
  {
    name: 'Save trip',
    tests: ['tests/trip-persistence.test.js', 'tests/tracking-regression.test.js'],
    symbols: ['mp_trips', 'mp_active_trip'],
  },
  {
    name: 'Classify trip',
    tests: ['tests/trip-persistence.test.js'],
    symbols: ['status', 'business', 'personal', 'pending'],
  },
  {
    name: 'Generate report',
    tests: ['tests/reports-regression.test.js'],
    symbols: ['buildPdfBuffer', 'analyseReport'],
  },
  {
    name: 'Send email',
    tests: ['tests/reports-regression.test.js', 'tests/summary-reports-collect.test.js'],
    symbols: ['/reports/send', 'scheduleDailyAfterShift', 'checkScheduledReports'],
  },
];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

let passed = 0;
let failed = 0;

for (const scenario of SCENARIOS) {
  const missingTests = scenario.tests.filter((t) => {
    try {
      read(t);
      return false;
    } catch {
      return true;
    }
  });
  const missingSymbols = scenario.symbols.filter((sym) => {
    const inTests = scenario.tests.some((t) => {
      try {
        return read(t).includes(sym);
      } catch {
        return false;
      }
    });
    const inIndex = sym.length > 3 && !sym.startsWith('/') ? read('frontend/index.html').includes(sym) : false;
    const inSummary = read('frontend/js/summary-reports.js').includes(sym);
    const inBackend = read('backend/reportEngine.js').includes(sym) || read('backend/server.js').includes(sym);
    return !(inTests || inIndex || inSummary || inBackend);
  });
  if (missingTests.length || missingSymbols.length) {
    console.error(`✗ ${scenario.name}`);
    if (missingTests.length) console.error('  missing test files:', missingTests.join(', '));
    if (missingSymbols.length) console.error('  missing symbols:', missingSymbols.join(', '));
    failed++;
  } else {
    console.log(`✓ ${scenario.name} — ${scenario.tests.join(', ')}`);
    passed++;
  }
}

console.log(`\nMileage vital checklist: ${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
