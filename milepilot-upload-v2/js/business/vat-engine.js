/**
 * MilePilot Business Engine — VAT Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: VAT figures derived from expenses.
 *   VAT Detection · Quarter Totals · Monthly Totals · (Report inputs)
 *
 * Reacts to: EXPENSE_UPDATED. Emits: VAT_UPDATED. Pure calculation — no storage
 * of source data (expenses are owned by the Expense Engine); it caches its own
 * computed snapshot only.
 */
(function (global) {
  'use strict';

  var STANDARD_RATE = 0.2; // UK standard VAT rate.

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var deps = ctx.deps || {};
    // Expense source is injected so the engine has no hard dependency on another engine.
    var getExpenses = typeof deps.getExpenses === 'function' ? deps.getExpenses : function () { return []; };
    var rate = deps.rate != null ? deps.rate : STANDARD_RATE;

    function num(v) {
      return Number(v) || 0;
    }
    // Detect the VAT element of a gross amount when not explicitly captured.
    function vatOf(expense) {
      if (expense.vat != null) return num(expense.vat);
      var gross = num(expense.amount);
      if (gross <= 0) return 0;
      return +(gross - gross / (1 + rate)).toFixed(2);
    }

    function quarterStart(d) {
      var x = d || new Date();
      var q = Math.floor(x.getMonth() / 3);
      return new Date(x.getFullYear(), q * 3, 1).getTime();
    }
    function monthStart(d) {
      var x = d || new Date();
      return new Date(x.getFullYear(), x.getMonth(), 1).getTime();
    }

    function compute() {
      var list = getExpenses() || [];
      var mStart = monthStart();
      var qStart = quarterStart();
      var monthVat = 0;
      var quarterVat = 0;
      var totalVat = 0;
      list.forEach(function (e) {
        var v = vatOf(e);
        totalVat += v;
        if (e.date >= mStart) monthVat += v;
        if (e.date >= qStart) quarterVat += v;
      });
      return {
        rate: rate,
        monthReclaimable: +monthVat.toFixed(2),
        quarterReclaimable: +quarterVat.toFixed(2),
        totalReclaimable: +totalVat.toFixed(2),
        computedAt: Date.now(),
      };
    }

    function recompute() {
      var snap = compute();
      store.set('vat', snap);
      bus.emit(E.VAT_UPDATED, snap);
      return snap;
    }

    var unsub = bus.on(E.EXPENSE_UPDATED, recompute);

    function getState() {
      return store.get('vat', null) || compute();
    }

    return {
      recompute: recompute,
      getState: getState,
      vatOf: vatOf,
      destroy: function () { unsub(); },
    };
  }

  var api = { create: create, STANDARD_RATE: STANDARD_RATE };
  global.MPVatEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
