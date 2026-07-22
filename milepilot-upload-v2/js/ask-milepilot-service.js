/**
 * MP-S5-001 — Ask MilePilot Core Engine (Mileage Foundation)
 * Service layer only — no UI, no AI, no external APIs.
 * Ask screen must communicate only through MPAskMilePilotService.
 */
(function (global) {
  'use strict';

  var INTENTS = {
    ClaimAmount: 'ClaimAmount',
    MileageSummary: 'MileageSummary',
    TodaysTrips: 'TodaysTrips',
    WeeklyTrips: 'WeeklyTrips',
    MonthlyTrips: 'MonthlyTrips',
    PendingTrips: 'PendingTrips',
    CompareMonths: 'CompareMonths',
    MileageReport: 'MileageReport',
    ExportReport: 'ExportReport',
    EmailAccountant: 'EmailAccountant',
    AutopilotStatus: 'AutopilotStatus',
    LastJourney: 'LastJourney',
    DroveYesterday: 'DroveYesterday',
    Unknown: 'Unknown',
  };

  var deps = null;
  var pendingAction = null;

  function defaultClaim(mi, vehicle) {
    if (global.MPTaxEngine) {
      var all = global.MPTaxEngine.collectBusinessJourneys(getTrips(), getShifts(), vehicle || getVehicle());
      return global.MPTaxEngine.claimMarginalPounds(mi, vehicle || getVehicle(), all, now());
    }
    return (Number(mi) || 0) * 0.55;
  }

  function defaultFmt(sec) {
    var s = Math.max(0, Math.round(Number(sec) || 0));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    if (h) return h + 'h ' + m + 'm';
    return m + 'm';
  }

  function money(n) {
    return '£' + (Number(n) || 0).toFixed(2);
  }

  function miles(n) {
    var v = Number(n) || 0;
    return (Math.round(v * 10) / 10).toString();
  }

  function now() {
    return typeof deps.getNow === 'function' ? deps.getNow() : new Date();
  }

  function getVehicle() {
    return (deps && deps.getVehicle && deps.getVehicle()) || 'car';
  }

  function getClaimFn() {
    return (deps && deps.claimFn) || defaultClaim;
  }

  function getTrips() {
    if (deps && typeof deps.getTrips === 'function') return deps.getTrips();
    if (global.MPTrips) return global.MPTrips.loadTrips(getVehicle(), getClaimFn());
    return [];
  }

  function getShifts() {
    if (deps && typeof deps.getShifts === 'function') return deps.getShifts();
    try {
      return JSON.parse(global.localStorage.getItem('mp_shifts') || '[]');
    } catch (e) {
      return [];
    }
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function dayRange(ref) {
    var start = startOfDay(ref);
    var end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start: start, end: end, label: 'today' };
  }

  function weekRangeContaining(ref) {
    var end = new Date(ref);
    end.setHours(23, 59, 59, 999);
    var start = new Date(end);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    var rangeEnd = new Date(start);
    rangeEnd.setDate(rangeEnd.getDate() + 7);
    return { start: start, end: rangeEnd };
  }

  function monthRangeContaining(ref) {
    var d = ref || new Date();
    return {
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1),
    };
  }

  function previousMonthRange(ref) {
    var d = ref || new Date();
    return {
      start: new Date(d.getFullYear(), d.getMonth() - 1, 1),
      end: new Date(d.getFullYear(), d.getMonth(), 1),
    };
  }

  function formatPeriodLabel(start, endExclusive) {
    if (global.MPCustomReport && global.MPCustomReport.formatPeriodLabel) {
      return global.MPCustomReport.formatPeriodLabel(start, endExclusive);
    }
    var endInclusive = new Date(endExclusive);
    endInclusive.setDate(endInclusive.getDate() - 1);
    return start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
      ' – ' +
      endInclusive.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function collectRange(start, end) {
    if (global.MPCustomReport && global.MPCustomReport.collectReportJourneys) {
      return global.MPCustomReport.collectReportJourneys({
        trips: getTrips(),
        shifts: getShifts(),
        start: start,
        end: end,
        claimFn: getClaimFn(),
        vehicle: getVehicle(),
      });
    }
    var trips = getTrips();
    var startMs = start.getTime();
    var endMs = end.getTime();
    var inRange = trips.filter(function (t) {
      var d = new Date(t.startISO).getTime();
      return d >= startMs && d < endMs;
    });
    var business = inRange.filter(function (t) {
      return t.status === 'business';
    });
    var pending = inRange.filter(function (t) {
      return t.status === 'pending';
    });
    return {
      included: business,
      mi: business.reduce(function (a, t) {
        return a + t.miles;
      }, 0),
      hmrc: business.reduce(function (a, t) {
        return a + t.hmrc;
      }, 0),
      pendingCount: pending.length,
      pendingList: pending,
      journeys: business.length,
    };
  }

  /* —— IntentRouter —— */
  var IntentRouter = {
    route: function (text) {
      var t = (text || '').trim().toLowerCase();
      if (!t) return { intent: INTENTS.Unknown, text: text };

      if (/email.*accountant|send.*accountant|accountant.*email/.test(t)) {
        return { intent: INTENTS.EmailAccountant, text: text };
      }
      if (/export.*report|download.*report/.test(t)) {
        return { intent: INTENTS.ExportReport, text: text };
      }
      if (/prepare.*report|mileage report|generate.*report/.test(t)) {
        return { intent: INTENTS.MileageReport, text: text };
      }
      if (/compare.*month|last month.*this month|month.*compare/.test(t)) {
        return { intent: INTENTS.CompareMonths, text: text };
      }
      if (/pending|need reviewing|still need review|awaiting review/.test(t)) {
        return { intent: INTENTS.PendingTrips, text: text };
      }
      if (/today.*(trip|journey)|show today|today's (trip|journey)/.test(t)) {
        return { intent: INTENTS.TodaysTrips, text: text };
      }
      if (/this week|weekly trip|week's trip/.test(t)) {
        return { intent: INTENTS.WeeklyTrips, text: text };
      }
      if (/this month.*(trip|journey)|month.*trip|month's trip/.test(t)) {
        return { intent: INTENTS.MonthlyTrips, text: text };
      }
      if (/how much.*claim|claim.*month|claimable|can i claim/.test(t)) {
        return { intent: INTENTS.ClaimAmount, text: text };
      }
      if (/how many mile|mileage|miles.*driven|driven.*mile/.test(t)) {
        return { intent: INTENTS.MileageSummary, text: text };
      }
      if (/how many trip|trips.*completed|completed.*trip/.test(t)) {
        return { intent: INTENTS.MonthlyTrips, text: text };
      }
      if (/autopilot.*enabled|is autopilot|autopilot.*on/.test(t)) {
        return { intent: INTENTS.AutopilotStatus, text: text };
      }
      if (/last journey|when was my last|most recent journey/.test(t)) {
        return { intent: INTENTS.LastJourney, text: text };
      }
      if (/drive yesterday|drove yesterday|yesterday.*drive/.test(t)) {
        return { intent: INTENTS.DroveYesterday, text: text };
      }

      return { intent: INTENTS.Unknown, text: text };
    },
    INTENTS: INTENTS,
  };

  /* —— MileageQueryService —— */
  var MileageQueryService = {
    claimThisMonth: function () {
      var vehicle = getVehicle();
      if (global.MPTaxEngine) {
        var all = global.MPTaxEngine.collectBusinessJourneys(getTrips(), getShifts(), vehicle);
        var summary = global.MPTaxEngine.calculateTaxYearClaims({
          journeys: all,
          defaultVehicle: vehicle,
          vehicleType: vehicle,
          asOfDate: now(),
        });
        if (summary.valid) {
          return {
            intent: INTENTS.ClaimAmount,
            period: 'taxYear',
            periodLabel: summary.taxYear,
            miles: summary.eligibleMiles,
            hmrc: summary.totalClaim,
            trips: summary.journeyCount,
            pending: getTrips().filter(function (t) {
              return t.status === 'pending';
            }).length,
            taxSummary: summary,
          };
        }
      }
      var range = monthRangeContaining(now());
      var data = collectRange(range.start, range.end);
      return {
        intent: INTENTS.ClaimAmount,
        period: 'month',
        periodLabel: range.start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        miles: data.mi,
        hmrc: data.hmrc,
        trips: data.included ? data.included.length : data.journeys || 0,
        pending: data.pendingCount || 0,
      };
    },
    mileageSummary: function (period) {
      var range = period === 'week' ? weekRangeContaining(now()) : monthRangeContaining(now());
      var data = collectRange(range.start, range.end);
      return {
        intent: INTENTS.MileageSummary,
        period: period || 'month',
        periodLabel: formatPeriodLabel(range.start, range.end),
        miles: data.mi,
        hmrc: data.hmrc,
        trips: data.included ? data.included.length : data.journeys || 0,
        pending: data.pendingCount || 0,
      };
    },
    compareMonths: function () {
      var cur = monthRangeContaining(now());
      var prev = previousMonthRange(now());
      var current = collectRange(cur.start, cur.end);
      var previous = collectRange(prev.start, prev.end);
      return {
        intent: INTENTS.CompareMonths,
        current: { miles: current.mi, hmrc: current.hmrc, trips: current.included ? current.included.length : 0 },
        previous: { miles: previous.mi, hmrc: previous.hmrc, trips: previous.included ? previous.included.length : 0 },
        currentLabel: cur.start.toLocaleDateString('en-GB', { month: 'long' }),
        previousLabel: prev.start.toLocaleDateString('en-GB', { month: 'long' }),
      };
    },
  };

  /* —— JourneyQueryService —— */
  var JourneyQueryService = {
    tripsForRange: function (range) {
      var data = collectRange(range.start, range.end);
      var allTrips = getTrips();
      var startMs = range.start.getTime();
      var endMs = range.end.getTime();
      var inRange = allTrips.filter(function (t) {
        var d = new Date(t.startISO).getTime();
        return d >= startMs && d < endMs;
      });
      return {
        business: data.included || [],
        pending: data.pendingList || inRange.filter(function (t) {
          return t.status === 'pending';
        }),
        all: inRange,
        miles: data.mi,
        hmrc: data.hmrc,
        periodLabel: formatPeriodLabel(range.start, range.end),
      };
    },
    todaysTrips: function () {
      var range = dayRange(now());
      return Object.assign({ intent: INTENTS.TodaysTrips }, this.tripsForRange(range));
    },
    weeklyTrips: function () {
      var range = weekRangeContaining(now());
      return Object.assign({ intent: INTENTS.WeeklyTrips }, this.tripsForRange(range));
    },
    monthlyTrips: function () {
      var range = monthRangeContaining(now());
      return Object.assign({ intent: INTENTS.MonthlyTrips }, this.tripsForRange(range));
    },
    pendingTrips: function () {
      var trips = getTrips();
      var pending = global.MPTrips ? global.MPTrips.getPendingTrips(trips) : trips.filter(function (t) {
        return t.status === 'pending';
      });
      return {
        intent: INTENTS.PendingTrips,
        pending: pending,
        count: pending.length,
      };
    },
    lastJourney: function () {
      var trips = getTrips().slice().sort(function (a, b) {
        return new Date(b.startISO) - new Date(a.startISO);
      });
      var shifts = getShifts().slice().sort(function (a, b) {
        return new Date(b.startISO) - new Date(a.startISO);
      });
      var lastTrip = trips[0] || null;
      var lastShift = shifts[0] || null;
      var last = null;
      if (lastTrip && lastShift) {
        last = new Date(lastTrip.startISO) >= new Date(lastShift.startISO) ? lastTrip : lastShift;
      } else {
        last = lastTrip || lastShift;
      }
      return { intent: INTENTS.LastJourney, journey: last };
    },
    droveYesterday: function () {
      var ref = now();
      var yesterday = new Date(ref);
      yesterday.setDate(yesterday.getDate() - 1);
      var range = dayRange(yesterday);
      var data = this.tripsForRange(range);
      return {
        intent: INTENTS.DroveYesterday,
        drove: data.all.length > 0,
        businessCount: data.business.length,
        totalCount: data.all.length,
        miles: data.miles,
      };
    },
  };

  /* —— ReportQueryService —— */
  var ReportQueryService = {
    buildReportDeps: function () {
      return {
        getEmail: deps && deps.getEmail ? deps.getEmail : function () {
          try {
            return global.localStorage.getItem('mp_email') || '';
          } catch (e) {
            return '';
          }
        },
        getDriver: deps && deps.getDriver ? deps.getDriver : function () {
          try {
            return global.localStorage.getItem('mp_driver') || '';
          } catch (e) {
            return '';
          }
        },
        getTrips: getTrips,
        getShifts: getShifts,
        fmt: (deps && deps.fmt) || defaultFmt,
        getHmrcRate: function () {
          if (deps && deps.getHmrcRate) return deps.getHmrcRate();
          if (global.MPTaxEngine) {
            var ty = global.MPTaxEngine.getUkTaxYear(now());
            return global.MPTaxEngine.displayRateForVehicle(ty.id, getVehicle());
          }
          return 0.55;
        },
      };
    },
    prepareMonthlyReport: function () {
      var range = monthRangeContaining(now());
      var data = collectRange(range.start, range.end);
      var reportDeps = this.buildReportDeps();
      var payload = null;
      if (global.MPSummaryReports && global.MPSummaryReports.buildPayload) {
        global.MPSummaryReports.init(reportDeps);
        payload = global.MPSummaryReports.buildPayload('Monthly', now());
      } else if (global.MPCustomReport && global.MPCustomReport.buildPayload) {
        payload = global.MPCustomReport.buildPayload({
          shifts: getShifts(),
          trips: getTrips(),
          range: { start: range.start, end: range.end, label: formatPeriodLabel(range.start, range.end) },
          driver: reportDeps.getDriver(),
          fmt: reportDeps.fmt,
          claimFn: getClaimFn(),
          vehicle: getVehicle(),
          hmrcRate: reportDeps.getHmrcRate(),
        });
      }
      return {
        intent: INTENTS.MileageReport,
        action: 'prepare',
        periodLabel: range.start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        trips: data.included ? data.included.length : 0,
        hmrc: data.hmrc,
        miles: data.mi,
        payload: payload,
      };
    },
    prepareWeeklyReport: function () {
      var range = weekRangeContaining(now());
      var data = collectRange(range.start, range.end);
      var reportDeps = this.buildReportDeps();
      var payload = null;
      if (global.MPSummaryReports && global.MPSummaryReports.buildPayload) {
        global.MPSummaryReports.init(reportDeps);
        payload = global.MPSummaryReports.buildPayload('Weekly', now());
      }
      return {
        intent: INTENTS.MileageReport,
        action: 'prepare',
        periodLabel: formatPeriodLabel(range.start, range.end),
        trips: data.included ? data.included.length : 0,
        hmrc: data.hmrc,
        miles: data.mi,
        payload: payload,
      };
    },
    emailAccountantPreview: function () {
      var report = this.prepareMonthlyReport();
      report.intent = INTENTS.EmailAccountant;
      report.action = 'email';
      var reportDeps = this.buildReportDeps();
      report.recipient = (report.payload && report.payload.email) || reportDeps.getEmail();
      report.reportLabel = 'Monthly mileage report';
      return report;
    },
    exportReportPreview: function () {
      var report = this.prepareMonthlyReport();
      report.intent = INTENTS.ExportReport;
      report.action = 'export';
      report.reportLabel = 'Monthly mileage report';
      return report;
    },
    autopilotStatus: function () {
      var mode = 'autopilot';
      var motionEnabled = false;
      var state = 'OFF';
      if (global.MPTrackingMode) {
        mode = global.MPTrackingMode.getMode() || 'autopilot';
      }
      if (global.MPAutoPilotMotion) {
        motionEnabled = global.MPAutoPilotMotion.isMotionEnabled && global.MPAutoPilotMotion.isMotionEnabled();
        var dbg = global.MPAutoPilotMotion.getDebugState && global.MPAutoPilotMotion.getDebugState();
        state = dbg && dbg.state ? dbg.state : state;
      }
      try {
        if (!motionEnabled) {
          motionEnabled = global.localStorage.getItem('mp_autopilot_motion_enabled') === 'true';
        }
      } catch (e) {}
      return {
        intent: INTENTS.AutopilotStatus,
        mode: mode,
        motionEnabled: motionEnabled,
        state: state,
        isAutoPilot: mode !== 'manual',
      };
    },
  };

  /* —— ResponseFormatter —— */
  var ResponseFormatter = {
    format: function (data) {
      if (!data || !data.intent) return this.unknown();
      switch (data.intent) {
        case INTENTS.ClaimAmount:
          return this.claimAmount(data);
        case INTENTS.MileageSummary:
          return this.mileageSummary(data);
        case INTENTS.TodaysTrips:
          return this.journeyList(data, 'today');
        case INTENTS.WeeklyTrips:
          return this.journeyList(data, 'this week');
        case INTENTS.MonthlyTrips:
          return this.journeyList(data, 'this month');
        case INTENTS.PendingTrips:
          return this.pendingTrips(data);
        case INTENTS.CompareMonths:
          return this.compareMonths(data);
        case INTENTS.MileageReport:
        case INTENTS.ExportReport:
        case INTENTS.EmailAccountant:
          return this.confirmAction(data);
        case INTENTS.AutopilotStatus:
          return this.autopilotStatus(data);
        case INTENTS.LastJourney:
          return this.lastJourney(data);
        case INTENTS.DroveYesterday:
          return this.droveYesterday(data);
        default:
          return this.unknown();
      }
    },
    claimAmount: function (data) {
      if (!data.trips && !data.miles) {
        return {
          view: 'simple',
          hero: money(0),
          detail: "You haven't recorded any business journeys this month yet.",
          followups: ['Show today\'s journeys', 'Is AutoPilot enabled?'],
        };
      }
      var detail =
        data.taxSummary && global.MPTaxEngine
          ? global.MPTaxEngine.explainTaxYearSummary(data.taxSummary)
          : 'You claimed <strong>' +
            money(data.hmrc) +
            '</strong> from <strong>' +
            miles(data.miles) +
            ' business miles</strong> across <strong>' +
            data.trips +
            ' ' +
            (data.trips === 1 ? 'trip' : 'trips') +
            '</strong> in ' +
            data.periodLabel +
            '.';
      return {
        view: 'simple',
        hero: money(data.hmrc),
        detail: detail,
        followups: ['Show the trip breakdown', 'Compare with last month', 'Prepare my mileage report'],
      };
    },
    mileageSummary: function (data) {
      if (!data.miles) {
        return {
          view: 'text',
          message: "I couldn't find any business mileage for " + (data.periodLabel || 'this period') + '.',
          followups: ['Show today\'s journeys', 'Is AutoPilot enabled?'],
        };
      }
      return {
        view: 'simple',
        hero: miles(data.miles) + ' mi',
        detail:
          "You've driven <strong>" +
          miles(data.miles) +
          ' business miles</strong> across <strong>' +
          data.trips +
          ' journeys</strong>. Your estimated HMRC mileage claim is <strong>' +
          money(data.hmrc) +
          '</strong>.',
        followups: ['Show this month\'s trips', 'Which trips need reviewing?', 'Prepare my mileage report'],
      };
    },
    journeyList: function (data, periodWord) {
      var list = data.business || [];
      if (!list.length) {
        return {
          view: 'text',
          message: "I couldn't find any business journeys for " + periodWord + '.',
          followups: ['Is AutoPilot enabled?', 'When was my last journey?'],
        };
      }
      var rows = list.slice(0, 8).map(function (t) {
        return {
          date: new Date(t.startISO).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
          miles: miles(t.miles),
          claim: money(t.hmrc),
        };
      });
      var note = '';
      if (data.pending && data.pending.length) {
        note =
          data.pending.length +
          ' trip' +
          (data.pending.length === 1 ? ' is' : 's are') +
          ' pending classification. Review them to finalise your claim.';
      }
      return {
        view: 'detailed',
        summary: 'Your ' + periodWord + ' mileage at a glance.',
        metrics: {
          miles: miles(data.miles),
          trips: String(list.length),
          claim: money(data.hmrc),
          pending: String((data.pending && data.pending.length) || 0),
        },
        rows: rows,
        note: note,
        followups: ['Which trips need reviewing?', 'Export this report', 'Email this to my accountant'],
      };
    },
    pendingTrips: function (data) {
      if (!data.count) {
        return {
          view: 'text',
          message: "You're all caught up — no trips are waiting for review.",
          followups: ['How much can I claim this month?', 'Show this week\'s trips'],
        };
      }
      var rows = data.pending.slice(0, 8).map(function (t) {
        return {
          date: new Date(t.startISO).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
          miles: miles(t.miles),
          claim: '—',
        };
      });
      return {
        view: 'detailed',
        summary: data.count + ' ' + (data.count === 1 ? 'trip needs' : 'trips need') + ' your review.',
        metrics: {
          miles: miles(
            data.pending.reduce(function (a, t) {
              return a + t.miles;
            }, 0)
          ),
          trips: String(data.count),
          claim: '—',
          pending: String(data.count),
        },
        rows: rows,
        note: 'Classify these journeys as business or personal to include them in your claim.',
        followups: ['Show this month\'s trips', 'How much can I claim this month?'],
      };
    },
    compareMonths: function (data) {
      var cur = data.current;
      var prev = data.previous;
      var diff = cur.hmrc - prev.hmrc;
      var pct = prev.hmrc ? Math.round(((cur.hmrc - prev.hmrc) / prev.hmrc) * 100) : 0;
      var trend =
        diff > 0
          ? 'Claims are ' + Math.abs(pct) + '% higher than ' + data.previousLabel + '.'
          : diff < 0
            ? 'Claims are ' + Math.abs(pct) + '% lower than ' + data.previousLabel + '.'
            : 'Claims are unchanged from ' + data.previousLabel + '.';
      return {
        view: 'text',
        message:
          data.currentLabel +
          ': ' +
          miles(cur.miles) +
          ' mi · ' +
          money(cur.hmrc) +
          '. ' +
          data.previousLabel +
          ': ' +
          miles(prev.miles) +
          ' mi · ' +
          money(prev.hmrc) +
          '. ' +
          trend,
        followups: ['Show this month\'s trips', 'Prepare my mileage report'],
      };
    },
    confirmAction: function (data) {
      pendingAction = data;
      return {
        view: 'confirm',
        action: data.action,
        recipient: data.recipient || data.payload && data.payload.email || 'your email on file',
        reportLabel: data.reportLabel || 'Mileage report',
        periodLabel: data.periodLabel || '',
        contents:
          (data.trips || 0) +
          ' trips · ' +
          money(data.hmrc) +
          ' claimable',
        followups: [],
      };
    },
    autopilotStatus: function (data) {
      var label = data.isAutoPilot ? 'enabled' : 'off';
      var detail = data.isAutoPilot
        ? 'AutoPilot is ' + label + (data.motionEnabled ? ' with motion detection active.' : '.')
        : 'Manual tracking mode is active — you start and end journeys yourself.';
      return {
        view: 'text',
        message: detail,
        followups: ['When was my last journey?', 'Show today\'s journeys'],
      };
    },
    lastJourney: function (data) {
      if (!data.journey) {
        return {
          view: 'text',
          message: "I couldn't find any recorded journeys yet.",
          followups: ['Is AutoPilot enabled?', 'Show today\'s journeys'],
        };
      }
      var j = data.journey;
      var when = new Date(j.startISO || j.endISO).toLocaleString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        view: 'text',
        message:
          'Your last journey was on ' +
          when +
          ' — ' +
          miles(j.miles) +
          ' miles' +
          (j.status ? ' (' + j.status + ').' : '.'),
        followups: ['Show today\'s journeys', 'How much can I claim this month?'],
      };
    },
    droveYesterday: function (data) {
      if (!data.drove) {
        return {
          view: 'text',
          message: "I couldn't find any journeys recorded for yesterday.",
          followups: ['When was my last journey?', 'Is AutoPilot enabled?'],
        };
      }
      return {
        view: 'text',
        message:
          'Yes — you recorded ' +
          data.totalCount +
          ' ' +
          (data.totalCount === 1 ? 'journey' : 'journeys') +
          ' yesterday (' +
          data.businessCount +
          ' business, ' +
          miles(data.miles) +
          ' business miles).',
        followups: ['Show this week\'s trips', 'How much can I claim this month?'],
      };
    },
    unknown: function () {
      return {
        view: 'text',
        message:
          "I can help with mileage claims, trips, reports, and AutoPilot status. Try asking how much you can claim this month.",
        followups: [
          'How much can I claim this month?',
          'Show today\'s journeys',
          'Which trips need reviewing?',
        ],
      };
    },
    complete: function (action, result) {
      if (action === 'email') {
        return {
          view: 'text',
          message: result.ok
            ? 'Your mileage report has been sent.'
            : "I couldn't send the report right now. Please try again from Reports.",
          followups: ['Show this month\'s trips', 'How much can I claim this month?'],
        };
      }
      if (action === 'export') {
        return {
          view: 'text',
          message: result.ok
            ? 'Your report is ready to download.'
            : "I couldn't export the report right now. Please try again from Reports.",
          followups: ['Prepare my mileage report'],
        };
      }
      return {
        view: 'text',
        message: result.ok ? 'Your mileage report is prepared.' : "I couldn't prepare the report right now.",
        followups: ['Email my accountant', 'Export my report'],
      };
    },
  };

  /* —— ActionExecutor —— */
  var ActionExecutor = {
    getPending: function () {
      return pendingAction;
    },
    clearPending: function () {
      pendingAction = null;
    },
    execute: async function (actionType) {
      var action = pendingAction;
      if (!action || !action.payload) {
        return { ok: false, error: 'No report prepared.' };
      }
      try {
        if (actionType === 'email' || action.action === 'email') {
          if (deps && typeof deps.apiPost === 'function') {
            await deps.apiPost('/reports/send', action.payload);
            return { ok: true, type: 'email' };
          }
          return { ok: false, error: 'Email delivery is not available in preview mode.' };
        }
        if (actionType === 'export' || action.action === 'export') {
          if (deps && typeof deps.apiPost === 'function') {
            var res = await deps.apiPost('/reports/pdf', action.payload);
            if (res && res.blob) {
              return { ok: true, type: 'export', blob: res.blob };
            }
          }
          return { ok: false, error: 'Export is not available in preview mode.' };
        }
        if (actionType === 'prepare' || action.action === 'prepare') {
          return { ok: true, type: 'prepare', payload: action.payload };
        }
        return { ok: false, error: 'Unknown action.' };
      } catch (e) {
        return { ok: false, error: 'Action failed.' };
      }
    },
    cancel: function () {
      this.clearPending();
      return { ok: true, cancelled: true };
    },
  };

  /* —— AskMilePilotService —— */
  function init(options) {
    deps = options || {};
    pendingAction = null;
  }

  function handleQuestion(text) {
    var routed = IntentRouter.route(text);
    var data;
    switch (routed.intent) {
      case INTENTS.ClaimAmount:
        data = MileageQueryService.claimThisMonth();
        break;
      case INTENTS.MileageSummary:
        data = MileageQueryService.mileageSummary('month');
        break;
      case INTENTS.TodaysTrips:
        data = JourneyQueryService.todaysTrips();
        break;
      case INTENTS.WeeklyTrips:
        data = JourneyQueryService.weeklyTrips();
        break;
      case INTENTS.MonthlyTrips:
        data = JourneyQueryService.monthlyTrips();
        break;
      case INTENTS.PendingTrips:
        data = JourneyQueryService.pendingTrips();
        break;
      case INTENTS.CompareMonths:
        data = MileageQueryService.compareMonths();
        break;
      case INTENTS.MileageReport:
        data = ReportQueryService.prepareMonthlyReport();
        break;
      case INTENTS.ExportReport:
        data = ReportQueryService.exportReportPreview();
        break;
      case INTENTS.EmailAccountant:
        data = ReportQueryService.emailAccountantPreview();
        break;
      case INTENTS.AutopilotStatus:
        data = ReportQueryService.autopilotStatus();
        break;
      case INTENTS.LastJourney:
        data = JourneyQueryService.lastJourney();
        break;
      case INTENTS.DroveYesterday:
        data = JourneyQueryService.droveYesterday();
        break;
      default:
        return Promise.resolve(ResponseFormatter.unknown());
    }
    return Promise.resolve(ResponseFormatter.format(data));
  }

  async function confirmAction(actionType) {
    var result = await ActionExecutor.execute(actionType);
    ActionExecutor.clearPending();
    return ResponseFormatter.complete(actionType || result.type, result);
  }

  function cancelAction() {
    ActionExecutor.cancel();
    return ResponseFormatter.format({ intent: INTENTS.Unknown });
  }

  global.MPAskMilePilotService = {
    init: init,
    handleQuestion: handleQuestion,
    confirmAction: confirmAction,
    cancelAction: cancelAction,
    IntentRouter: IntentRouter,
    MileageQueryService: MileageQueryService,
    JourneyQueryService: JourneyQueryService,
    ReportQueryService: ReportQueryService,
    ResponseFormatter: ResponseFormatter,
    ActionExecutor: ActionExecutor,
    INTENTS: INTENTS,
    _test: {
      dayRange: dayRange,
      weekRangeContaining: weekRangeContaining,
      monthRangeContaining: monthRangeContaining,
      collectRange: collectRange,
      setDeps: function (d) {
        deps = d;
      },
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
