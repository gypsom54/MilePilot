/**
 * MilePilot Business Engine — AI Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: INTERPRET information.
 *   Natural Language · Suggestions · Business Insights · Learning · Recommendations
 *
 * Reacts to (learns from): EXPENSE_UPDATED, VAT_UPDATED, HEALTH_UPDATED,
 * MILEAGE_UPDATED, RECEIPT_STATUS_CHANGED. Emits: AI_LEARNED.
 *
 * The reasoning backend is injected (ctx.deps.responder) so a real LLM plugs in
 * later. The default responder answers common questions deterministically from
 * the injected data providers — never fabricating figures.
 */
(function (global) {
  'use strict';

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var deps = ctx.deps || {};
    var providers = deps.providers || {};
    var responder = typeof deps.responder === 'function' ? deps.responder : defaultResponder;

    function bump(signal) {
      var model = store.get('model', { events: {}, updatedAt: 0 }) || { events: {}, updatedAt: 0 };
      model.events[signal] = (model.events[signal] || 0) + 1;
      model.updatedAt = Date.now();
      store.set('model', model);
      bus.emit(E.AI_LEARNED, { signal: signal, count: model.events[signal] });
    }

    var unsubs = [
      bus.on(E.EXPENSE_UPDATED, function () { bump('expense'); }),
      bus.on(E.VAT_UPDATED, function () { bump('vat'); }),
      bus.on(E.HEALTH_UPDATED, function () { bump('health'); }),
      bus.on(E.MILEAGE_UPDATED, function () { bump('mileage'); }),
      bus.on(E.RECEIPT_STATUS_CHANGED, function () { bump('receipt'); }),
    ];

    function money(n) {
      return '£' + (Number(n) || 0).toFixed(2);
    }

    function defaultResponder(question, data) {
      var q = (question || '').toLowerCase();
      var ex = data.expenses || {};
      var vat = data.vat || {};
      var mile = data.mileage || {};
      if (/fuel/.test(q)) {
        var fuel = (ex.byCategory && ex.byCategory.fuel) || 0;
        return 'You have logged ' + money(fuel) + ' on fuel this month.';
      }
      if (/vat/.test(q)) {
        return 'Your estimated reclaimable VAT is ' + money(vat.monthReclaimable) + ' this month (' + money(vat.quarterReclaimable) + ' this quarter).';
      }
      if (/mile|mileage|drive|drove/.test(q)) {
        return 'You have driven ' + (Number(mile.monthMiles) || 0).toFixed(1) + ' business miles this month (' + money(mile.monthHmrc) + ' estimated allowance).';
      }
      if (/expense|spend|spent|cost/.test(q)) {
        return 'Your total business expenses this month are ' + money(ex.monthTotal) + ' across ' + (ex.monthCount || 0) + ' item(s).';
      }
      return "I can answer questions about your mileage, expenses, fuel and VAT. Try: \"How much did I spend on fuel this month?\"";
    }

    function snapshotData() {
      return {
        expenses: typeof providers.getExpenseState === 'function' ? providers.getExpenseState() : {},
        vat: typeof providers.getVatState === 'function' ? providers.getVatState() : {},
        mileage: typeof providers.getMileage === 'function' ? providers.getMileage() : {},
        health: typeof providers.getHealth === 'function' ? providers.getHealth() : {},
      };
    }

    /** Public: natural-language query. */
    function ask(question) {
      return responder(question, snapshotData());
    }

    /** Public: proactive insights/recommendations derived from current data. */
    function getInsights() {
      var data = snapshotData();
      var out = [];
      var health = data.health || {};
      if (health.suggestions && health.suggestions.length) {
        out.push({ kind: 'suggestion', text: health.suggestions[0] });
      }
      var vat = data.vat || {};
      if ((vat.quarterReclaimable || 0) > 0) {
        out.push({ kind: 'insight', text: 'You may be able to reclaim ' + money(vat.quarterReclaimable) + ' VAT this quarter.' });
      }
      var ex = data.expenses || {};
      if ((ex.monthTotal || 0) > 0) {
        out.push({ kind: 'insight', text: money(ex.monthTotal) + ' business expenses logged this month.' });
      }
      return out;
    }

    function getModel() {
      return store.get('model', { events: {}, updatedAt: 0 });
    }

    return {
      ask: ask,
      getInsights: getInsights,
      getModel: getModel,
      destroy: function () { unsubs.forEach(function (u) { u(); }); },
    };
  }

  var api = { create: create };
  global.MPAiEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
