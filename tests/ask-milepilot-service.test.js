/**
 * MP-S5-001 — Ask MilePilot Core Engine tests
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function createMockLocalStorage(seed) {
  const map = new Map(Object.entries(seed || {}));
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}

function loadAskEngine(ls, extra) {
  const files = [
    'frontend/js/trip-store.js',
    'frontend/js/custom-period-report.js',
    'frontend/js/summary-reports.js',
    'frontend/js/tracking-mode.js',
    'frontend/js/ask-milepilot-service.js',
  ];
  const sandbox = {
    localStorage: ls,
    window: {},
    globalThis: {},
    console,
    Date,
    fetch: extra && extra.fetch ? extra.fetch : null,
  };
  sandbox.window = sandbox.globalThis;
  sandbox.window.localStorage = ls;
  sandbox.globalThis.localStorage = ls;
  files.forEach((f) => {
    vm.runInNewContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox);
  });
  return sandbox.window.MPAskMilePilotService;
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

const claim = () => 0.55;
const now = new Date('2026-07-22T12:00:00.000Z');

function seedTrips(ls) {
  const trips = [
    {
      id: 't1',
      status: 'business',
      miles: 18.2,
      seconds: 1200,
      startISO: '2026-07-22T08:15:00.000Z',
      endISO: '2026-07-22T08:45:00.000Z',
      vehicle: 'car',
    },
    {
      id: 't2',
      status: 'business',
      miles: 24.4,
      seconds: 1800,
      startISO: '2026-07-15T14:00:00.000Z',
      endISO: '2026-07-15T14:40:00.000Z',
      vehicle: 'car',
    },
    {
      id: 't3',
      status: 'pending',
      miles: 6.5,
      seconds: 900,
      startISO: '2026-07-21T16:00:00.000Z',
      endISO: '2026-07-21T16:20:00.000Z',
      vehicle: 'car',
    },
  ];
  ls.setItem('mp_trips', JSON.stringify(trips));
  ls.setItem('mp_vehicle', 'car');
  ls.setItem('mp_email', 'accounts@smithco.co.uk');
  ls.setItem('mp_driver', 'Alex');
}

run('IntentRouter — claim amount question', () => {
  const svc = loadAskEngine(createMockLocalStorage());
  const r = svc.IntentRouter.route('How much can I claim this month?');
  assert.equal(r.intent, svc.INTENTS.ClaimAmount);
});

run('IntentRouter — today journeys', () => {
  const svc = loadAskEngine(createMockLocalStorage());
  const r = svc.IntentRouter.route("Show today's journeys");
  assert.equal(r.intent, svc.INTENTS.TodaysTrips);
});

run('IntentRouter — pending trips', () => {
  const svc = loadAskEngine(createMockLocalStorage());
  const r = svc.IntentRouter.route('Which trips still need reviewing?');
  assert.equal(r.intent, svc.INTENTS.PendingTrips);
});

run('IntentRouter — email accountant', () => {
  const svc = loadAskEngine(createMockLocalStorage());
  const r = svc.IntentRouter.route('Email my accountant');
  assert.equal(r.intent, svc.INTENTS.EmailAccountant);
});

run('Mileage retrieval — claim this month', () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  svc.init({ getNow: () => now });
  const data = svc.MileageQueryService.claimThisMonth();
  assert.ok(data.miles >= 18.2);
  assert.ok(data.hmrc > 0);
  assert.ok(data.trips >= 2);
});

run('Journey retrieval — today business trips', () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  svc.init({ getNow: () => now });
  const data = svc.JourneyQueryService.todaysTrips();
  assert.equal(data.business.length, 1);
  assert.equal(data.business[0].id, 't1');
});

run('Journey retrieval — pending trips', () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  const data = svc.JourneyQueryService.pendingTrips();
  assert.equal(data.count, 1);
  assert.equal(data.pending[0].id, 't3');
});

run('Response formatter — friendly claim text', () => {
  const svc = loadAskEngine(createMockLocalStorage());
  const out = svc.ResponseFormatter.claimAmount({
    intent: svc.INTENTS.ClaimAmount,
    hmrc: 64.17,
    miles: 142.6,
    trips: 12,
    periodLabel: 'July 2026',
  });
  assert.equal(out.view, 'simple');
  assert.equal(out.hero, '£64.17');
  assert.match(out.detail, /142\.6 business miles/);
  assert.ok(!JSON.stringify(out).includes('"hmrc"'));
});

run('Response formatter — empty week message', () => {
  const svc = loadAskEngine(createMockLocalStorage());
  const out = svc.ResponseFormatter.journeyList({ business: [], pending: [] }, 'this week');
  assert.equal(out.view, 'text');
  assert.match(out.message, /couldn't find/i);
});

run('Report retrieval — confirmation preview', () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  svc.init({ getNow: () => now });
  const data = svc.ReportQueryService.emailAccountantPreview();
  assert.equal(data.action, 'email');
  assert.equal(data.recipient, 'accounts@smithco.co.uk');
  const view = svc.ResponseFormatter.format(data);
  assert.equal(view.view, 'confirm');
  assert.match(view.contents, /trip/);
});

run('handleQuestion — end-to-end claim', async () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  svc.init({ getNow: () => now });
  const response = await svc.handleQuestion('How much can I claim this month?');
  assert.equal(response.view, 'simple');
  assert.ok(response.hero.startsWith('£'));
});

run('Confirmation flow — prepare without apiPost', async () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  svc.init({ getNow: () => now, apiPost: null });
  await svc.handleQuestion('Prepare my mileage report');
  const result = await svc.confirmAction('prepare');
  assert.equal(result.view, 'text');
  assert.match(result.message, /prepared/i);
});

run('Confirmation flow — email blocked in preview', async () => {
  const ls = createMockLocalStorage();
  seedTrips(ls);
  const svc = loadAskEngine(ls);
  svc.init({ getNow: () => now, apiPost: null });
  await svc.handleQuestion('Email my accountant');
  const result = await svc.confirmAction('email');
  assert.equal(result.view, 'text');
  assert.match(result.message, /couldn't send/i);
});

run('Autopilot status — reads tracking mode', () => {
  const ls = createMockLocalStorage();
  ls.setItem('mp_tracking_mode', 'manual');
  const svc = loadAskEngine(ls);
  const data = svc.ReportQueryService.autopilotStatus();
  assert.equal(data.isAutoPilot, false);
  const view = svc.ResponseFormatter.autopilotStatus(data);
  assert.match(view.message, /Manual/i);
});

console.log(`\nAsk MilePilot service: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
