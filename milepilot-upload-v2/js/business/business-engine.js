/**
 * MilePilot Business Engine — Orchestrator (LOCKED ARCHITECTURE)
 *
 * Wires every engine to ONE shared event bus and namespaced stores, injects the
 * cross-engine data providers, bridges external mileage in, and exposes a single
 * live snapshot the Business Home subscribes to.
 *
 * Dependency direction is strictly one-way: engines depend on the bus + their
 * own store only. The orchestrator is the ONLY place that knows about all
 * engines, so there are no circular dependencies and any engine can be replaced.
 *
 * Usage (app):   var biz = MPBusinessEngine.start({ mileage: fn, signals: {...} });
 *                biz.subscribe(function (snapshot) { render(snapshot); });
 * Usage (tests): pass a custom store factory / clock for isolation.
 */
(function (global) {
  'use strict';

  function req(name) {
    var m = global[name];
    if (!m) throw new Error('MPBusinessEngine: missing dependency ' + name);
    return m;
  }

  function start(config) {
    config = config || {};
    var Bus = req('MPBusinessBus');
    var StoreFactory = config.storeFactory || req('MPBusinessStore').create;
    var now = config.now || function () { return Date.now(); };
    var bus = config.bus || Bus.create();
    var E = bus.events;

    var mileageProvider =
      typeof config.mileage === 'function'
        ? config.mileage
        : function () { return { monthMiles: 0, monthHmrc: 0, monthTrips: 0, ytdHmrc: 0, ytdMiles: 0 }; };
    var externalSignals = config.signals || {};

    function store(ns) {
      return StoreFactory(ns);
    }

    // --- Instantiate engines (order does not matter; they wire via the bus) ---
    var receipt = req('MPReceiptEngine').create({
      bus: bus, store: store('receipt'), now: now, deps: config.receipt || {},
    });
    var ocr = req('MPOcrEngine').create({
      bus: bus, store: store('ocr'), now: now, deps: config.ocr || {},
    });
    var expense = req('MPExpenseEngine').create({
      bus: bus, store: store('expense'), now: now, deps: config.expense || {},
    });
    var vat = req('MPVatEngine').create({
      bus: bus, store: store('vat'), now: now,
      deps: Object.assign({ getExpenses: function () { return expense.getExpenses(); } }, config.vat || {}),
    });
    var timeline = req('MPTimelineEngine').create({
      bus: bus, store: store('timeline'), now: now,
    });
    var health = req('MPBusinessHealthEngine').create({
      bus: bus, store: store('health'), now: now,
      deps: {
        signals: {
          mileageOn: externalSignals.mileageOn,
          tripsThisMonth: externalSignals.tripsThisMonth,
          reportsReady: externalSignals.reportsReady,
          profileComplete: externalSignals.profileComplete,
          receiptsCaptured: function () { return receipt.getState().total > 0; },
          expensesLogged: function () { return expense.getState().count > 0; },
        },
      },
    });
    var report = req('MPReportEngine').create({
      bus: bus, store: store('report'), now: now,
      deps: {
        getMileage: mileageProvider,
        getExpenseState: function () { return expense.getState(); },
        getVatState: function () { return vat.getState(); },
      },
    });
    var ai = req('MPAiEngine').create({
      bus: bus, store: store('ai'), now: now,
      deps: Object.assign({
        providers: {
          getExpenseState: function () { return expense.getState(); },
          getVatState: function () { return vat.getState(); },
          getMileage: mileageProvider,
          getHealth: function () { return health.getState(); },
        },
      }, config.ai || {}),
    });
    var notification = req('MPNotificationEngine').create({
      bus: bus, store: store('notification'), now: now,
    });

    var engines = {
      receipt: receipt, ocr: ocr, expense: expense, vat: vat,
      timeline: timeline, health: health, report: report,
      ai: ai, notification: notification,
    };

    // --- Aggregate snapshot the UI subscribes to (UI never reads engines directly) ---
    function getSnapshot() {
      return {
        mileage: mileageProvider(),
        health: health.getState(),
        expenses: expense.getState(),
        vat: vat.getState(),
        timeline: timeline.getState(),
        reports: report.getState(),
        notifications: notification.getPending(),
        insights: ai.getInsights(),
        at: now(),
      };
    }

    // Any meaningful change re-emits a single STATE_CHANGED for the UI.
    var AGG = [E.HEALTH_UPDATED, E.EXPENSE_UPDATED, E.VAT_UPDATED, E.TIMELINE_UPDATED, E.REPORT_UPDATED, E.NOTIFICATION_QUEUED, E.MILEAGE_UPDATED];
    AGG.forEach(function (evt) {
      bus.on(evt, function () { bus.emit(E.STATE_CHANGED, getSnapshot()); });
    });

    function subscribe(fn) {
      if (typeof fn !== 'function') return function () {};
      return bus.on(E.STATE_CHANGED, fn);
    }

    /** Bridge external mileage (existing shifts/trips) into the event system. */
    function ingestMileage(meta) {
      bus.emit(E.MILEAGE_UPDATED, meta || {});
      // Mileage affects health + reports which are event-driven; recompute to seed.
      health.recompute();
      report.recompute();
    }

    // Seed derived state once so first snapshot is populated.
    vat.recompute();
    report.recompute();
    health.recompute();

    return {
      bus: bus,
      engines: engines,
      getSnapshot: getSnapshot,
      subscribe: subscribe,
      ingestMileage: ingestMileage,
      ask: function (q) { return ai.ask(q); },
      destroy: function () {
        Object.keys(engines).forEach(function (k) {
          if (engines[k] && engines[k].destroy) engines[k].destroy();
        });
        bus.clear();
      },
    };
  }

  var api = { start: start };
  global.MPBusinessEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
