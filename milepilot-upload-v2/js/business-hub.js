/**
 * MilePilot Business Hub Engine — PRD-001 Business Home.
 *
 * VITAL: This is the data engine for the Business Hub screen. The UI must NOT
 * compute business values itself — it reads everything from here. Receipts,
 * expenses and VAT are future pillars; today they resolve to zero states so the
 * screen is honest and grows as those engines come online.
 *
 * Business Health is a single, explainable score built from real signals so a
 * user immediately understands how organised their records are.
 */
(function (global) {
  'use strict';

  var deps = null;

  // Health factors — each contributes weight when satisfied. Weights sum to 100.
  var FACTORS = [
    { key: 'mileage', label: 'Mileage tracking on', weight: 25 },
    { key: 'tripsThisMonth', label: 'Trips recorded this month', weight: 20 },
    { key: 'reports', label: 'Reports set up', weight: 20 },
    { key: 'receipts', label: 'Receipts captured', weight: 15 },
    { key: 'expenses', label: 'Expenses logged', weight: 10 },
    { key: 'profile', label: 'Business profile complete', weight: 10 },
  ];

  function num(v) {
    return Number(v) || 0;
  }

  function init(dependencies) {
    deps = dependencies || {};
  }

  function getShifts() {
    if (deps && typeof deps.getShifts === 'function') return deps.getShifts() || [];
    return [];
  }

  function getTrips() {
    if (deps && typeof deps.getTrips === 'function') return deps.getTrips() || [];
    return [];
  }

  function hmrcFor(miles) {
    if (deps && typeof deps.hmrcEstimate === 'function') return num(deps.hmrcEstimate(miles));
    return num(miles) * 0.45;
  }

  function monthStart(now) {
    var d = now || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }

  function taxYearStart(now) {
    var ref = now || new Date();
    var y = ref.getFullYear();
    var april6 = new Date(y, 3, 6);
    return (ref >= april6 ? april6 : new Date(y - 1, 3, 6)).getTime();
  }

  function shiftsSince(ts) {
    return getShifts().filter(function (s) {
      var t = new Date(s.startISO || s.date || 0).getTime();
      return t >= ts;
    });
  }

  /** All business values for the current month + tax year. */
  function getSummary() {
    var mStart = monthStart();
    var yStart = taxYearStart();
    var monthList = shiftsSince(mStart);
    var yearList = shiftsSince(yStart);
    var monthMiles = monthList.reduce(function (a, s) {
      return a + num(s.miles);
    }, 0);
    var ytdMiles = yearList.reduce(function (a, s) {
      return a + num(s.miles);
    }, 0);
    return {
      monthMiles: monthMiles,
      monthHmrc: monthList.reduce(function (a, s) {
        return a + (s.hmrc != null ? num(s.hmrc) : hmrcFor(num(s.miles)));
      }, 0),
      monthTrips: monthList.length,
      ytdHmrc: yearList.reduce(function (a, s) {
        return a + (s.hmrc != null ? num(s.hmrc) : hmrcFor(num(s.miles)));
      }, 0),
      ytdMiles: ytdMiles,
      // Future pillars — resolve to zero until their engines exist.
      receipts: 0,
      expenses: 0,
      vatReclaimable: 0,
    };
  }

  function factorSatisfied(key, summary) {
    switch (key) {
      case 'mileage':
        return deps && typeof deps.isTrackingEnabled === 'function'
          ? !!deps.isTrackingEnabled()
          : getShifts().length > 0;
      case 'tripsThisMonth':
        return summary.monthTrips > 0;
      case 'reports':
        return deps && typeof deps.reportsReady === 'function' ? !!deps.reportsReady() : false;
      case 'receipts':
        return summary.receipts > 0;
      case 'expenses':
        return summary.expenses > 0;
      case 'profile':
        return deps && typeof deps.profileComplete === 'function' ? !!deps.profileComplete() : false;
      default:
        return false;
    }
  }

  /** Single explainable Business Health score. */
  function getHealth() {
    var summary = getSummary();
    var score = 0;
    var factors = FACTORS.map(function (f) {
      var done = factorSatisfied(f.key, summary);
      if (done) score += f.weight;
      return { key: f.key, label: f.label, done: done, weight: f.weight };
    });
    score = Math.max(0, Math.min(100, Math.round(score)));
    var label, tone, note;
    if (score >= 80) {
      label = 'Fully organised';
      tone = 'strong';
      note = 'Your business records are in great shape.';
    } else if (score >= 55) {
      label = 'Well organised';
      tone = 'strong';
      note = 'You are on top of the essentials — a few steps left.';
    } else if (score >= 30) {
      label = 'Getting organised';
      tone = 'ok';
      note = 'Good start. Add the next step to strengthen your records.';
    } else {
      label = "Let's get set up";
      tone = 'low';
      note = 'A few quick steps will get your business organised.';
    }
    return { score: score, label: label, tone: tone, note: note, factors: factors };
  }

  /** Business Hub modules and their live status. */
  function getModules() {
    var s = getSummary();
    return [
      {
        id: 'mileage',
        icon: '🚗',
        title: 'Mileage',
        desc: s.monthMiles > 0 ? s.monthMiles.toFixed(1) + ' miles this month' : 'Track business journeys',
        status: 'active',
      },
      {
        id: 'receipts',
        icon: '🧾',
        title: 'Receipts',
        desc: 'Scan receipts — auto-extract supplier, amount, VAT and category.',
        status: 'soon',
      },
      {
        id: 'expenses',
        icon: '💳',
        title: 'Expenses',
        desc: 'Fuel, parking, tolls, tools, vehicle costs and purchases.',
        status: 'soon',
      },
      {
        id: 'vat',
        icon: '📊',
        title: 'VAT',
        desc: 'Estimated VAT paid and reclaimable totals.',
        status: 'soon',
      },
      {
        id: 'reports',
        icon: '📄',
        title: 'Reports',
        desc: 'HMRC-ready mileage summaries, emailed after each shift.',
        status: 'active',
      },
      {
        id: 'accountant',
        icon: '📦',
        title: 'Accountant Pack',
        desc: 'Mileage, expenses, receipts and summaries in one clean export.',
        status: 'soon',
      },
      {
        id: 'aiBookkeeper',
        icon: '🤖',
        title: 'AI Bookkeeper',
        desc: 'Ask "how much did I spend on fuel last month?"',
        status: 'soon',
      },
      {
        id: 'health',
        icon: '💚',
        title: 'Business Health',
        desc: 'See how complete and organised your records are.',
        status: 'active',
      },
    ];
  }

  global.MPBusinessHub = {
    init: init,
    getSummary: getSummary,
    getHealth: getHealth,
    getModules: getModules,
  };
})(typeof window !== 'undefined' ? window : globalThis);
