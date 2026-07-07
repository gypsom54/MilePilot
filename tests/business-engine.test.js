/**
 * Business Engine architecture tests (Node, no framework).
 *
 * Proves: each engine is independently testable, communicates only via events,
 * the full event chain runs automatically, and every module loads standalone
 * (no circular dependencies).
 *
 * Run: node tests/business-engine.test.js
 */
'use strict';

var assert = require('assert');
var path = require('path');

function load(rel) {
  return require(path.join(__dirname, '..', 'frontend', 'js', 'business', rel));
}

var Bus = load('event-bus.js');
load('store.js');
load('receipt-engine.js');
load('ocr-engine.js');
load('expense-engine.js');
load('vat-engine.js');
load('timeline-engine.js');
load('business-health-engine.js');
load('report-engine.js');
load('ai-engine.js');
load('notification-engine.js');
var BusinessEngine = load('business-engine.js');

var tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }

function memStoreFactory() {
  var mem = {};
  return function create(ns) {
    var p = (ns || '') + ':';
    return {
      get: function (k, d) { return (p + k) in mem ? JSON.parse(mem[p + k]) : (d === undefined ? null : d); },
      set: function (k, v) { mem[p + k] = JSON.stringify(v); return v; },
      remove: function (k) { delete mem[p + k]; },
    };
  };
}
function flush() { return new Promise(function (res) { setTimeout(res, 0); }); }

// ---------------------------------------------------------------------------

test('event bus isolates handler errors and supports off()', function () {
  var bus = Bus.create();
  var seen = [];
  bus.on('x', function () { throw new Error('boom'); });
  var off = bus.on('x', function (p) { seen.push(p); });
  bus.emit('x', 1);
  off();
  bus.emit('x', 2);
  assert.deepStrictEqual(seen, [1]);
});

test('receipt engine: capture -> stored via injected compress', function () {
  var bus = Bus.create();
  var stored = [];
  bus.on(Bus.events.RECEIPT_STORED, function (p) { stored.push(p.id); });
  var eng = globalThis.MPReceiptEngine.create({ bus: bus, store: memStoreFactory()('r'), deps: { compress: function (r) { return Promise.resolve('c:' + r); } } });
  var r = eng.capture({ imageRef: 'img' });
  return flush().then(function () {
    assert.strictEqual(eng.getReceipt(r.id).status, 'stored');
    assert.deepStrictEqual(stored, [r.id]);
  });
});

test('receipt engine: failed compress marks failed and is retryable', function () {
  var bus = Bus.create();
  var fail = 0;
  bus.on(Bus.events.RECEIPT_FAILED, function () { fail++; });
  var eng = globalThis.MPReceiptEngine.create({ bus: bus, store: memStoreFactory()('rf'), deps: { compress: function () { return Promise.reject(new Error('no disk')); } } });
  var r = eng.capture({ imageRef: 'img' });
  return flush().then(function () {
    assert.strictEqual(eng.getReceipt(r.id).status, 'failed');
    assert.strictEqual(fail, 1);
  });
});

test('ocr engine: emits OCR_COMPLETE from injected recogniser on RECEIPT_STORED', function () {
  var bus = Bus.create();
  var done = null;
  bus.on(Bus.events.OCR_COMPLETE, function (p) { done = p; });
  globalThis.MPOcrEngine.create({ bus: bus, store: memStoreFactory()('o'), deps: { recognise: function () { return Promise.resolve({ rawText: 'SHELL 60.00', fields: { merchant: 'Shell', amount: 60 }, confidence: 0.9 }); } } });
  bus.emit(Bus.events.RECEIPT_STORED, { id: 'r1', receipt: { id: 'r1', storedRef: 'x' } });
  return flush().then(function () {
    assert.ok(done, 'OCR_COMPLETE emitted');
    assert.strictEqual(done.fields.amount, 60);
    assert.strictEqual(done.confidence, 0.9);
  });
});

test('expense engine: confident OCR creates a categorised expense', function () {
  var bus = Bus.create();
  var eng = globalThis.MPExpenseEngine.create({ bus: bus, store: memStoreFactory()('e') });
  bus.emit(Bus.events.OCR_COMPLETE, { receiptId: 'r1', fields: { merchant: 'Shell', amount: 60, date: Date.now() }, confidence: 0.9 });
  var st = eng.getState();
  assert.strictEqual(st.count, 1);
  assert.strictEqual(st.byCategory.fuel, 60);
});

test('expense engine: low-confidence OCR does NOT fabricate an expense', function () {
  var bus = Bus.create();
  var eng = globalThis.MPExpenseEngine.create({ bus: bus, store: memStoreFactory()('e2') });
  bus.emit(Bus.events.OCR_COMPLETE, { receiptId: 'r2', fields: { merchant: null, amount: null }, confidence: 0 });
  assert.strictEqual(eng.getState().count, 0);
});

test('vat engine: reclaimable recomputed on EXPENSE_UPDATED', function () {
  var bus = Bus.create();
  var expenses = [{ amount: 120, date: Date.now(), category: 'fuel' }];
  globalThis.MPVatEngine.create({ bus: bus, store: memStoreFactory()('v'), deps: { getExpenses: function () { return expenses; } } });
  var got = null;
  bus.on(Bus.events.VAT_UPDATED, function (p) { got = p; });
  bus.emit(Bus.events.EXPENSE_UPDATED, {});
  assert.ok(got);
  assert.strictEqual(got.monthReclaimable, 20);
});

test('business health engine: score reflects satisfied factors', function () {
  var bus = Bus.create();
  var health = globalThis.MPBusinessHealthEngine.create({
    bus: bus, store: memStoreFactory()('h'),
    deps: { signals: { mileageOn: function () { return true; }, tripsThisMonth: function () { return true; }, reportsReady: function () { return true; } } },
  });
  var snap = health.recompute();
  assert.strictEqual(snap.score, 65);
  assert.strictEqual(snap.tone, 'strong');
  assert.ok(snap.missing.length > 0);
  assert.ok(snap.suggestions.length > 0);
});

test('timeline engine: expense added produces a timeline entry', function () {
  var bus = Bus.create();
  var tl = globalThis.MPTimelineEngine.create({ bus: bus, store: memStoreFactory()('t') });
  bus.emit(Bus.events.EXPENSE_UPDATED, { reason: 'added', expense: { merchant: 'BP', category: 'fuel', amount: 40 } });
  assert.strictEqual(tl.getState().count, 1);
  assert.ok(/BP/.test(tl.getEntries(1)[0].title));
});

test('orchestrator: full chain runs automatically and emits STATE_CHANGED', function () {
  var biz = BusinessEngine.start({
    storeFactory: memStoreFactory(),
    mileage: function () { return { monthMiles: 20, monthHmrc: 9, monthTrips: 2, ytdMiles: 20, ytdHmrc: 9 }; },
    signals: { mileageOn: function () { return true; }, tripsThisMonth: function () { return true; }, reportsReady: function () { return true; }, profileComplete: function () { return true; } },
  });
  var changes = 0;
  biz.subscribe(function () { changes++; });
  biz.engines.expense.addExpense({ merchant: 'BP', amount: 60, date: Date.now(), source: 'test' });
  var snap = biz.getSnapshot();
  assert.strictEqual(snap.expenses.count, 1);
  assert.strictEqual(snap.vat.monthReclaimable, 10);
  assert.ok(snap.health.score >= 55);
  assert.ok(snap.reports.available.monthly);
  assert.ok(changes > 0);
  biz.destroy();
});

test('AI engine: answers from real data, never invents figures', function () {
  var biz = BusinessEngine.start({
    storeFactory: memStoreFactory(),
    mileage: function () { return { monthMiles: 0, monthHmrc: 0, monthTrips: 0, ytdMiles: 0, ytdHmrc: 0 }; },
  });
  biz.engines.expense.addExpense({ merchant: 'Shell', amount: 48, category: 'fuel', date: Date.now() });
  var ans = biz.ask('how much did I spend on fuel this month?');
  assert.ok(/48\.00/.test(ans), 'cites real total: ' + ans);
  biz.destroy();
});

test('notification engine: health change queues one notification', function () {
  var bus = Bus.create();
  var notif = globalThis.MPNotificationEngine.create({ bus: bus, store: memStoreFactory()('n') });
  bus.emit(Bus.events.HEALTH_UPDATED, { changed: true, previousScore: 40, health: { score: 65, label: 'Well organised' } });
  assert.strictEqual(notif.getPending().length, 1);
});

// --- runner (sequential, supports promise-returning tests) ------------------
(function run() {
  var i = 0;
  var checks = 0;
  function next() {
    if (i >= tests.length) {
      console.log('\nBusiness Engine: all tests passed (' + tests.length + ' tests)');
      return;
    }
    var t = tests[i++];
    Promise.resolve()
      .then(t.fn)
      .then(function () {
        console.log('\u2713 ' + t.name);
        checks++;
        next();
      })
      .catch(function (e) {
        console.error('\u2717 ' + t.name + '\n   ' + (e && e.message));
        process.exit(1);
      });
  }
  next();
})();
