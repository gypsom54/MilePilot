/**
 * MP-047 — AutoPilot Motion Detection
 * Orchestration layer above the locked v1.0 tracking engine.
 * Detects likely driving and calls startShiftCommandCentre — never replaces GPS math.
 */
(function (global) {
  'use strict';

  const STATES = {
    OFF: 'OFF',
    PERMISSION_REQUIRED: 'PERMISSION_REQUIRED',
    ARMED: 'ARMED',
    MOVING_CANDIDATE: 'MOVING_CANDIDATE',
    TRACKING: 'TRACKING',
    IDLE_CANDIDATE: 'IDLE_CANDIDATE',
    ENDING: 'ENDING',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
  };

  const STORAGE = {
    ENABLED: 'mp_autopilot_motion_enabled',
    AUTO_BUSINESS: 'mp_autopilot_auto_business',
    IDLE_MS: 'mp_autopilot_idle_ms',
    LAST_STATE: 'mp_autopilot_last_state',
    LOG: 'mp_autopilot_debug_log',
  };

  const DEFAULTS = {
    DRIVING_SPEED_MPS: 4.47, // ~10 mph
    SUSTAINED_MS: 10000, // ~10 seconds — fast auto-start (was 2 min)
    MAX_START_ACCURACY_M: 80,
    WALKING_MAX_MPS: 2.2,
    MIN_CANDIDATE_SAMPLES: 2,
    CONFIDENCE_THRESHOLD: 0.58,
    IDLE_MS: 90 * 60 * 1000,
    NOTIF_COOLDOWN_MS: 15 * 60 * 1000,
    MAX_LOG: 80,
  };

  let deps = null;
  let state = STATES.OFF;
  let candidateStartedAt = 0;
  let candidateSamples = 0;
  let candidateConfidence = 0;
  let candidateRoute = [];
  let lastSample = null;
  let tripStartedAt = null;
  let tripEndedAt = null;
  let reportSentAt = null;
  let lastNotifAt = 0;
  let armedWatchId = null;
  let syncTimer = null;
  let motionActivity = 'unknown';
  let lastError = null;
  let lastAutoStartBlock = null;
  let autopilotTripId = null;

  function log(msg, detail) {
    const entry = {
      t: new Date().toISOString(),
      state: state,
      msg: msg,
      detail: detail || null,
    };
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE.LOG) || '[]');
      raw.push(entry);
      while (raw.length > DEFAULTS.MAX_LOG) raw.shift();
      localStorage.setItem(STORAGE.LOG, JSON.stringify(raw));
    } catch (e) {}
    if (deps && deps.onLog) deps.onLog(entry);
    if (global.console && global.console.log) {
      global.console.log('[MilePilot AutoPilot]', msg, detail || '');
    }
  }

  function setState(next, reason) {
    if (state === next) return;
    const prev = state;
    state = next;
    try {
      localStorage.setItem(STORAGE.LAST_STATE, next);
    } catch (e) {}
    log('State ' + prev + ' → ' + next, reason || null);
    if (deps && deps.onStateChange) deps.onStateChange(prev, next, reason);
  }

  function isEnabled() {
    if (!deps || typeof deps.isEnabled !== 'function') return false;
    return !!deps.isEnabled();
  }

  function isShiftActive() {
    return deps && typeof deps.isShiftActive === 'function' && deps.isShiftActive();
  }

  function getAutoBusiness() {
    try {
      return localStorage.getItem(STORAGE.AUTO_BUSINESS) !== '0';
    } catch (e) {
      return true;
    }
  }

  function setAutoBusiness(on) {
    try {
      localStorage.setItem(STORAGE.AUTO_BUSINESS, on ? '1' : '0');
    } catch (e) {}
  }

  function getIdleMs() {
    try {
      const raw = Number(localStorage.getItem(STORAGE.IDLE_MS));
      if (raw >= 5 * 60 * 1000) return raw;
    } catch (e) {}
    if (global.MPTripAutoEnd && typeof global.MPTripAutoEnd.getInactivityMs === 'function') {
      return global.MPTripAutoEnd.getInactivityMs();
    }
    return DEFAULTS.IDLE_MS;
  }

  function getSustainedMs() {
    return DEFAULTS.SUSTAINED_MS;
  }

  function setIdleMs(ms) {
    try {
      localStorage.setItem(STORAGE.IDLE_MS, String(ms));
    } catch (e) {}
  }

  function isMotionEnabled() {
    try {
      const raw = localStorage.getItem(STORAGE.ENABLED);
      if (raw === '0') return false;
      if (raw === '1') return true;
    } catch (e) {}
    return true;
  }

  function setMotionEnabled(on) {
    try {
      localStorage.setItem(STORAGE.ENABLED, on ? '1' : '0');
    } catch (e) {}
    syncLifecycle();
  }

  function mph(mps) {
    return mps != null ? mps * 2.23694 : null;
  }

  function kmh(mps) {
    return mps != null ? mps * 3.6 : null;
  }

  function calcSpeedMps(sample, prev) {
    if (sample.speedMps != null && sample.speedMps >= 0) return sample.speedMps;
    if (!prev || !sample.lat || !prev.lat) return 0;
    const R = 6371000;
    const rad = Math.PI / 180;
    const dLat = (sample.lat - prev.lat) * rad;
    const dLon = (sample.lon - prev.lon) * rad;
    const la1 = prev.lat * rad;
    const la2 = sample.lat * rad;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    const dt = Math.max(0.001, (sample.t - prev.t) / 1000);
    return d / dt;
  }

  function isPoorGps(acc) {
    return acc == null || acc >= 999 || acc > DEFAULTS.MAX_START_ACCURACY_M;
  }

  function isWalkingSpeed(speedMps) {
    return speedMps > 0.3 && speedMps < DEFAULTS.WALKING_MAX_MPS;
  }

  function isDrivingSpeed(speedMps) {
    return speedMps >= DEFAULTS.DRIVING_SPEED_MPS;
  }

  function computeConfidence(speedMps, acc, sustainedMs) {
    let score = 0;
    if (isDrivingSpeed(speedMps)) score += 0.45;
    else if (speedMps >= DEFAULTS.DRIVING_SPEED_MPS * 0.85) score += 0.25;
    if (!isPoorGps(acc)) score += 0.25;
    else score -= 0.2;
    const sustainedTarget = getSustainedMs();
    if (sustainedMs >= sustainedTarget) score += 0.25;
    else score += (sustainedMs / sustainedTarget) * 0.15;
    if (motionActivity === 'automotive' || motionActivity === 'driving') score += 0.1;
    if (isWalkingSpeed(speedMps)) score -= 0.35;
    return Math.max(0, Math.min(1, score));
  }

  function resetCandidate(reason) {
    candidateStartedAt = 0;
    candidateSamples = 0;
    candidateConfidence = 0;
    candidateRoute = [];
    if (state === STATES.MOVING_CANDIDATE) setState(STATES.ARMED, reason || 'candidate_reset');
  }

  function pushCandidateSample(sample, speedMps) {
    if (!sample || sample.lat == null || sample.lon == null) return;
    candidateRoute.push({
      lat: sample.lat,
      lon: sample.lon,
      acc: sample.acc != null ? sample.acc : 999,
      t: sample.t || Date.now(),
      speedMps: speedMps != null ? speedMps : sample.speedMps,
    });
  }

  function permissionsOk() {
    if (!deps || typeof deps.hasPermissions !== 'function') return false;
    return !!deps.hasPermissions();
  }

  function batteryOk() {
    if (!deps || typeof deps.isBatteryOk !== 'function') return true;
    return deps.isBatteryOk();
  }

  function canNotify(kind) {
    const now = Date.now();
    if (now - lastNotifAt < DEFAULTS.NOTIF_COOLDOWN_MS && kind !== 'started' && kind !== 'report') return false;
    return true;
  }

  function notify(kind, title, body) {
    if (!canNotify(kind)) return;
    lastNotifAt = Date.now();
    if (deps && typeof deps.onNotify === 'function') {
      deps.onNotify({ kind: kind, title: title, body: body });
    }
  }

  function stopArmedWatch() {
    if (armedWatchId != null && deps && typeof deps.stopArmedWatch === 'function') {
      deps.stopArmedWatch(armedWatchId);
    }
    armedWatchId = null;
  }

  async function armMonitoring() {
    if (!isEnabled() || !isMotionEnabled() || isShiftActive()) return;
    if (!permissionsOk()) {
      setState(STATES.PERMISSION_REQUIRED, 'missing_permissions');
      return;
    }
    if (!batteryOk()) {
      setState(STATES.ERROR, 'battery_saver');
      lastError = 'Battery saver may prevent reliable AutoPilot';
      return;
    }
    setState(STATES.ARMED, 'monitoring_armed');
    lastError = null;
    if (deps && typeof deps.startArmedWatch === 'function') {
      armedWatchId = deps.startArmedWatch(function (sample) {
        onGpsSample(sample);
      });
    }
    if (deps && typeof deps.seedArmedGps === 'function') {
      try {
        deps.seedArmedGps();
      } catch (e) {}
    }
    if (deps && typeof deps.armNative === 'function') {
      deps.armNative()
        .then(function (armed) {
          if (!armed) log('armNative returned false', 'native_gps_not_started');
        })
        .catch(function (e) {
          log('armNative failed', e.message || String(e));
        });
    }
  }

  async function disarmMonitoring() {
    stopArmedWatch();
    if (deps && typeof deps.disarmNative === 'function') {
      try {
        await deps.disarmNative();
      } catch (e) {}
    }
    resetCandidate('disarm');
    if (state !== STATES.TRACKING && state !== STATES.ENDING) {
      setState(STATES.OFF, 'disarmed');
    }
  }

  function syncLifecycle() {
    if (!isEnabled() || !isMotionEnabled()) {
      disarmMonitoring();
      return;
    }
    if (isShiftActive()) {
      if (state !== STATES.TRACKING && state !== STATES.ENDING) {
        setState(STATES.TRACKING, 'shift_active');
      }
      return;
    }
    if (state === STATES.TRACKING || state === STATES.ENDING) {
      setState(STATES.ARMED, 'shift_ended');
      tripEndedAt = Date.now();
    }
    if (state === STATES.OFF || state === STATES.COMPLETED || state === STATES.ERROR) {
      armMonitoring();
    } else if (state === STATES.PERMISSION_REQUIRED && permissionsOk()) {
      armMonitoring();
    }
  }

  function tryAutoStart(confidence) {
    if (isShiftActive()) {
      lastAutoStartBlock = 'shift_already_active';
      return false;
    }
    if (!deps || typeof deps.canStartTrip !== 'function' || !deps.canStartTrip()) {
      lastAutoStartBlock = 'subscription_or_access';
      log('Auto-start blocked', lastAutoStartBlock);
      return false;
    }
    if (confidence < DEFAULTS.CONFIDENCE_THRESHOLD) {
      lastAutoStartBlock = 'confidence_low';
      return false;
    }
    if (deps && typeof deps.isDuplicateStart === 'function' && deps.isDuplicateStart()) {
      lastAutoStartBlock = 'duplicate_start';
      return false;
    }
    lastAutoStartBlock = null;

    setState(STATES.ENDING, 'starting_trip');
    const startMeta = {
      confidence: confidence,
      sample: lastSample,
      candidateStartedAt: candidateStartedAt,
      candidateRoute: candidateRoute.slice(),
    };
    candidateStartedAt = 0;
    candidateSamples = 0;
    candidateRoute = [];

    let started = false;
    try {
      if (typeof deps.onAutoStart === 'function') {
        started = !!deps.onAutoStart(startMeta);
      }
    } catch (e) {
      lastError = e.message || String(e);
      setState(STATES.ERROR, 'start_failed');
      return false;
    }

    if (!started) {
      lastAutoStartBlock = 'onAutoStart_declined';
      log('Auto-start declined', lastAutoStartBlock);
      setState(STATES.ARMED, 'start_declined');
      return false;
    }

    lastAutoStartBlock = null;
    autopilotTripId = 'autopilot_' + Date.now();
    tripStartedAt = Date.now();
    tripEndedAt = null;
    reportSentAt = null;
    setState(STATES.TRACKING, 'auto_started');
    notify('started', 'AutoPilot', 'AutoPilot started tracking your journey.');
    if (global.MPIntelligence && typeof global.MPIntelligence.recordSignal === 'function') {
      global.MPIntelligence.recordSignal('autopilot_auto_start', { confidence: confidence });
    }
    return true;
  }

  function onGpsSample(sample) {
    if (!sample || sample.lat == null || sample.lon == null) return;
    if (!isEnabled() || !isMotionEnabled()) return;

    const prev = lastSample;
    lastSample = {
      lat: sample.lat,
      lon: sample.lon,
      acc: sample.acc != null ? sample.acc : 999,
      t: sample.t || Date.now(),
      speedMps: sample.speedMps,
      motion: sample.motion || motionActivity,
    };

    if (isShiftActive()) {
      if (state !== STATES.TRACKING) setState(STATES.TRACKING, 'shift_detected');
      return;
    }

    if (state === STATES.OFF || state === STATES.COMPLETED) {
      syncLifecycle();
    }

    if (state === STATES.PERMISSION_REQUIRED) {
      if (permissionsOk()) armMonitoring();
      else return;
    }

    if (state === STATES.OFF || state === STATES.COMPLETED) return;

    if (state !== STATES.ARMED && state !== STATES.MOVING_CANDIDATE) return;

    const speedMps = calcSpeedMps(lastSample, prev);

    if (isPoorGps(lastSample.acc)) {
      resetCandidate('poor_gps');
      return;
    }

    if (isWalkingSpeed(speedMps)) {
      resetCandidate('walking');
      return;
    }

    if (!isDrivingSpeed(speedMps)) {
      if (state === STATES.MOVING_CANDIDATE && Date.now() - candidateStartedAt > 45000) {
        resetCandidate('speed_dropped');
      }
      return;
    }

    const now = sample.t || Date.now();
    if (!candidateStartedAt) {
      candidateStartedAt = now;
      candidateSamples = 1;
      candidateRoute = [];
      pushCandidateSample(lastSample, speedMps);
      setState(STATES.MOVING_CANDIDATE, 'driving_detected');
    } else {
      candidateSamples += 1;
      pushCandidateSample(lastSample, speedMps);
    }

    const sustainedMs = now - candidateStartedAt;
    candidateConfidence = computeConfidence(speedMps, lastSample.acc, sustainedMs);

    if (
      sustainedMs >= getSustainedMs() &&
      candidateSamples >= DEFAULTS.MIN_CANDIDATE_SAMPLES &&
      candidateConfidence >= DEFAULTS.CONFIDENCE_THRESHOLD
    ) {
      tryAutoStart(candidateConfidence);
    }
  }

  function onMotionActivity(activity) {
    motionActivity = activity || 'unknown';
  }

  function onTripStarted(meta) {
    tripStartedAt = Date.now();
    tripEndedAt = null;
    autopilotTripId = (meta && meta.tripId) || autopilotTripId;
    setState(STATES.TRACKING, meta && meta.manual ? 'manual_start' : 'trip_started');
    stopArmedWatch();
  }

  function onTripEnded(endReason) {
    tripEndedAt = Date.now();
    setState(STATES.COMPLETED, endReason || 'ended');
    if (endReason === 'auto') {
      notify('ended', 'AutoPilot', 'Journey ended automatically after 90 minutes idle.');
    }
    setTimeout(function () {
      syncLifecycle();
    }, 1500);
  }

  function onReportSent() {
    reportSentAt = Date.now();
    notify('report', 'AutoPilot', 'Your daily mileage report has been sent.');
  }

  function getTripStatusForSave() {
    return getAutoBusiness() ? 'business' : 'pending';
  }

  function getDebugState() {
    const autoEnd =
      typeof global.MPTripAutoEnd !== 'undefined'
        ? global.MPTripAutoEnd.getDebugState(isShiftActive())
        : {};
    return {
      state: state,
      enabled: isEnabled(),
      motionEnabled: isMotionEnabled(),
      autoBusiness: getAutoBusiness(),
      idleMs: getIdleMs(),
      lastSpeedMps: lastSample ? calcSpeedMps(lastSample, null) : null,
      lastSpeedMph: lastSample ? mph(calcSpeedMps(lastSample, null)) : null,
      lastAccuracyM: lastSample ? lastSample.acc : null,
      motionActivity: motionActivity,
      candidateConfidence: candidateConfidence,
      candidateSustainedSec: candidateStartedAt ? Math.round((Date.now() - candidateStartedAt) / 1000) : 0,
      idleCountdownSec: autoEnd.countdownSec,
      idleAgoSec: autoEnd.lastMovementAgoSec,
      shiftActive: isShiftActive(),
      permissionsOk: permissionsOk(),
      batteryOk: batteryOk(),
      lastGpsAt: lastSample ? lastSample.t : null,
      tripStartedAt: tripStartedAt,
      tripEndedAt: tripEndedAt,
      reportSentAt: reportSentAt,
      lastError: lastError,
      lastAutoStartBlock: lastAutoStartBlock,
      sustainedThresholdSec: Math.round(getSustainedMs() / 1000),
      minCandidateSamples: DEFAULTS.MIN_CANDIDATE_SAMPLES,
      confidenceThreshold: DEFAULTS.CONFIDENCE_THRESHOLD,
      autopilotTripId: autopilotTripId,
    };
  }

  function getLog() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.LOG) || '[]');
    } catch (e) {
      return [];
    }
  }

  function clearLog() {
    try {
      localStorage.removeItem(STORAGE.LOG);
    } catch (e) {}
  }

  function init(dependencies) {
    deps = dependencies || {};
    try {
      const saved = localStorage.getItem(STORAGE.LAST_STATE);
      if (saved && STATES[saved]) state = saved;
    } catch (e) {}
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(syncLifecycle, 30000);
    syncLifecycle();
    log('AutoPilot motion detection ready');
  }

  function destroy() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = null;
    disarmMonitoring();
    deps = null;
  }

  global.MPAutoPilotMotion = {
    STATES: STATES,
    STORAGE: STORAGE,
    DEFAULTS: DEFAULTS,
    init: init,
    destroy: destroy,
    syncLifecycle: syncLifecycle,
    armMonitoring: armMonitoring,
    disarmMonitoring: disarmMonitoring,
    onGpsSample: onGpsSample,
    onMotionActivity: onMotionActivity,
    onTripStarted: onTripStarted,
    onTripEnded: onTripEnded,
    onReportSent: onReportSent,
    getState: function () {
      return state;
    },
    getDebugState: getDebugState,
    getLog: getLog,
    clearLog: clearLog,
    isMotionEnabled: isMotionEnabled,
    setMotionEnabled: setMotionEnabled,
    getAutoBusiness: getAutoBusiness,
    setAutoBusiness: setAutoBusiness,
    getIdleMs: getIdleMs,
    setIdleMs: setIdleMs,
    getSustainedMs: getSustainedMs,
    getTripStatusForSave: getTripStatusForSave,
    isDrivingSpeed: isDrivingSpeed,
    computeConfidence: computeConfidence,
    mph: mph,
    kmh: kmh,
  };
})(typeof window !== 'undefined' ? window : globalThis);
