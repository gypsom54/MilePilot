/**
 * MilePilot Trip Classifier — AI suggestion architecture
 * Suggestions only. The user always has final approval — never auto-classify.
 */
(function (global) {
  'use strict';

  const SUGGESTION_LABELS = {
    business: 'We think this trip was Business.',
    personal: 'We think this trip was Personal.',
  };

  function isWeekday(date) {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  }

  function isTypicalWorkHours(date) {
    const hour = date.getHours();
    return hour >= 7 && hour < 20;
  }

  /**
   * Returns a suggestion object or null. Never mutates the trip or classifies it.
   * @param {object} trip - pending trip payload
   * @param {object} [context] - optional { shiftActive, workType }
   */
  function suggestTripClassification(trip, context) {
    if (!trip || trip.status !== 'pending') return null;
    context = context || {};

    const start = new Date(trip.startISO || Date.now());
    const mi = Number(trip.miles) || 0;
    if (mi < 0.05) return null;

    const workType = context.workType || (typeof localStorage !== 'undefined' && localStorage.getItem('mp_user_work_type')) || '';
    const shiftActive = !!context.shiftActive;

    let confidence = 'low';
    let status = null;

    if (shiftActive && isTypicalWorkHours(start)) {
      status = 'business';
      confidence = 'medium';
    } else if (isWeekday(start) && isTypicalWorkHours(start) && mi >= 0.5) {
      status = 'business';
      confidence = 'low';
    } else if (!isWeekday(start) && mi < 2 && !shiftActive) {
      status = 'personal';
      confidence = 'low';
    }

    if (!status) return null;

    return {
      status: status,
      label: SUGGESTION_LABELS[status] || null,
      confidence: confidence,
      source: 'heuristic',
      workType: workType || null,
      autoClassify: false,
    };
  }

  function applySuggestionToTrip(trip, suggestion) {
    if (!trip || !suggestion || !suggestion.label) return trip;
    return Object.assign({}, trip, {
      aiSuggestion: suggestion.label,
      aiSuggestionMeta: {
        status: suggestion.status,
        confidence: suggestion.confidence,
        source: suggestion.source,
        autoClassify: false,
      },
    });
  }

  global.MPTripClassifier = {
    SUGGESTION_LABELS: SUGGESTION_LABELS,
    suggestTripClassification: suggestTripClassification,
    applySuggestionToTrip: applySuggestionToTrip,
  };
})(typeof window !== 'undefined' ? window : global);
