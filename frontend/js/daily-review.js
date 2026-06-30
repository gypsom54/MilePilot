/**
 * MilePilot Daily Review — MP-042 (LOCKED)
 * Silent recording all day · one Daily Summary at end of day · user confirms all classifications.
 * Same engine for every user — no profession-specific tracking forks.
 */
(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'mp_daily_review_';
  const DAY_END_HOUR = 17;
  const IDLE_AFTER_LAST_TRIP_MS = 20 * 60 * 1000;

  function dateKey(date) {
    date = date || new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();
  }

  function loadReviewState(date) {
    try {
      const raw = global.localStorage.getItem(STORAGE_PREFIX + dateKey(date));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function isReviewComplete(date) {
    const state = loadReviewState(date);
    return !!(state && state.completedAt);
  }

  function markReviewComplete(date, opts) {
    opts = opts || {};
    try {
      global.localStorage.setItem(
        STORAGE_PREFIX + dateKey(date),
        JSON.stringify({
          completedAt: new Date().toISOString(),
          reportGenerated: !!opts.reportGenerated,
          journeysReviewed: Number(opts.journeysReviewed) || 0,
          pendingRemaining: Number(opts.pendingRemaining) || 0,
        })
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  function tripsForDay(trips, date) {
    if (typeof global.MPTrips !== 'undefined' && global.MPTrips.tripsForDate) {
      return global.MPTrips.tripsForDate(trips || [], date || new Date());
    }
    const key = dateKey(date);
    return (trips || []).filter(function (t) {
      return new Date(t.startISO).toDateString() === key;
    });
  }

  function pendingTripsForDay(trips, date) {
    return tripsForDay(trips, date).filter(function (t) {
      return t.status === 'pending';
    });
  }

  function lastTripEndMs(trips, date) {
    let max = 0;
    tripsForDay(trips, date).forEach(function (t) {
      const end = new Date(t.endISO || t.startISO).getTime();
      if (end > max) max = end;
    });
    return max;
  }

  function isShiftActive() {
    if (typeof global.isShiftTracking === 'function') return global.isShiftTracking();
    return false;
  }

  /**
   * Workday likely ended — evening hour or idle after last journey (stationary grace aligned).
   */
  function isWorkdayLikelyEnded(trips, date, now) {
    if (isShiftActive()) return false;
    now = now || new Date();
    if (now.getHours() >= DAY_END_HOUR) return true;
    const lastEnd = lastTripEndMs(trips, date);
    if (!lastEnd) return false;
    return now.getTime() - lastEnd >= IDLE_AFTER_LAST_TRIP_MS;
  }

  function shouldPromptDailyReview(trips, date) {
    date = date || new Date();
    if (isReviewComplete(date)) return false;
    const pending = pendingTripsForDay(trips, date);
    if (!pending.length) return false;
    return isWorkdayLikelyEnded(trips, date);
  }

  /** During the day — journeys recorded but no review prompt yet. */
  function isSilentRecordingDay(trips, date) {
    date = date || new Date();
    if (isReviewComplete(date)) return false;
    if (!pendingTripsForDay(trips, date).length) return false;
    return !isWorkdayLikelyEnded(trips, date);
  }

  function dailyInsight(trips, date) {
    date = date || new Date();
    const today = tripsForDay(trips, date);
    const pending = pendingTripsForDay(trips, date);
    const business = today.filter(function (t) {
      return t.status === 'business';
    });
    if (!today.length) return 'No journeys recorded today yet.';
    if (!pending.length) {
      return business.length
        ? 'All journeys reviewed — ready for your daily report.'
        : 'No business journeys confirmed today.';
    }
    if (pending.length === 1) {
      return 'Review 1 journey from today — about 30 seconds.';
    }
    return (
      'Review ' +
      pending.length +
      ' journeys from today — about ' +
      Math.min(60, pending.length * 15) +
      ' seconds.'
    );
  }

  /**
   * Future Driver Intelligence — day-level suggestions (never auto-classify).
   */
  function dayLevelSuggestions(trips, date) {
    const pending = pendingTripsForDay(trips, date);
    const suggestions = [];
    if (!pending.length) return suggestions;
    const hour = new Date().getHours();
    if (hour >= 17) {
      suggestions.push("You've returned after your normal workday — review today's journeys?");
    }
    if (pending.length >= 3) {
      suggestions.push('MilePilot recorded several journeys today. Confirm Business or Personal for each.');
    }
    return suggestions;
  }

  function waitingSecondsForTrip(trip) {
    const total = Number(trip.seconds) || 0;
    const moving = Number(trip.movingSeconds) || 0;
    return Math.max(0, total - moving);
  }

  function dayActivityTotals(trips, date) {
    const today = tripsForDay(trips, date);
    const business = today.filter(function (t) {
      return t.status === 'business';
    });
    let drivingSec = 0;
    let waitingSec = 0;
    business.forEach(function (t) {
      drivingSec += Number(t.movingSeconds) || Number(t.seconds) || 0;
      waitingSec += waitingSecondsForTrip(t);
    });
    return {
      journeys: today.length,
      pending: pendingTripsForDay(trips, date).length,
      businessJourneys: business.length,
      businessMiles: business.reduce(function (a, t) {
        return a + (Number(t.miles) || 0);
      }, 0),
      drivingSeconds: drivingSec,
      waitingSeconds: waitingSec,
      hmrc: business.reduce(function (a, t) {
        return a + (Number(t.hmrc) || 0);
      }, 0),
    };
  }

  global.MPDailyReview = {
    dateKey: dateKey,
    isReviewComplete: isReviewComplete,
    markReviewComplete: markReviewComplete,
    tripsForDay: tripsForDay,
    pendingTripsForDay: pendingTripsForDay,
    isWorkdayLikelyEnded: isWorkdayLikelyEnded,
    shouldPromptDailyReview: shouldPromptDailyReview,
    isSilentRecordingDay: isSilentRecordingDay,
    dailyInsight: dailyInsight,
    dayLevelSuggestions: dayLevelSuggestions,
    dayActivityTotals: dayActivityTotals,
    waitingSecondsForTrip: waitingSecondsForTrip,
    DAY_END_HOUR: DAY_END_HOUR,
  };
})(typeof window !== 'undefined' ? window : global);
