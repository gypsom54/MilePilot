/**
 * MilePilot Report Archive — local report history + synthetic period reports.
 */
(function (global) {
  "use strict";

  const STORAGE = "mp_report_archive";
  const DISMISSED = "mp_report_archive_dismissed";
  const MAX_ENTRIES = 120;

  function loadRaw() {
    try {
      return JSON.parse(global.localStorage.getItem(STORAGE) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveRaw(list) {
    try {
      global.localStorage.setItem(STORAGE, JSON.stringify(list.slice(0, MAX_ENTRIES)));
    } catch (e) {}
  }

  function loadDismissed() {
    try {
      return JSON.parse(global.localStorage.getItem(DISMISSED) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveDismissed(ids) {
    try {
      global.localStorage.setItem(DISMISSED, JSON.stringify(ids.slice(0, 200)));
    } catch (e) {}
  }

  function filterCategory(kind) {
    if (kind === "weekly" || kind === "weekly_summary") return "weekly";
    if (kind === "monthly" || kind === "monthly_summary") return "monthly";
    return "daily";
  }

  function dayStart(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function journeysInRange(list, start, end) {
    const s = start.getTime();
    const e = end.getTime();
    return list.filter(function (j) {
      const t = new Date(j.startISO).getTime();
      return t >= s && t < e;
    });
  }

  function sumList(list) {
    return {
      miles: list.reduce(function (a, b) {
        return a + Number(b.miles || 0);
      }, 0),
      sec: list.reduce(function (a, b) {
        return a + Number(b.seconds || 0);
      }, 0),
      hmrc: list.reduce(function (a, b) {
        return a + Number(b.hmrc || 0);
      }, 0),
      journeys: list.length,
      list: list,
    };
  }

  function collectJourneys(deps) {
    const trips = typeof deps.getTrips === "function" ? deps.getTrips() : [];
    const business = trips.filter(function (t) {
      return t.status === "business";
    });
    if (business.length) {
      return business.map(function (t) {
        return {
          miles: t.miles,
          seconds: t.seconds,
          hmrc: t.hmrc,
          vehicle: t.vehicle,
          startISO: t.startISO,
          endISO: t.endISO,
          route: t.route || t.routePoints || [],
        };
      });
    }
    return typeof deps.getShifts === "function" ? deps.getShifts().slice() : [];
  }

  function buildPayload(deps, period, periodLabel, list, prev) {
    const totals = sumList(list);
    return {
      email: deps.getEmail ? deps.getEmail() : "",
      driver: deps.getDriver ? deps.getDriver() : "",
      period: period,
      periodLabel: periodLabel || null,
      totals: {
        miles: totals.miles,
        time: deps.fmt(totals.sec),
        hmrc: totals.hmrc,
      },
      previousPeriod: prev || { miles: 0, seconds: 0, hmrc: 0, journeys: 0 },
      previousWeek: prev || { miles: 0, seconds: 0, hmrc: 0, journeys: 0 },
      shifts: list,
      weekShifts: list,
      hmrcRate: deps.getHmrcRate ? deps.getHmrcRate() : 0.55,
    };
  }

  function syntheticEntry(id, kind, title, subtitle, createdAt, totals, payload, canDelete) {
    return {
      id: id,
      kind: kind,
      category: filterCategory(kind),
      title: title,
      subtitle: subtitle,
      createdAt: createdAt,
      miles: totals.miles,
      hmrc: totals.hmrc,
      journeys: totals.journeys,
      payload: payload,
      synthetic: true,
      canDelete: !!canDelete,
    };
  }

  function buildSyntheticEntries(deps) {
    const dismissed = loadDismissed();
    const list = collectJourneys(deps);
    const now = new Date();
    const entries = [];

    const todayStart = dayStart(now);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayList = journeysInRange(list, todayStart, tomorrow);
    const todayTotals = sumList(todayList);
    if (todayTotals.journeys && dismissed.indexOf("syn_today") < 0) {
      entries.push(
        syntheticEntry(
          "syn_today",
          "daily",
          "Today's Report",
          todayTotals.miles.toFixed(1) + " mi · " + todayTotals.journeys + " journeys",
          now.toISOString(),
          todayTotals,
          buildPayload(deps, "Daily", null, todayList, null),
          false
        )
      );
    }

    const yStart = new Date(todayStart);
    yStart.setDate(yStart.getDate() - 1);
    const yList = journeysInRange(list, yStart, todayStart);
    const yTotals = sumList(yList);
    if (yTotals.journeys && dismissed.indexOf("syn_yesterday") < 0) {
      entries.push(
        syntheticEntry(
          "syn_yesterday",
          "daily",
          "Yesterday",
          yTotals.miles.toFixed(1) + " mi · " + yTotals.journeys + " journeys",
          yStart.toISOString(),
          yTotals,
          buildPayload(deps, "Daily", yStart.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }), yList, null),
          false
        )
      );
    }

    const weekStart = dayStart(now);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekList = journeysInRange(list, weekStart, weekEnd);
    const weekTotals = sumList(weekList);
    if (weekTotals.journeys && dismissed.indexOf("syn_this_week") < 0) {
      entries.push(
        syntheticEntry(
          "syn_this_week",
          "weekly",
          "This Week",
          weekTotals.miles.toFixed(1) + " mi · " + weekTotals.journeys + " journeys",
          weekEnd.toISOString(),
          weekTotals,
          buildPayload(deps, "Weekly", null, weekList, null),
          false
        )
      );
    }

    const lastWeekEnd = new Date(weekStart);
    const lastWeekStart = new Date(lastWeekEnd);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lwList = journeysInRange(list, lastWeekStart, lastWeekEnd);
    const lwTotals = sumList(lwList);
    if (lwTotals.journeys && dismissed.indexOf("syn_last_week") < 0) {
      const label = "Week ending " + new Date(lastWeekEnd.getTime() - 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      entries.push(
        syntheticEntry(
          "syn_last_week",
          "weekly_summary",
          "Last Week Summary",
          lwTotals.miles.toFixed(1) + " mi · " + money(deps, lwTotals.hmrc),
          lastWeekEnd.toISOString(),
          lwTotals,
          buildPayload(deps, "WeeklySummary", label, lwList, null),
          false
        )
      );
    }

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthList = journeysInRange(list, monthStart, monthEnd);
    const monthTotals = sumList(monthList);
    if (monthTotals.journeys && dismissed.indexOf("syn_this_month") < 0) {
      entries.push(
        syntheticEntry(
          "syn_this_month",
          "monthly",
          "This Month",
          monthTotals.miles.toFixed(1) + " mi · " + monthTotals.journeys + " journeys",
          monthEnd.toISOString(),
          monthTotals,
          buildPayload(deps, "Monthly", monthStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" }), monthList, null),
          false
        )
      );
    }

    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    const pmList = journeysInRange(list, prevMonthStart, prevMonthEnd);
    const pmTotals = sumList(pmList);
    if (pmTotals.journeys && dismissed.indexOf("syn_last_month") < 0) {
      entries.push(
        syntheticEntry(
          "syn_last_month",
          "monthly_summary",
          prevMonthStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
          pmTotals.miles.toFixed(1) + " mi · " + money(deps, pmTotals.hmrc),
          prevMonthEnd.toISOString(),
          pmTotals,
          buildPayload(
            deps,
            "MonthlySummary",
            prevMonthStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
            pmList,
            null
          ),
          false
        )
      );
    }

    return entries;
  }

  function money(deps, v) {
    if (deps.money) return deps.money(v);
    return "£" + Number(v || 0).toFixed(2);
  }

  function saveFromPayload(payload, source) {
    if (!payload || !payload.period) return null;
    const list = payload.shifts || [];
    const totals = sumList(list);
    const kind =
      payload.period === "WeeklySummary"
        ? "weekly_summary"
        : payload.period === "MonthlySummary"
          ? "monthly_summary"
          : payload.period === "Weekly"
            ? "weekly"
            : payload.period === "Monthly"
              ? "monthly"
              : payload.period === "Custom"
                ? "custom"
                : "daily";
    const title =
      payload.periodLabel ||
      (kind === "daily"
        ? "Daily Report · " + new Date().toLocaleDateString("en-GB")
        : payload.period + " Report");
    const entry = {
      id: "arch_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      kind: kind,
      category: filterCategory(kind),
      title: title,
      subtitle: totals.miles.toFixed(1) + " mi · " + totals.journeys + " journeys · £" + Number(totals.hmrc || 0).toFixed(2),
      createdAt: new Date().toISOString(),
      miles: totals.miles,
      hmrc: totals.hmrc,
      journeys: totals.journeys,
      payload: payload,
      synthetic: false,
      canDelete: true,
      source: source || "app",
    };
    const raw = loadRaw();
    raw.unshift(entry);
    saveRaw(raw);
    return entry;
  }

  function listEntries(deps, opts) {
    opts = opts || {};
    const search = (opts.search || "").trim().toLowerCase();
    const filter = opts.filter || "all";
    const dismissed = loadDismissed();
    const saved = loadRaw().filter(function (e) {
      return dismissed.indexOf(e.id) < 0;
    });
    const synthetic = buildSyntheticEntries(deps).filter(function (e) {
      return dismissed.indexOf(e.id) < 0;
    });
    const byId = {};
    synthetic.forEach(function (e) {
      byId[e.id] = e;
    });
    saved.forEach(function (e) {
      byId[e.id] = e;
    });
    let merged = Object.keys(byId).map(function (k) {
      return byId[k];
    });
    merged.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    if (filter !== "all") {
      merged = merged.filter(function (e) {
        return e.category === filter;
      });
    }
    if (search) {
      merged = merged.filter(function (e) {
        return (
          (e.title || "").toLowerCase().indexOf(search) >= 0 ||
          (e.subtitle || "").toLowerCase().indexOf(search) >= 0 ||
          (e.kind || "").toLowerCase().indexOf(search) >= 0
        );
      });
    }
    return merged;
  }

  function removeEntry(id) {
    if (String(id).indexOf("syn_") === 0) {
      const d = loadDismissed();
      if (d.indexOf(id) < 0) d.push(id);
      saveDismissed(d);
      return true;
    }
    saveRaw(
      loadRaw().filter(function (e) {
        return e.id !== id;
      })
    );
    return true;
  }

  function pdfFilename(entry) {
    const p = (entry.payload && entry.payload.period) || "Daily";
    const slug = new Date(entry.createdAt).toISOString().slice(0, 10);
    return "MilePilot-" + String(p).toLowerCase() + "-report-" + slug + ".pdf";
  }

  global.MPReportArchive = {
    STORAGE: STORAGE,
    saveFromPayload: saveFromPayload,
    listEntries: listEntries,
    removeEntry: removeEntry,
    pdfFilename: pdfFilename,
    filterCategory: filterCategory,
  };
})(typeof window !== "undefined" ? window : globalThis);
