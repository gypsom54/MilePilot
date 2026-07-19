/**
 * MilePilot Journey Review — AI-assisted swipe review UI layer.
 * Separate from GPS tracking and report generation engines.
 */
(function (global) {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatTripTime(iso) {
    return new Date(iso).toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function formatDuration(seconds) {
    const totalMinutes = Math.max(0, Math.round((Number(seconds) || 0) / 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return hours + ' hr ' + minutes + ' min';
    if (hours) return hours + ' hr';
    return Math.max(1, totalMinutes) + ' min';
  }

  function formatDistance(miles) {
    return (Number(miles) || 0).toFixed(1) + ' mi';
  }

  function formatAdminTime(seconds) {
    const whole = Math.max(1, Math.round(Number(seconds) || 0));
    if (whole < 60) return whole + ' seconds';
    const mins = Math.floor(whole / 60);
    const rem = whole % 60;
    if (!rem) return mins + ' min';
    return mins + ' min ' + rem + ' sec';
  }

  function hasConfidence(suggestion) {
    if (!suggestion) return false;
    const pct = suggestion.confidencePercent != null
      ? Number(suggestion.confidencePercent)
      : suggestion.confidence != null
        ? Number(suggestion.confidence) * 100
        : NaN;
    if (!Number.isFinite(pct) || pct <= 0) return false;
    // Treat uncertain "Needs Review" predictions as no suggestion for UI rendering.
    return suggestionStatusLabel(suggestion) !== '';
  }

  function suggestionConfidencePercent(suggestion) {
    if (!suggestion) return null;
    if (suggestion.confidencePercent != null) return Number(suggestion.confidencePercent);
    if (suggestion.confidence != null) return Math.round(Number(suggestion.confidence) * 100);
    return null;
  }

  function suggestionStatusLabel(suggestion) {
    if (!suggestion) return '';
    if (suggestion.likelyLabel === 'Needs Review') return '';
    if (suggestion.status === 'personal') return 'Personal';
    if (suggestion.status === 'business') return 'Business';
    if (suggestion.likelyLabel === 'Likely Personal') return 'Personal';
    if (suggestion.likelyLabel === 'Likely Business') return 'Business';
    return suggestion.likelyLabel || '';
  }

  function estimateReviewTime(count) {
    if (count <= 2) return 'About 20 seconds';
    if (count <= 4) return 'About 20 seconds';
    return 'About 30 seconds';
  }

  function suggestionLeadCopy(suggestion) {
    const label = suggestionStatusLabel(suggestion);
    if (label === 'Business') return 'MilePilot thinks this was a business journey.';
    if (label === 'Personal') return 'MilePilot thinks this was a personal journey.';
    return '';
  }

  function journeyStartLocation(trip, suggestion) {
    return (
      (suggestion && suggestion.startArea) ||
      trip.startLabel ||
      trip.startAddress ||
      trip.startLocation ||
      'Start location pending'
    );
  }

  function journeyDestination(trip, suggestion) {
    return (
      (suggestion && suggestion.endArea) ||
      trip.destination ||
      trip.endAddress ||
      trip.endLocation ||
      'Destination pending'
    );
  }

  function isAutopilotDetected(trip) {
    return /autopilot detected/i.test(String((trip && trip.notes) || ''));
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

  function reviewCountsForDate(trips, date) {
    const dayTrips = tripsForReviewDate(trips, date);
    return {
      business: dayTrips.filter(function (trip) {
        return trip.status === 'business';
      }).length,
      personal: dayTrips.filter(function (trip) {
        return trip.status === 'personal';
      }).length,
      remaining: dayTrips.filter(function (trip) {
        return trip.status === 'pending';
      }).length,
      total: dayTrips.length,
    };
  }

  function renderSummaryHtml(counts) {
    const reviewTime = estimateReviewTime(counts.remaining || 0);
    return (
      '<div class="jr-summary" aria-label="Review summary">' +
      '<div class="jr-summary-stat"><span>Review time</span><strong>' +
      escapeHtml(reviewTime) +
      '</strong></div>' +
      '<div class="jr-summary-stat"><span>Business reviewed</span><strong>' +
      counts.business +
      '</strong></div>' +
      '<div class="jr-summary-stat"><span>Left</span><strong>' +
      counts.remaining +
      ' left</strong></div>' +
      '</div>'
    );
  }

  function timeGreeting() {
    const name = (global.localStorage && global.localStorage.getItem('mp_driver')) || 'there';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning, ' + name + ' 👋';
    if (hour >= 12 && hour < 17) return 'Good afternoon, ' + name + ' 👋';
    if (hour >= 17 && hour < 22) return 'Good evening, ' + name + ' 👋';
    return 'Working late, ' + name + '?';
  }

  function syncReviewHeader(counts) {
    const title = document.getElementById('jrTitle');
    const subtitle = document.getElementById('jrSubtitle');
    const kicker = document.getElementById('ccSumKicker');
    const period = document.getElementById('ccSumSubtitle');
    const reviewTime = estimateReviewTime((counts && counts.remaining) || 0);
    if (title) title.textContent = "Today's journeys";
    if (subtitle) subtitle.textContent = reviewTime;
    if (kicker) kicker.textContent = timeGreeting();
    if (period) period.textContent = "Today's journeys";
  }

  function renderSuggestionBannerHtml(suggestion) {
    if (!hasConfidence(suggestion)) return '';
    const label = suggestionStatusLabel(suggestion);
    if (!label) return '';
    return (
      '<div class="jr-suggestion" role="note">' +
      '<p class="jr-suggestion-copy">' +
      escapeHtml(suggestionLeadCopy(suggestion)) +
      '</p>' +
      '</div>'
    );
  }

  function renderReviewCardHtml(item, index, total) {
    const trip = item.trip;
    const suggestion = item.suggestion || null;
    const startTime = formatTripTime(trip.startISO);
    const endTime = formatTripTime(trip.endISO || trip.startISO);
    const startLocation = journeyStartLocation(trip, suggestion);
    const destination = journeyDestination(trip, suggestion);
    return (
      '<div class="jr-review-shell">' +
      '<article class="jr-focus-card" data-trip-id="' +
      escapeHtml(trip.id) +
      '">' +
      '<div class="jr-card-head">' +
      '<h3 class="jr-card-title">Review this journey</h3>' +
      '</div>' +
      renderSuggestionBannerHtml(suggestion) +
      '<div class="jr-time-rail">' +
      '<div class="jr-time-stop"><span>Start time</span><strong>' +
      escapeHtml(startTime) +
      '</strong></div>' +
      '<div class="jr-time-arrow" aria-hidden="true">↓</div>' +
      '<div class="jr-time-stop"><span>End time</span><strong>' +
      escapeHtml(endTime) +
      '</strong></div>' +
      '</div>' +
      '<div class="jr-route-rail">' +
      '<div class="jr-route-row"><span>Start location</span><strong>' +
      escapeHtml(startLocation) +
      '</strong></div>' +
      '<div class="jr-route-arrow" aria-hidden="true">↓</div>' +
      '<div class="jr-route-row"><span>Destination</span><strong>' +
      escapeHtml(destination) +
      '</strong></div>' +
      '</div>' +
      '<div class="jr-metric-row">' +
      '<div class="jr-metric-pill"><span>Distance</span><strong>' +
      escapeHtml(formatDistance(trip.miles)) +
      '</strong></div>' +
      '<div class="jr-metric-pill"><span>Journey duration</span><strong>' +
      escapeHtml(formatDuration(trip.seconds)) +
      '</strong></div>' +
      '</div>' +
      '<div class="jr-swipe-guide" aria-hidden="true">' +
      '<span>Swipe left · Personal</span><span>Swipe right · Business</span>' +
      '</div>' +
      '</article>' +
      '<div class="jr-card-actions">' +
      '<button type="button" class="jr-card-btn is-personal" data-action="personal" data-trip-id="' +
      escapeHtml(trip.id) +
      '">Personal</button>' +
      '<button type="button" class="jr-card-btn is-business" data-action="business" data-trip-id="' +
      escapeHtml(trip.id) +
      '">Business</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderCompletionExperienceHtml(summary) {
    const counts = summary.counts || { business: 0, personal: 0, remaining: 0 };
    const monthSavedHours = Math.max(0, Number(summary.monthSavedSeconds) || Number(summary.totalSavedSeconds) || 0) / 3600;
    return (
      '<div class="jr-complete-screen">' +
      '<div class="jr-complete-hero">' +
      '<p class="jr-complete-kicker">✓</p>' +
      '<h3 class="jr-complete-title">Today\'s business admin is finished.</h3>' +
      '<p class="jr-complete-sub">Review completed in ' +
      escapeHtml(formatAdminTime(summary.durationSeconds)) +
      '.</p>' +
      '</div>' +
      '<div class="jr-complete-grid">' +
      '<div class="jr-complete-stat"><span>Business journeys</span><strong>' +
      counts.business +
      '</strong></div>' +
      '<div class="jr-complete-stat"><span>Personal journeys</span><strong>' +
      counts.personal +
      '</strong></div>' +
      '<div class="jr-complete-stat"><span>Business miles reviewed</span><strong>' +
      escapeHtml(formatDistance(summary.businessMiles)) +
      '</strong></div>' +
      '<div class="jr-complete-stat"><span>Estimated HMRC claim</span><strong>' +
      escapeHtml(summary.hmrcLabel) +
      '</strong></div>' +
      '</div>' +
      '<div class="jr-complete-highlight">' +
      '<span>You\'ve saved ' +
      escapeHtml(monthSavedHours.toFixed(1)) +
      ' hours of business admin this month.</span>' +
      '<p>Total admin time saved so far: ' +
      escapeHtml(formatAdminTime(summary.totalSavedSeconds)) +
      '.</p>' +
      '</div>' +
      '<div class="jr-complete-actions">' +
      '<button type="button" class="jr-complete-action" data-complete-action="report">View Report</button>' +
      '<button type="button" class="jr-complete-action" data-complete-action="workspace">Business Workspace</button>' +
      '<button type="button" class="jr-complete-action" data-complete-action="dashboard">Done</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderEmptyStateHtml() {
    return (
      '<div class="jr-empty-state jr-empty-card">' +
      '<div class="jr-empty-icon" aria-hidden="true"></div>' +
      '<h3>You\'re all caught up</h3>' +
      '<p>No journeys are waiting for review.</p>' +
      '<div class="jr-complete-actions">' +
      '<button type="button" class="jr-complete-action" data-empty-action="track">' +
      '<span>Start tracking</span>' +
      '<strong>Begin a new shift now</strong>' +
      '</button>' +
      '<button type="button" class="jr-complete-action" data-empty-action="dashboard">' +
      '<span>Back to dashboard</span>' +
      '<strong>Return to your MilePilot home screen</strong>' +
      '</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderReviewExperienceHtml(reviewItems, counts) {
    const list = reviewItems || [];
    syncReviewHeader(counts || { business: 0, personal: 0, remaining: 0 });
    let html = '<div class="jr-review-experience">';
    if (list.length) html += renderReviewCardHtml(list[0], 0, list.length);
    else html += renderEmptyStateHtml();
    html += renderSummaryHtml(counts || { business: 0, personal: 0, remaining: 0 });
    html += '</div>';
    return html;
  }

  function renderHeaderMetaHtml(counts) {
    return {
      waiting: counts.remaining === 1 ? '1 left' : counts.remaining + ' left',
      eta: estimateReviewTime(counts.remaining),
    };
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

  function bindReviewCard(el, onClassify) {
    if (!el) return;
    const card = el.querySelector('.jr-focus-card');
    if (!card) return;
    let pointerId = null;
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let locked = false;
    const tripId = card.getAttribute('data-trip-id');

    function resetCard() {
      card.style.transform = '';
      card.classList.remove('is-swiping-left', 'is-swiping-right');
    }

    function commitDecision(direction) {
      if (locked || !onClassify) return;
      locked = true;
      card.classList.add(direction === 'left' ? 'is-exit-left' : 'is-exit-right');
      setTimeout(function () {
        onClassify(tripId, direction === 'left' ? 'personal' : 'business');
      }, 180);
    }

    function finishSwipe(direction) {
      commitDecision(direction);
    }

    card.addEventListener('pointerdown', function (event) {
      if (locked) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      currentX = 0;
      dragging = true;
      if (card.setPointerCapture) card.setPointerCapture(pointerId);
    });

    card.addEventListener('pointermove', function (event) {
      if (!dragging || event.pointerId !== pointerId) return;
      currentX = event.clientX - startX;
      card.style.transform = 'translateX(' + currentX + 'px) rotate(' + currentX * 0.045 + 'deg)';
      card.classList.toggle('is-swiping-left', currentX < -40);
      card.classList.toggle('is-swiping-right', currentX > 40);
    });

    function endPointer(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      if (currentX > 88) finishSwipe('right');
      else if (currentX < -88) finishSwipe('left');
      else resetCard();
      currentX = 0;
      pointerId = null;
    }

    card.addEventListener('pointerup', endPointer);
    card.addEventListener('pointercancel', endPointer);

    el.querySelectorAll('[data-action][data-trip-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (locked || !onClassify) return;
        const action = btn.getAttribute('data-action');
        commitDecision(action === 'personal' ? 'left' : 'right');
      });
    });
  }

  function bindCompletionActions(el, onAction) {
    if (!el) return;
    el.querySelectorAll('[data-complete-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!onAction) return;
        onAction(btn.getAttribute('data-complete-action'));
      });
    });
  }

  function bindEmptyActions(el, onAction) {
    if (!el) return;
    el.querySelectorAll('[data-empty-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!onAction) return;
        onAction(btn.getAttribute('data-empty-action'));
      });
    });
  }

  function renderSwipeStackHtml(uncertainList) {
    return renderReviewExperienceHtml(uncertainList || [], {
      business: 0,
      personal: 0,
      remaining: (uncertainList || []).length,
    });
  }

  function bindSwipeStack(el, onClassify) {
    bindReviewCard(el, onClassify);
  }

  global.MPJourneyReview = {
    formatTripTime: formatTripTime,
    formatDuration: formatDuration,
    tripsForReviewDate: tripsForReviewDate,
    tripsNeedingReview: tripsNeedingReview,
    classifyTripInStore: classifyTripInStore,
    classifyAllForDate: classifyAllForDate,
    reviewCountsForDate: reviewCountsForDate,
    renderHeaderMetaHtml: renderHeaderMetaHtml,
    renderReviewListHtml: renderReviewListHtml,
    renderReviewExperienceHtml: renderReviewExperienceHtml,
    renderCompletionExperienceHtml: renderCompletionExperienceHtml,
    renderEmptyStateHtml: renderEmptyStateHtml,
    renderSwipeStackHtml: renderSwipeStackHtml,
    bindReviewCard: bindReviewCard,
    bindCompletionActions: bindCompletionActions,
    bindEmptyActions: bindEmptyActions,
    bindSwipeStack: bindSwipeStack,
    businessTotalsForDate: businessTotalsForDate,
    estimateReviewTime: estimateReviewTime,
    formatAdminTime: formatAdminTime,
  };
})(typeof window !== 'undefined' ? window : global);
