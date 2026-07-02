/**
 * MP-046 — Intelligence recommendation architecture (stubs only).
 * Future: mode switches, address classification, finish-time reports.
 * Do not implement AI logic yet — record signals and expose hooks.
 */
(function (global) {
  'use strict';

  const STORAGE_SIGNALS = 'mp_intelligence_signals';
  const SIGNAL_MAX = 200;

  const RECOMMENDATION_TYPES = {
    MODE_SWITCH_AUTOPILOT: 'mode_switch_autopilot',
    ADDRESS_CLASSIFY: 'address_classify',
    AUTO_REPORT_TIME: 'auto_report_time',
  };

  function loadSignals() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SIGNALS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveSignals(list) {
    try {
      localStorage.setItem(STORAGE_SIGNALS, JSON.stringify(list.slice(-SIGNAL_MAX)));
    } catch (e) {}
  }

  function recordSignal(type, payload) {
    const entry = {
      type: type,
      payload: payload || {},
      at: Date.now(),
    };
    const list = loadSignals();
    list.push(entry);
    saveSignals(list);
    return entry;
  }

  function recordJourneyCompleted(shift) {
    if (!shift) return;
    recordSignal('journey_completed', {
      miles: shift.miles,
      dayOfWeek: new Date(shift.endISO || Date.now()).getDay(),
      hour: new Date(shift.endISO || Date.now()).getHours(),
    });
  }

  function recordWeekdayPattern(weekdayCount) {
    recordSignal('weekday_pattern', { weekdayJourneys: weekdayCount });
  }

  /**
   * Future: return actionable recommendations for UI prompts.
   * @returns {Array<{id,type,title,body,action}>}
   */
  function getPendingRecommendations() {
    return [];
  }

  /**
   * Future: evaluate whether to suggest AutoPilot vs Manual.
   * @returns {null|{mode:string,reason:string}}
   */
  function evaluateModeRecommendation() {
    return null;
  }

  /**
   * Future example prompts (not shown until AI is implemented):
   * - "We've noticed you drive every weekday. Switch to AutoPilot?"
   * - "Journeys to this address are almost always business. Auto-classify?"
   * - "You usually finish around 6:30 PM. Prepare your report automatically?"
   */
  function getExamplePrompts() {
    return [
      {
        type: RECOMMENDATION_TYPES.MODE_SWITCH_AUTOPILOT,
        title: "We've noticed you drive every weekday.",
        body: 'Would you like to switch to AutoPilot?',
      },
      {
        type: RECOMMENDATION_TYPES.ADDRESS_CLASSIFY,
        title: "We've noticed journeys to this address are almost always business.",
        body: 'Auto-classify future journeys?',
      },
      {
        type: RECOMMENDATION_TYPES.AUTO_REPORT_TIME,
        title: 'You usually finish work around 6:30 PM.',
        body: 'Prepare your report automatically?',
      },
    ];
  }

  global.MPIntelligence = {
    RECOMMENDATION_TYPES: RECOMMENDATION_TYPES,
    recordSignal: recordSignal,
    recordJourneyCompleted: recordJourneyCompleted,
    recordWeekdayPattern: recordWeekdayPattern,
    getPendingRecommendations: getPendingRecommendations,
    evaluateModeRecommendation: evaluateModeRecommendation,
    getExamplePrompts: getExamplePrompts,
    loadSignals: loadSignals,
  };
})(typeof window !== 'undefined' ? window : globalThis);
