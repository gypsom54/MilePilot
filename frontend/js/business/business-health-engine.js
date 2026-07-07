/**
 * MilePilot Business Engine — Business Health Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: a single explainable "how organised is this business"
 * model.  Organisation Score · Missing Items · Business Readiness · Suggestions
 *
 * Reacts to: MILEAGE_UPDATED, EXPENSE_UPDATED, VAT_UPDATED, RECEIPT_STATUS_CHANGED.
 * Emits: HEALTH_UPDATED. External truths (mileage on, reports set up, profile
 * complete) are injected as signal callbacks so this engine never reaches into
 * other engines or the UI.
 */
(function (global) {
  'use strict';

  var FACTORS = [
    { key: 'mileage', label: 'Mileage tracking on', weight: 25 },
    { key: 'tripsThisMonth', label: 'Trips recorded this month', weight: 20 },
    { key: 'reports', label: 'Reports set up', weight: 20 },
    { key: 'receipts', label: 'Receipts captured', weight: 15 },
    { key: 'expenses', label: 'Expenses logged', weight: 10 },
    { key: 'profile', label: 'Business profile complete', weight: 10 },
  ];

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var deps = ctx.deps || {};
    var signals = deps.signals || {};

    function sig(name, fallback) {
      return typeof signals[name] === 'function' ? !!signals[name]() : !!fallback;
    }

    function compute() {
      var satisfied = {
        mileage: sig('mileageOn'),
        tripsThisMonth: sig('tripsThisMonth'),
        reports: sig('reportsReady'),
        receipts: sig('receiptsCaptured'),
        expenses: sig('expensesLogged'),
        profile: sig('profileComplete'),
      };
      var score = 0;
      var missing = [];
      var factors = FACTORS.map(function (f) {
        var done = !!satisfied[f.key];
        if (done) score += f.weight;
        else missing.push({ key: f.key, label: f.label, weight: f.weight });
        return { key: f.key, label: f.label, weight: f.weight, done: done };
      });
      score = Math.max(0, Math.min(100, Math.round(score)));

      var label, tone, note;
      if (score >= 80) { label = 'Fully organised'; tone = 'strong'; note = 'Your business records are in great shape.'; }
      else if (score >= 55) { label = 'Well organised'; tone = 'strong'; note = 'You are on top of the essentials — a few steps left.'; }
      else if (score >= 30) { label = 'Getting organised'; tone = 'ok'; note = 'Good start. Add the next step to strengthen your records.'; }
      else { label = "Let's get set up"; tone = 'low'; note = 'A few quick steps will get your business organised.'; }

      // Highest-weight missing item becomes the primary suggestion.
      var suggestions = missing
        .sort(function (a, b) { return b.weight - a.weight; })
        .slice(0, 2)
        .map(function (m) { return suggestionFor(m.key); });

      var readiness = score >= 80 ? 'accountant_ready' : score >= 55 ? 'nearly_ready' : 'building';

      return {
        score: score,
        label: label,
        tone: tone,
        note: note,
        factors: factors,
        missing: missing,
        suggestions: suggestions,
        readiness: readiness,
        computedAt: Date.now(),
      };
    }

    function suggestionFor(key) {
      switch (key) {
        case 'mileage': return 'Turn on AutoPilot to capture every business mile.';
        case 'tripsThisMonth': return 'Record a business trip this month.';
        case 'reports': return 'Add your email so reports are delivered automatically.';
        case 'receipts': return 'Scan your first receipt to organise expenses.';
        case 'expenses': return 'Log a business expense to track your costs.';
        case 'profile': return 'Complete your business profile.';
        default: return 'Add the next step to strengthen your records.';
      }
    }

    function recompute() {
      var prev = store.get('health', null);
      var snap = compute();
      store.set('health', snap);
      var changed = !prev || prev.score !== snap.score;
      bus.emit(E.HEALTH_UPDATED, { health: snap, changed: changed, previousScore: prev ? prev.score : null });
      return snap;
    }

    var unsubs = [
      bus.on(E.MILEAGE_UPDATED, recompute),
      bus.on(E.EXPENSE_UPDATED, recompute),
      bus.on(E.VAT_UPDATED, recompute),
      bus.on(E.RECEIPT_STATUS_CHANGED, recompute),
    ];

    function getState() {
      return store.get('health', null) || compute();
    }

    return {
      recompute: recompute,
      getState: getState,
      destroy: function () { unsubs.forEach(function (u) { u(); }); },
    };
  }

  var api = { create: create, FACTORS: FACTORS };
  global.MPBusinessHealthEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
