/**
 * MilePilot Business Hub — UI Facade (LOCKED ARCHITECTURE)
 *
 * The Business Home screen reads EVERYTHING through this facade, which delegates
 * to the Business Engine (event-driven). It performs NO business calculation —
 * that lives in the engines. It only maps engine snapshots to the shape the UI
 * renders, and exposes live subscription so the screen updates with no refresh.
 *
 * See docs/BUSINESS_ENGINE_ARCHITECTURE.md.
 */
(function (global) {
  'use strict';

  var engine = null;

  function init(deps) {
    engine = deps && deps.engine ? deps.engine : null;
  }

  function num(v) {
    return Number(v) || 0;
  }

  function getHealth() {
    if (engine && engine.engines && engine.engines.health) {
      return engine.engines.health.getState();
    }
    return { score: 0, label: "Let's get set up", tone: 'low', note: '', factors: [], missing: [], suggestions: [] };
  }

  function getSummary() {
    if (!engine) {
      return { monthMiles: 0, monthHmrc: 0, monthTrips: 0, ytdHmrc: 0, receipts: 0, expenses: 0, vatReclaimable: 0 };
    }
    var s = engine.getSnapshot();
    var receipts = engine.engines.receipt ? engine.engines.receipt.getState().total : 0;
    return {
      monthMiles: num(s.mileage.monthMiles),
      monthHmrc: num(s.mileage.monthHmrc),
      monthTrips: num(s.mileage.monthTrips),
      ytdHmrc: num(s.mileage.ytdHmrc),
      receipts: num(receipts),
      expenses: num(s.expenses.monthTotal),
      vatReclaimable: num(s.vat.monthReclaimable),
    };
  }

  function getModules() {
    var s = engine ? engine.getSnapshot() : null;
    var miles = s ? num(s.mileage.monthMiles) : 0;
    var expTotal = s ? num(s.expenses.monthTotal) : 0;
    var receipts = engine && engine.engines.receipt ? engine.engines.receipt.getState().total : 0;
    return [
      { id: 'mileage', icon: '🚗', title: 'Mileage', desc: miles > 0 ? miles.toFixed(1) + ' miles this month' : 'Track business journeys', status: 'active' },
      { id: 'receipts', icon: '🧾', title: 'Receipts', desc: receipts > 0 ? receipts + ' captured' : 'Scan receipts — auto-extract supplier, amount, VAT.', status: receipts > 0 ? 'active' : 'soon' },
      { id: 'expenses', icon: '💳', title: 'Expenses', desc: expTotal > 0 ? '£' + expTotal.toFixed(2) + ' this month' : 'Fuel, parking, tolls, tools and purchases.', status: expTotal > 0 ? 'active' : 'soon' },
      { id: 'vat', icon: '📊', title: 'VAT', desc: 'Estimated VAT paid and reclaimable totals.', status: 'soon' },
      { id: 'reports', icon: '📄', title: 'Reports', desc: 'HMRC-ready summaries, emailed after each shift.', status: 'active' },
      { id: 'accountant', icon: '📦', title: 'Accountant Pack', desc: 'Mileage, expenses, receipts and summaries in one export.', status: 'soon' },
      { id: 'aiBookkeeper', icon: '🤖', title: 'AI Bookkeeper', desc: 'Ask "how much did I spend on fuel last month?"', status: 'soon' },
      { id: 'health', icon: '💚', title: 'Business Health', desc: 'See how complete and organised your records are.', status: 'active' },
    ];
  }

  function subscribe(fn) {
    return engine ? engine.subscribe(fn) : function () {};
  }

  function ask(question) {
    return engine ? engine.ask(question) : '';
  }

  global.MPBusinessHub = {
    init: init,
    getHealth: getHealth,
    getSummary: getSummary,
    getModules: getModules,
    subscribe: subscribe,
    ask: ask,
  };
})(typeof window !== 'undefined' ? window : globalThis);
