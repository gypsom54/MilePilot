/**
 * MilePilot Business Engine — Report Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: the DATA MODEL and availability of business reports.
 *   Daily · Weekly · Monthly · Quarterly · Yearly · Accountant Pack
 *
 * Reacts to: MILEAGE_UPDATED, EXPENSE_UPDATED, VAT_UPDATED. Emits: REPORT_UPDATED.
 *
 * NOTE: This does NOT send emails or render PDFs — the locked report pipeline
 * (MPSummaryReports / backend) owns delivery. This engine only aggregates the
 * numbers a future Reports UI (and the Accountant Pack) will read.
 */
(function (global) {
  'use strict';

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var deps = ctx.deps || {};
    var getMileage = typeof deps.getMileage === 'function' ? deps.getMileage : function () { return { monthMiles: 0, monthHmrc: 0, ytdHmrc: 0, ytdMiles: 0, monthTrips: 0 }; };
    var getExpenses = typeof deps.getExpenseState === 'function' ? deps.getExpenseState : function () { return { monthTotal: 0, total: 0, monthCount: 0 }; };
    var getVat = typeof deps.getVatState === 'function' ? deps.getVatState : function () { return { monthReclaimable: 0, quarterReclaimable: 0 }; };

    function compute() {
      var m = getMileage() || {};
      var ex = getExpenses() || {};
      var vat = getVat() || {};
      var hasData = (m.monthTrips || 0) > 0 || (ex.monthCount || 0) > 0;
      return {
        available: {
          daily: hasData,
          weekly: hasData,
          monthly: hasData,
          quarterly: hasData,
          yearly: (m.ytdMiles || 0) > 0 || (ex.total || 0) > 0,
          accountantPack: hasData,
        },
        month: {
          miles: m.monthMiles || 0,
          mileageClaim: m.monthHmrc || 0,
          expenses: ex.monthTotal || 0,
          vatReclaimable: vat.monthReclaimable || 0,
        },
        quarter: { vatReclaimable: vat.quarterReclaimable || 0 },
        year: { mileageClaim: m.ytdHmrc || 0 },
        computedAt: Date.now(),
      };
    }

    function recompute() {
      var snap = compute();
      store.set('reports', snap);
      bus.emit(E.REPORT_UPDATED, snap);
      return snap;
    }

    var unsubs = [
      bus.on(E.MILEAGE_UPDATED, recompute),
      bus.on(E.EXPENSE_UPDATED, recompute),
      bus.on(E.VAT_UPDATED, recompute),
    ];

    function getState() {
      return store.get('reports', null) || compute();
    }

    return {
      recompute: recompute,
      getState: getState,
      destroy: function () { unsubs.forEach(function (u) { u(); }); },
    };
  }

  var api = { create: create };
  global.MPReportEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
