/**
 * MP-046 — Tracking modes: AutoPilot (flagship) vs Manual (privacy-first).
 * Core product architecture — not a simple settings toggle.
 */
(function (global) {
  'use strict';

  const MODE_AUTOPILOT = 'autopilot';
  const MODE_MANUAL = 'manual';
  const STORAGE_MODE = 'mp_tracking_mode';
  const STORAGE_FREQ = 'mp_driving_frequency';

  const MODES = {
    autopilot: {
      id: MODE_AUTOPILOT,
      label: 'AutoPilot',
      emoji: '🚀',
      shortTagline: 'Set it once. MilePilot handles the rest.',
      description:
        'Drive normally. MilePilot quietly detects business journeys in the background while your phone is locked and prepares your reports automatically.',
      badge: 'RECOMMENDED',
      recommended: true,
      features: [
        'Background trip detection',
        'Lock-screen support',
        'Automatic journey detection',
        'End-of-day review',
        'Daily reports',
        'Weekly Summary every Sunday 11:59 PM',
        'Monthly Summary on the last day of each month',
        'AI learning (future)',
      ],
      startLabel: 'Start Shift',
      endLabel: 'End Shift',
      usesBackgroundGps: true,
      usesAutoEnd: true,
    },
    manual: {
      id: MODE_MANUAL,
      label: 'Manual',
      emoji: '🎯',
      shortTagline: 'Track journeys only when you choose.',
      description:
        'Perfect if you prefer complete control or only occasionally claim business mileage.',
      badge: null,
      recommended: false,
      features: [
        'Start Journey',
        'End Journey',
        'Generate reports on demand',
        'No continuous background tracking',
        'Lower battery usage',
        'Greater privacy',
      ],
      startLabel: 'Start Journey',
      endLabel: 'End Journey',
      usesBackgroundGps: false,
      usesAutoEnd: false,
    },
  };

  const FREQUENCIES = {
    daily: { id: 'daily', label: 'Every day', recommend: MODE_AUTOPILOT },
    weekly: { id: 'weekly', label: 'A few times each week', recommend: MODE_AUTOPILOT },
    occasionally: { id: 'occasionally', label: 'Occasionally', recommend: MODE_MANUAL },
  };

  function getModeMeta(modeId) {
    return MODES[modeId] || MODES[MODE_AUTOPILOT];
  }

  function getMode() {
    try {
      const raw = localStorage.getItem(STORAGE_MODE);
      if (raw === MODE_MANUAL || raw === MODE_AUTOPILOT) return raw;
    } catch (e) {}
    return null;
  }

  function getDrivingFrequency() {
    try {
      const raw = localStorage.getItem(STORAGE_FREQ);
      if (raw && FREQUENCIES[raw]) return raw;
    } catch (e) {}
    return null;
  }

  function recommendMode(frequency) {
    const f = FREQUENCIES[frequency];
    return f ? f.recommend : MODE_AUTOPILOT;
  }

  function hasModeSelected() {
    return getMode() === MODE_AUTOPILOT || getMode() === MODE_MANUAL;
  }

  function setMode(mode, opts) {
    if (!MODES[mode]) return false;
    try {
      localStorage.setItem(STORAGE_MODE, mode);
      if (opts && opts.frequency) {
        localStorage.setItem(STORAGE_FREQ, opts.frequency);
      }
      if (!opts || !opts.silent) {
        try {
          const profile = JSON.parse(localStorage.getItem('mp_business_profile') || '{}');
          profile.trackingMode = mode;
          if (opts && opts.frequency) profile.drivingFrequency = opts.frequency;
          localStorage.setItem('mp_business_profile', JSON.stringify(profile));
        } catch (e) {}
      }
      if (global.MPIntelligence && typeof global.MPIntelligence.recordSignal === 'function') {
        global.MPIntelligence.recordSignal('mode_selected', { mode: mode, frequency: opts && opts.frequency });
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  function setDrivingFrequency(frequency) {
    if (!FREQUENCIES[frequency]) return false;
    try {
      localStorage.setItem(STORAGE_FREQ, frequency);
    } catch (e) {
      return false;
    }
    return true;
  }

  function isAutoPilot() {
    return getMode() !== MODE_MANUAL;
  }

  function isManual() {
    return getMode() === MODE_MANUAL;
  }

  /** Default returning users to AutoPilot so existing behaviour is preserved. */
  function migrateLegacyDefault() {
    if (hasModeSelected()) return false;
    if (localStorage.getItem('mp_onboard_complete') !== 'true') return false;
    setMode(MODE_AUTOPILOT, { silent: true });
    return true;
  }

  function usesBackgroundTracking() {
    return isAutoPilot();
  }

  function usesAutoEnd() {
    return isAutoPilot();
  }

  function getStartButtonLabel() {
    return getModeMeta(getMode() || MODE_AUTOPILOT).startLabel;
  }

  function getEndButtonLabel() {
    return getModeMeta(getMode() || MODE_AUTOPILOT).endLabel;
  }

  function getSwitchExplanation(fromMode, toMode) {
    if (fromMode === toMode) return '';
    if (toMode === MODE_AUTOPILOT) {
      return 'Switching to AutoPilot enables background GPS, lock-screen recording, and automatic trip end after 90 minutes stopped. iPhone will ask for Always Allow location.';
    }
    return 'Switching to Manual stops background tracking and auto-end. You start and end each journey yourself. Reports work the same when you finish a journey.';
  }

  global.MPTrackingMode = {
    MODE_AUTOPILOT: MODE_AUTOPILOT,
    MODE_MANUAL: MODE_MANUAL,
    MODES: MODES,
    FREQUENCIES: FREQUENCIES,
    getMode: getMode,
    getModeMeta: getModeMeta,
    getDrivingFrequency: getDrivingFrequency,
    recommendMode: recommendMode,
    hasModeSelected: hasModeSelected,
    setMode: setMode,
    setDrivingFrequency: setDrivingFrequency,
    isAutoPilot: isAutoPilot,
    isManual: isManual,
    migrateLegacyDefault: migrateLegacyDefault,
    usesBackgroundTracking: usesBackgroundTracking,
    usesAutoEnd: usesAutoEnd,
    getStartButtonLabel: getStartButtonLabel,
    getEndButtonLabel: getEndButtonLabel,
    getSwitchExplanation: getSwitchExplanation,
  };
})(typeof window !== 'undefined' ? window : globalThis);
