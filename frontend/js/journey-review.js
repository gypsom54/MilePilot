/**
 * MilePilot Journey Review — Business / Personal classification UI layer.
 * Separate from GPS tracking and report generation engines.
 */
(function (global) {
  'use strict';

  function formatTripTime(iso) {
    return new Date(iso).toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function tripsForReviewDate(trips, date) {
    const key = new Date(date).toDateString();
    return (trips || [])
      .filter(function (t) {
        return new Date(t.startISO).toDateString() === key;
      })
      .sort(function (a, b) {
        return new Date(a.startISO) - new Date(b.startISO);
      });
  }

  function tripsNeedingReview(trips, date) {
    return tripsForReviewDate(trips, date).filter(function (t) {
      return t.status === 'pending';
    });
  }

  function classifyTripInStore(trips, tripId, status, claimFn, vehicle) {
    if (typeof global.MPTrips === 'undefined') return null;
    return global.MPTrips.classifyTrip(trips, tripId, status, claimFn, vehicle);
  }

  function classifyAllForDate(trips, date, status, claimFn, vehicle) {
    tripsForReviewDate(trips, date).forEach(function (t) {
      if (t.status === 'pending') {
        classifyTripInStore(trips, t.id, status, claimFn, vehicle);
      }
    });
  }

  function renderReviewListHtml(trips, date) {
    const list = tripsForReviewDate(trips, date);
    if (!list.length) return '';
    let html = '<div class="jr-list">';
    list.forEach(function (t) {
      const time = formatTripTime(t.startISO);
      const mi = (Number(t.miles) || 0).toFixed(1);
      const isBiz = t.status === 'business';
      const isPer = t.status === 'personal';
      html += '<div class="jr-item" data-trip-id="' + t.id + '">';
      html +=
        '<div class="jr-item-head"><span class="jr-time">' +
        time +
        '</span><span class="jr-miles">' +
        mi +
        ' miles</span></div>';
      html += '<div class="jr-actions">';
      html +=
        '<button type="button" class="jr-btn' +
        (isBiz ? ' is-selected is-business' : '') +
        '" data-action="business" data-trip-id="' +
        t.id +
        '">Business</button>';
      html +=
        '<button type="button" class="jr-btn' +
        (isPer ? ' is-selected is-personal' : '') +
        '" data-action="personal" data-trip-id="' +
        t.id +
        '">Personal</button>';
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  function businessTotalsForDate(trips, shifts, date) {
    const key = new Date(date).toDateString();
    const businessTrips = (trips || []).filter(function (t) {
      return t.status === 'business' && new Date(t.startISO).toDateString() === key;
    });
    const tripShiftIds = new Set(
      (trips || [])
        .map(function (t) {
          return t.shiftId;
        })
        .filter(Boolean)
    );
    const legacyShifts = (shifts || []).filter(function (s) {
      return (
        sameDay(new Date(s.startISO), new Date(date)) &&
        !tripShiftIds.has(s.id) &&
        (Number(s.miles) || 0) >= 0.01
      );
    });
    const list = businessTrips.slice();
    let mi = businessTrips.reduce(function (a, t) {
      return a + (Number(t.miles) || 0);
    }, 0);
    let sec = businessTrips.reduce(function (a, t) {
      return a + (Number(t.seconds) || 0);
    }, 0);
    let hmrc = businessTrips.reduce(function (a, t) {
      return a + (Number(t.hmrc) || 0);
    }, 0);
    legacyShifts.forEach(function (s) {
      mi += Number(s.miles) || 0;
      sec += Number(s.seconds) || 0;
      hmrc += Number(s.hmrc) || 0;
      list.push(s);
    });
    return {
      mi: mi,
      sec: sec,
      hmrc: hmrc,
      journeys: list.length,
      list: list,
      pending: tripsNeedingReview(trips, date).length,
    };
  }

  global.MPJourneyReview = {
    formatTripTime: formatTripTime,
    tripsForReviewDate: tripsForReviewDate,
    tripsNeedingReview: tripsNeedingReview,
    classifyTripInStore: classifyTripInStore,
    classifyAllForDate: classifyAllForDate,
    renderReviewListHtml: renderReviewListHtml,
    businessTotalsForDate: businessTotalsForDate,
  };
})(typeof window !== 'undefined' ? window : global);
