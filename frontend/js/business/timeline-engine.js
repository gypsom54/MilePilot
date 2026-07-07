/**
 * MilePilot Business Engine — Timeline Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: a unified, chronological business activity feed.
 * Reacts to: RECEIPT_CAPTURED, EXPENSE_UPDATED, MILEAGE_UPDATED, VAT_UPDATED.
 * Emits: TIMELINE_UPDATED. Owns only the timeline log (a capped ring buffer).
 */
(function (global) {
  'use strict';

  var MAX_ENTRIES = 200;

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var now = ctx.now || function () { return Date.now(); };

    function load() {
      return store.get('timeline', []) || [];
    }
    function add(entry) {
      var list = load();
      list.unshift({
        id: 't_' + now() + '_' + Math.random().toString(36).slice(2, 6),
        type: entry.type,
        title: entry.title,
        detail: entry.detail || '',
        at: entry.at || now(),
      });
      if (list.length > MAX_ENTRIES) list.length = MAX_ENTRIES;
      store.set('timeline', list);
      bus.emit(E.TIMELINE_UPDATED, { count: list.length, latest: list[0] });
    }

    var unsubs = [
      bus.on(E.RECEIPT_CAPTURED, function () {
        add({ type: 'receipt', title: 'Receipt captured', detail: 'Processing…' });
      }),
      bus.on(E.EXPENSE_UPDATED, function (p) {
        if (p && p.reason === 'added' && p.expense) {
          add({
            type: 'expense',
            title: p.expense.merchant + ' · ' + p.expense.category,
            detail: '£' + Number(p.expense.amount || 0).toFixed(2),
          });
        }
      }),
      bus.on(E.MILEAGE_UPDATED, function (p) {
        if (p && p.latestTrip) {
          add({
            type: 'mileage',
            title: 'Business trip recorded',
            detail: Number(p.latestTrip.miles || 0).toFixed(1) + ' miles',
            at: p.latestTrip.at || now(),
          });
        }
      }),
    ];

    function getEntries(limit) {
      var list = load();
      return limit ? list.slice(0, limit) : list;
    }
    function getState() {
      return { count: load().length, latest: load()[0] || null };
    }

    return {
      getEntries: getEntries,
      getState: getState,
      destroy: function () { unsubs.forEach(function (u) { u(); }); },
    };
  }

  var api = { create: create };
  global.MPTimelineEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
