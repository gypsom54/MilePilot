/**
 * MilePilot Journey Review — AI-assisted swipe review UI layer.
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

  function renderSwipeCardHtml(trip, suggestion, index, total) {
    const time = formatTripTime(trip.startISO);
    const mi = (Number(trip.miles) || 0).toFixed(1);
    const sug = suggestion || {};
    const title = sug.likelyLabel || (sug.status === 'personal' ? 'Likely Personal' : 'Likely Business');
    const confPct = sug.confidencePercent != null ? sug.confidencePercent : Math.round((sug.confidence || 0) * 100);
    const reason = sug.reason || 'Please confirm this journey';
    const startArea = sug.startArea || 'Unknown area';
    const endArea = sug.endArea || 'Unknown area';
    const titleClass =
      title === 'Likely Personal'
        ? 'is-personal'
        : title === 'Needs Review'
          ? 'is-review'
          : 'is-business';
    const stackClass = index === 0 ? ' is-top' : '';
    return (
      '<div class="ai-card' +
      stackClass +
      '" data-trip-id="' +
      trip.id +
      '" data-index="' +
      index +
      '" style="z-index:' +
      (total - index) +
      '">' +
      '<div class="ai-card-inner">' +
      '<div class="ai-card-progress">' +
      (index + 1) +
      ' of ' +
      total +
      ' to review</div>' +
      '<div class="ai-card-time">' +
      time +
      '</div>' +
      '<div class="ai-card-miles">' +
      mi +
      ' miles</div>' +
      '<div class="ai-card-route">' +
      '<span class="ai-card-area"><em>From</em> ' +
      startArea +
      '</span>' +
      '<span class="ai-card-area"><em>To</em> ' +
      endArea +
      '</span>' +
      '</div>' +
      '<div class="ai-explain">' +
      '<strong class="ai-explain-title ai-explain-' +
      titleClass +
      '">' +
      title +
      '</strong>' +
      '<p class="ai-explain-reason"><span>Reason:</span> ' +
      reason +
      '</p>' +
      '<p class="ai-explain-conf"><span>Confidence:</span> ' +
      (title === 'Needs Review' ? 'Needs review' : confPct + '%') +
      '</p>' +
      '</div>' +
      '<div class="ai-swipe-hints" aria-hidden="true">' +
      '<span class="ai-hint-left">← Personal</span>' +
      '<span class="ai-hint-right">Business →</span>' +
      '</div>' +
      '</div>' +
      '<div class="ai-card-actions">' +
      '<button type="button" class="ai-act ai-act-personal" data-action="personal" data-trip-id="' +
      trip.id +
      '">Personal</button>' +
      '<button type="button" class="ai-act ai-act-skip" data-action="skip" data-trip-id="' +
      trip.id +
      '">Review later</button>' +
      '<button type="button" class="ai-act ai-act-business" data-action="business" data-trip-id="' +
      trip.id +
      '">Business</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderSwipeStackHtml(uncertainList) {
    if (!uncertainList || !uncertainList.length) {
      return '<div class="ai-all-sorted"><p>All journeys sorted for today.</p><p class="ai-all-sub">Your business mileage record is ready.</p></div>';
    }
    const show = uncertainList.slice(0, 3);
    let html = '<div class="ai-stack" id="aiSwipeStack">';
    show.forEach(function (item, i) {
      html += renderSwipeCardHtml(item.trip, item.suggestion, i, uncertainList.length);
    });
    html += '</div>';
    return html;
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
    legacyShifts.forEach(function (s) {
      list.push(s);
    });
    if (!global.MPTaxEngine) {
      throw new Error('MPTaxEngine unavailable. Application initialisation error.');
    }
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const all = global.MPTaxEngine.collectBusinessJourneys(trips, shifts);
    const defaultVehicle =
      all.length && all[0].vehicle ? all[0].vehicle : trips[0]?.vehicle || shifts[0]?.vehicle || 'car';
    const totals = global.MPTaxEngine.periodClaimTotals(all, dayStart, dayEnd, defaultVehicle);
    return {
      mi: totals.mi,
      sec: totals.sec,
      hmrc: totals.hmrc,
      journeys: totals.journeys,
      list: totals.list.length ? totals.list : list,
      pending: tripsNeedingReview(trips, date).length,
    };
  }

  function bindSwipeStack(el, onClassify, onSkip) {
    if (!el) return;
    const cards = el.querySelectorAll('.ai-card.is-top');
    cards.forEach(function (card) {
      let startX = 0;
      let currentX = 0;
      let dragging = false;
      const tripId = card.getAttribute('data-trip-id');

      function reset() {
        card.style.transform = '';
        card.classList.remove('is-swiping-left', 'is-swiping-right');
      }

      function finishSwipe(direction) {
        if (direction === 'left' && onClassify) onClassify(tripId, 'personal');
        else if (direction === 'right' && onClassify) onClassify(tripId, 'business');
        reset();
      }

      card.addEventListener(
        'touchstart',
        function (e) {
          if (!card.classList.contains('is-top')) return;
          startX = e.touches[0].clientX;
          dragging = true;
        },
        { passive: true }
      );
      card.addEventListener(
        'touchmove',
        function (e) {
          if (!dragging || !card.classList.contains('is-top')) return;
          currentX = e.touches[0].clientX - startX;
          card.style.transform = 'translateX(' + currentX + 'px) rotate(' + currentX * 0.04 + 'deg)';
          card.classList.toggle('is-swiping-left', currentX < -40);
          card.classList.toggle('is-swiping-right', currentX > 40);
        },
        { passive: true }
      );
      card.addEventListener('touchend', function () {
        if (!dragging) return;
        dragging = false;
        if (currentX > 80) finishSwipe('right');
        else if (currentX < -80) finishSwipe('left');
        else reset();
        currentX = 0;
      });

      card.querySelectorAll('.ai-act[data-action]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const action = btn.getAttribute('data-action');
          const id = btn.getAttribute('data-trip-id');
          if (action === 'skip' && onSkip) onSkip(id);
          else if (onClassify) onClassify(id, action);
        });
      });
    });
  }

  global.MPJourneyReview = {
    formatTripTime: formatTripTime,
    tripsForReviewDate: tripsForReviewDate,
    tripsNeedingReview: tripsNeedingReview,
    classifyTripInStore: classifyTripInStore,
    classifyAllForDate: classifyAllForDate,
    renderReviewListHtml: renderReviewListHtml,
    renderSwipeStackHtml: renderSwipeStackHtml,
    bindSwipeStack: bindSwipeStack,
    businessTotalsForDate: businessTotalsForDate,
  };
})(typeof window !== 'undefined' ? window : global);
