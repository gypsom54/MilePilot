/**
 * MP-S5-005 — Ask MilePilot production integration tests
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;
const pending = [];

function run(name, fn) {
  const job = (async () => {
    try {
      await fn();
      console.log('✓ ' + name);
      passed++;
    } catch (e) {
      console.error('✗ ' + name);
      console.error('  ' + e.message);
      failed++;
    }
  })();
  pending.push(job);
}

function loadEngine(sandbox) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/mp-tax-engine.js'), 'utf8'), sandbox);
  sandbox.MPTaxEngine = sandbox.window.MPTaxEngine;
}

function loadAskService(sandbox) {
  loadEngine(sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/ask-milepilot-service.js'), 'utf8'), sandbox);
  return sandbox.window.MPAskMilePilotService;
}

function baseSandbox() {
  return {
    window: {},
    globalThis: {},
    console,
    Date,
    localStorage: { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = v; } },
  };
}

function initService(S, opts = {}) {
  const now = opts.now || new Date('2026-07-15T12:00:00.000Z');
  S.init({
    getNow: () => now,
    getVehicle: () => opts.vehicle || 'car',
    getTrips: () => opts.trips || [],
    getShifts: () => opts.shifts || [],
    getEmail: () => opts.email ?? '',
    claimFn: opts.claimFn,
    apiPost: opts.apiPost,
  });
}

function trip(id, miles, startISO, status = 'business', vehicle = 'car') {
  return { id, miles, startISO, endISO: startISO, status, vehicle, hmrc: 0 };
}

/* —— Intent routing —— */
run('intent: claim this month', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const r = S.IntentRouter.route('How much can I claim this month?');
  assert.equal(r.intent, S.INTENTS.ClaimAmount);
});

run('intent: mileage summary', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const r = S.IntentRouter.route('How many miles have I driven?');
  assert.equal(r.intent, S.INTENTS.MileageSummary);
});

run('intent: monthly report vs email collision', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  assert.equal(S.IntentRouter.route('Show my report for this month.').intent, S.INTENTS.MileageReport);
  assert.equal(S.IntentRouter.route('Email my mileage report to my accountant').intent, S.INTENTS.EmailAccountant);
});

run('intent: accountant email lookup not email action', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  assert.equal(S.IntentRouter.route("What is my accountant's email?").intent, S.INTENTS.AccountantEmailLookup);
  assert.equal(S.IntentRouter.route('Email my mileage report to my accountant').intent, S.INTENTS.EmailAccountant);
});

run('intent: fuel returns NotConnected', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const r = S.IntentRouter.route('How much did I spend on fuel?');
  assert.equal(r.intent, S.INTENTS.NotConnected);
  assert.equal(r.feature, 'fuel');
});

run('intent: VAT returns NotConnected', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const r = S.IntentRouter.route('What is my VAT position?');
  assert.equal(r.intent, S.INTENTS.NotConnected);
  assert.equal(r.feature, 'vat');
});

run('intent: accountant pack returns NotConnected', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const r = S.IntentRouter.route('Prepare my accountant pack');
  assert.equal(r.intent, S.INTENTS.NotConnected);
  assert.equal(r.feature, 'accountantPack');
});

run('intent: unsupported joke returns Unknown', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  assert.equal(S.IntentRouter.route('Tell me a joke').intent, S.INTENTS.Unknown);
});

/* —— Real dependency / MPTaxEngine —— */
run('claim this month uses MPTaxEngine not flat rate', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, {
    trips: [trip('t1', 100, '2026-07-01T08:00:00.000Z')],
    claimFn: () => {
      throw new Error('claimFn must not be used for period totals');
    },
  });
  const result = S.MileageQueryService.claimThisMonth();
  assert.ok(result.hmrc > 0);
  assert.equal(result.hmrc, 55);
});

run('collectRange throws when MPTaxEngine missing', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S);
  delete sb.window.MPTaxEngine;
  assert.throws(() => {
    S._test.collectRange(new Date('2026-07-01'), new Date('2026-08-01'));
  }, /MPTaxEngine unavailable/);
});

run('defaultClaim path throws when MPTaxEngine missing', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('t1', 10, '2026-07-01T08:00:00.000Z')] });
  delete sb.window.MPTaxEngine;
  assert.throws(() => S.MileageQueryService.claimThisMonth(), /MPTaxEngine unavailable/);
});

/* —— Query handlers —— */
run('handleQuestion: claim query', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('t1', 50, '2026-07-10T08:00:00.000Z')] });
  const resp = await S.handleQuestion('How much can I claim this month?');
  assert.equal(resp.view, 'simple');
  assert.ok(resp.hero);
});

run('handleQuestion: journey today', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('t1', 12, '2026-07-15T09:00:00.000Z')] });
  const resp = await S.handleQuestion("Show today's journeys.");
  assert.equal(resp.view, 'detailed');
  assert.ok(resp.rows.length);
});

run('handleQuestion: weekly trips', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('t1', 8, '2026-07-14T09:00:00.000Z')] });
  const resp = await S.handleQuestion("Show this week's trips.");
  assert.ok(resp.view === 'detailed' || resp.view === 'text');
});

run('handleQuestion: monthly trips', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('t1', 20, '2026-07-05T09:00:00.000Z')] });
  const resp = await S.handleQuestion("Show this month's trips.");
  assert.ok(resp.view);
});

run('handleQuestion: pending trips', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('p1', 5, '2026-07-12T09:00:00.000Z', 'pending')] });
  const resp = await S.handleQuestion('Which trips need reviewing?');
  assert.equal(resp.view, 'detailed');
});

run('handleQuestion: compare months', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, {
    trips: [
      trip('c1', 30, '2026-07-10T09:00:00.000Z'),
      trip('p1', 20, '2026-06-10T09:00:00.000Z'),
    ],
  });
  const resp = await S.handleQuestion('Compare this month with last month');
  assert.equal(resp.view, 'text');
  assert.ok(resp.message.includes('July') || resp.message.includes('Jun'));
});

run('handleQuestion: drove yesterday', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('y1', 10, '2026-07-14T09:00:00.000Z')] });
  const resp = await S.handleQuestion('Did I drive yesterday?');
  assert.equal(resp.view, 'text');
  assert.ok(resp.message.includes('Yes') || resp.message.includes("couldn't find"));
});

run('handleQuestion: last journey', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { trips: [trip('l1', 7, '2026-07-14T09:00:00.000Z')] });
  const resp = await S.handleQuestion('When was my last journey?');
  assert.equal(resp.view, 'text');
});

run('handleQuestion: AutoPilot status', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  sb.MPTrackingMode = { getMode: () => 'autopilot' };
  sb.MPAutoPilotMotion = { isMotionEnabled: () => true, getDebugState: () => ({ state: 'ARMED' }) };
  initService(S);
  const resp = await S.handleQuestion('Is AutoPilot enabled?');
  assert.equal(resp.view, 'text');
  assert.ok(resp.message.toLowerCase().includes('autopilot'));
});

run('handleQuestion: fuel not-connected response', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S);
  const resp = await S.handleQuestion('How much did I spend on fuel?');
  assert.equal(resp.view, 'text');
  assert.ok(resp.message.includes('not connected'));
});

run('handleQuestion: VAT not-connected response', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S);
  const resp = await S.handleQuestion('What is my VAT position?');
  assert.ok(resp.message.includes('not connected'));
});

run('handleQuestion: accountant pack not-connected', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S);
  const resp = await S.handleQuestion('Prepare my accountant pack');
  assert.ok(resp.message.includes('not connected'));
});

run('handleQuestion: unsupported does not fabricate', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S);
  const resp = await S.handleQuestion('Tell me a joke');
  assert.equal(resp.view, 'text');
  assert.ok(resp.message.includes('mileage'));
});

/* —— Email / actions —— */
run('missing email blocks email action', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { email: '', trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')] });
  const resp = await S.handleQuestion('Email my accountant');
  assert.equal(resp.view, 'text');
  assert.ok(resp.message.includes('Settings'));
  assert.equal(S.ActionExecutor.getPending(), null);
});

run('accountant email lookup without saved email', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, { email: '' });
  const resp = await S.handleQuestion("What is my accountant's email?");
  assert.ok(resp.message.includes('No email address'));
});

run('prepare report shows confirmation not execution', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  mockReportPayload(sb);
  const S = loadAskService(sb);
  let executed = false;
  initService(S, {
    email: 'driver@example.com',
    trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')],
    apiPost: async () => {
      executed = true;
      return {};
    },
  });
  const resp = await S.handleQuestion('Prepare my mileage report');
  assert.equal(resp.view, 'confirm');
  assert.equal(executed, false);
  assert.ok(S.ActionExecutor.getPending());
});

run('cancel clears pending action', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, {
    email: 'driver@example.com',
    trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')],
  });
  await S.handleQuestion('Export my report');
  assert.ok(S.ActionExecutor.getPending());
  S.cancelAction();
  assert.equal(S.ActionExecutor.getPending(), null);
});

run('confirm executes once (double execution prevention)', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  mockReportPayload(sb);
  const S = loadAskService(sb);
  let calls = 0;
  initService(S, {
    email: 'driver@example.com',
    trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')],
    apiPost: async () => {
      calls++;
      await new Promise((r) => setTimeout(r, 20));
      return { blob: Buffer.from('pdf') };
    },
  });
  await S.handleQuestion('Export my report');
  const p1 = S.confirmAction('export');
  const p2 = S.confirmAction('export');
  const [r1, r2] = await Promise.all([p1, p2]);
  assert.equal(calls, 1);
  assert.ok(r1.message || r1.view);
  assert.ok(r2.message || r2.view);
});

run('action failure shows safe message not raw error', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  mockReportPayload(sb);
  const S = loadAskService(sb);
  initService(S, {
    email: 'driver@example.com',
    trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')],
    apiPost: async () => {
      throw new Error('SMTP connection refused: secret-host');
    },
  });
  await S.handleQuestion('Email my accountant');
  const resp = await S.confirmAction('email');
  assert.ok(resp.message.includes("couldn't") || resp.message.includes('try again'));
  assert.ok(!resp.message.includes('SMTP'));
});

run('question submission does not call apiPost', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  let calls = 0;
  initService(S, {
    email: 'driver@example.com',
    trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')],
    apiPost: async () => {
      calls++;
      return {};
    },
  });
  await S.handleQuestion('Email my accountant');
  assert.equal(calls, 0);
});

/* —— MPTaxEngine parity —— */
run('parity: under 10k car miles', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const trips = [trip('a', 5000, '2026-07-01T08:00:00.000Z')];
  initService(S, { trips });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(trips, [], 'car');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'car', asOfDate: new Date('2026-07-15') });
  assert.equal(ask.hmrc, summary.totalClaim);
  assert.equal(ask.miles, summary.eligibleMiles);
});

run('parity: exactly 10k miles', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const trips = [trip('b', 10000, '2026-07-01T08:00:00.000Z')];
  initService(S, { trips });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(trips, [], 'car');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'car', asOfDate: new Date('2026-07-15') });
  assert.equal(ask.hmrc, 5500);
  assert.equal(ask.hmrc, summary.totalClaim);
});

run('parity: above 10k miles', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const trips = [trip('c', 12000, '2026-07-01T08:00:00.000Z')];
  initService(S, { trips });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(trips, [], 'car');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'car', asOfDate: new Date('2026-07-15') });
  assert.equal(ask.hmrc, 6000);
  assert.equal(ask.hmrc, summary.totalClaim);
});

run('parity: threshold crossing journey', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const trips = [
    trip('d1', 9950, '2026-07-01T08:00:00.000Z'),
    trip('d2', 100, '2026-07-02T08:00:00.000Z'),
  ];
  initService(S, { trips });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(trips, [], 'car');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'car', asOfDate: new Date('2026-07-15') });
  assert.equal(ask.hmrc, summary.totalClaim);
});

run('parity: motorcycle flat rate', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const trips = [trip('m1', 100, '2026-07-01T08:00:00.000Z', 'business', 'motorcycle')];
  initService(S, { trips, vehicle: 'motorcycle' });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(trips, [], 'motorcycle');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'motorcycle', asOfDate: new Date('2026-07-15') });
  assert.equal(ask.hmrc, 24);
  assert.equal(ask.hmrc, summary.totalClaim);
});

run('parity: bicycle flat rate', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const trips = [trip('b1', 50, '2026-07-01T08:00:00.000Z', 'business', 'bicycle')];
  initService(S, { trips, vehicle: 'bicycle' });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys(trips, [], 'bicycle');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'bicycle', asOfDate: new Date('2026-07-15') });
  assert.equal(ask.hmrc, 10);
  assert.equal(ask.hmrc, summary.totalClaim);
});

run('parity: tax year boundary 5 April vs 6 April', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  const ty5 = E.getUkTaxYear('2026-04-05T12:00:00.000Z');
  const ty6 = E.getUkTaxYear('2026-04-06T12:00:00.000Z');
  assert.equal(ty5.id, '2025-26');
  assert.equal(ty6.id, '2026-27');
  initService(S, { now: new Date('2026-04-06T12:00:00.000Z'), trips: [trip('x', 100, '2026-04-06T08:00:00.000Z')] });
  const ask = S.MileageQueryService.claimThisMonth();
  assert.equal(ask.hmrc, 55);
});

run('parity: unknown vehicle returns zero claim safely', () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  const E = sb.MPTaxEngine;
  initService(S, { vehicle: 'spaceship', trips: [trip('u1', 10, '2026-07-01T08:00:00.000Z', 'business', 'spaceship')] });
  const ask = S.MileageQueryService.claimThisMonth();
  const all = E.collectBusinessJourneys([trip('u1', 10, '2026-07-01T08:00:00.000Z', 'business', 'spaceship')], [], 'spaceship');
  const summary = E.calculateTaxYearClaims({ journeys: all, vehicleType: 'spaceship', asOfDate: new Date('2026-07-15') });
  assert.equal(summary.valid, false);
  assert.equal(ask.hmrc, 0);
});

/* —— Locked suggestion copy —— */
run('locked suggestion copy in view', () => {
  const viewSrc = fs.readFileSync(path.join(root, 'frontend/js/ask-milepilot-view.js'), 'utf8');
  assert.ok(viewSrc.includes("How much can I claim this month?"));
  assert.ok(viewSrc.includes("Show today\\'s journeys") || viewSrc.includes("Show today's journeys"));
  assert.ok(viewSrc.includes('Which trips still need reviewing?'));
  assert.ok(viewSrc.includes('Prepare my mileage report'));
});

function mockReportPayload(sb) {
  sb.window.MPSummaryReports = {
    init: () => {},
    buildPayload: () => ({ email: 'driver@example.com', trips: [], hmrc: 5.5, miles: 10 }),
  };
}

/* —— Production wiring —— */
run('production index includes Ask scripts after MPTaxEngine', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  const engineIdx = html.indexOf('mp-tax-engine.js');
  const serviceIdx = html.indexOf('ask-milepilot-service.js');
  const appIdx = html.indexOf('ask-milepilot-app.js');
  assert.ok(engineIdx > 0 && serviceIdx > engineIdx && appIdx > serviceIdx);
  assert.ok(html.includes('showAsk()'));
  assert.ok(html.includes("view')==='ask'"));
  assert.ok(html.includes('mp_active_screen'));
});

run('upload mirror includes Ask scripts', () => {
  const html = fs.readFileSync(path.join(root, 'milepilot-upload-v2/index.html'), 'utf8');
  assert.ok(html.includes('ask-milepilot-service.js'));
  assert.ok(html.includes('ask-milepilot-app.js'));
});

/* —— App lifecycle (leave clears pending) —— */
run('leave equivalent clears pending via cancelAction', async () => {
  const sb = baseSandbox();
  sb.window = sb.globalThis;
  const S = loadAskService(sb);
  initService(S, {
    email: 'driver@example.com',
    trips: [trip('t1', 10, '2026-07-10T09:00:00.000Z')],
  });
  await S.handleQuestion('Export my report');
  assert.ok(S.ActionExecutor.getPending());
  S.cancelAction();
  assert.equal(S.ActionExecutor.getPending(), null);
});

async function finish() {
  await Promise.all(pending);
  console.log(`\nAsk MilePilot service: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

finish();
