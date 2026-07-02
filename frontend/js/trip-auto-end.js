/**
 * VITAL — Trip auto-end on prolonged inactivity (MP-045)
 * Own watchdog timer + wall-clock deadline. Does not rely on GPS firing while parked.
 */
(function (global) {
  'use strict';

  const DEFAULT_INACTIVITY_MS = 90 * 60 * 1000;
  const WATCHDOG_MS = 5000;
  const STORAGE_KEY = 'mp_auto_end_state';
  const LOG_KEY = 'mp_auto_end_logs';
  const LOG_MAX = 80;
  const LOG_PREFIX = '[MilePilot AutoEnd]';

  let memoryLogs = [];
  let tickCallback = null;
  let watchdogId = null;
  let deadlineId = null;

  function nowMs() {
    return Date.now();
  }

  function getInactivityMs() {
    try {
      const raw = localStorage.getItem('mp_debug_auto_end_ms');
      if (raw) {
        const n = Number(raw);
        if (n > 0) return n;
      }
    } catch (e) {}
    return DEFAULT_INACTIVITY_MS;
  }

  function log(msg, data) {
    const entry = { t: nowMs(), msg: msg, data: data || null };
    memoryLogs.push(entry);
    if (memoryLogs.length > LOG_MAX) memoryLogs.shift();
    if (typeof console !== 'undefined' && console.log) {
      console.log(LOG_PREFIX, msg, data !== undefined ? data : '');
    }
    try {
      const stored = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      stored.push(entry);
      while (stored.length > LOG_MAX) stored.shift();
      localStorage.setItem(LOG_KEY, JSON.stringify(stored));
    } catch (e) {}
  }

  function syncNative(payload) {
    try {
      if (
        global.MPExpoBridge &&
        typeof global.MPExpoBridge.post === 'function'
      ) {
        global.MPExpoBridge.post({ type: 'expo:autoend:sync', payload: payload || {} });
      }
    } catch (e) {}
  }

  function nativeSyncFromState(state) {
    if (!state) return;
    if (global.MPTrackingMode && !global.MPTrackingMode.usesBackgroundTracking()) return;
    syncNative({
      active: true,
      shiftId: state.shiftId,
      lastMovementAt: state.lastMovementAt,
      autoEndDeadlineAt: state.autoEndDeadlineAt,
      inactivityMs: getInactivityMs(),
    });
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function stopTimers() {
    if (watchdogId) {
      clearInterval(watchdogId);
      watchdogId = null;
    }
    if (deadlineId) {
      clearTimeout(deadlineId);
      deadlineId = null;
    }
  }

  function setTickCallback(fn) {
    tickCallback = typeof fn === 'function' ? fn : null;
  }

  function computeDeadline(lastMovementAt) {
    return lastMovementAt + getInactivityMs();
  }

  function scheduleDeadline() {
    if (deadlineId) {
      clearTimeout(deadlineId);
      deadlineId = null;
    }
    const state = loadState();
    if (!state || state.autoEndFired) return;
    const wait = Math.max(0, state.autoEndDeadlineAt - nowMs());
    log('Inactivity deadline scheduled', {
      waitSec: Math.floor(wait / 1000),
      deadlineISO: new Date(state.autoEndDeadlineAt).toISOString(),
    });
    deadlineId = setTimeout(function () {
      log('Inactivity deadline fired', {});
      checkInactivity(nowMs());
    }, wait);
  }

  function startWatchdog() {
    stopTimers();
    const state = loadState();
    if (!state || state.autoEndFired) return;
    scheduleDeadline();
    watchdogId = setInterval(function () {
      const s = loadState();
      if (!s || s.autoEndFired) {
        stopTimers();
        return;
      }
      const remaining = s.autoEndDeadlineAt - nowMs();
      if (remaining <= 0) {
        checkInactivity(nowMs());
      }
    }, WATCHDOG_MS);
    log('Watchdog started', { intervalSec: WATCHDOG_MS / 1000 });
  }

  function armState(shiftId, startedAt, lastMovementAt) {
    const t = lastMovementAt || startedAt || nowMs();
    const state = {
      shiftId: shiftId || 'shift_' + t,
      tripStartedAt: startedAt || t,
      lastMovementAt: t,
      autoEndDeadlineAt: computeDeadline(t),
      autoEndFired: false,
    };
    saveState(state);
    startWatchdog();
    return state;
  }

  function onTripStarted(shiftId, startedAt) {
    const state = armState(shiftId, startedAt, startedAt);
    log('Trip started — inactivity timer armed', {
      shiftId: state.shiftId,
      inactivitySec: Math.floor(getInactivityMs() / 1000),
    });
    nativeSyncFromState(state);
  }

  function onRestore(shiftId, lastMovementAt) {
    const existing = loadState();
    if (existing && existing.shiftId === shiftId && !existing.autoEndFired) {
      if (lastMovementAt && lastMovementAt > 0) {
        existing.lastMovementAt = lastMovementAt;
        existing.autoEndDeadlineAt = computeDeadline(lastMovementAt);
      }
      saveState(existing);
      startWatchdog();
      log('Trip restored — inactivity timer resumed', {
        shiftId: shiftId,
        idleSec: Math.floor((nowMs() - existing.lastMovementAt) / 1000),
        remainingSec: Math.floor((existing.autoEndDeadlineAt - nowMs()) / 1000),
      });
      nativeSyncFromState(existing);
      return;
    }
    onTripStarted(shiftId, lastMovementAt || nowMs());
  }

  function onMovementDetected(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return;
    const t = at || nowMs();
    const prev = state.lastMovementAt;
    state.lastMovementAt = t;
    state.autoEndDeadlineAt = computeDeadline(t);
    saveState(state);
    scheduleDeadline();
    log('Movement detected — inactivity timer reset', {
      idleWasSec: prev ? Math.floor((t - prev) / 1000) : 0,
      nextDeadlineSec: Math.floor(getInactivityMs() / 1000),
    });
    nativeSyncFromState(state);
  }

  function msUntilAutoEnd(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return null;
    return Math.max(0, state.autoEndDeadlineAt - (at || nowMs()));
  }

  function shouldAutoEnd(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return false;
    const t = at || nowMs();
    if (t >= state.autoEndDeadlineAt) {
      log('Inactivity threshold reached', {
        idleSec: Math.floor((t - state.lastMovementAt) / 1000),
        thresholdSec: Math.floor(getInactivityMs() / 1000),
      });
      return true;
    }
    return false;
  }

  function checkInactivity(at, onAutoEnd) {
    if (!shouldAutoEnd(at)) return false;
    const state = loadState();
    const t = at || nowMs();
    state.autoEndFired = true;
    saveState(state);
    stopTimers();
    log('Inactivity timer expired — auto-ending trip', {
      shiftId: state.shiftId,
      idleSec: Math.floor((t - state.lastMovementAt) / 1000),
      thresholdSec: Math.floor(getInactivityMs() / 1000),
    });
    const cb = onAutoEnd || tickCallback;
    if (typeof cb === 'function') {
      try {
        cb('auto');
      } catch (e) {
        log('Auto-end callback error', { error: String(e && e.message ? e.message : e) });
        state.autoEndFired = false;
        saveState(state);
        startWatchdog();
        return false;
      }
    } else {
      log('Auto-end callback missing — trip not ended', {});
      state.autoEndFired = false;
      saveState(state);
      startWatchdog();
      return false;
    }
    return true;
  }

  function onGpsTick(at) {
    return checkInactivity(at);
  }

  function onTripEnded(reason) {
    stopTimers();
    log('Trip ended', { reason: reason || 'unknown' });
    if (!global.MPTrackingMode || global.MPTrackingMode.usesBackgroundTracking()) {
      syncNative({ active: false });
    }
    clearState();
  }

  function getLastMovementAt() {
    const state = loadState();
    return state ? state.lastMovementAt : null;
  }

  function getDebugState(isActive) {
    const state = loadState();
    const t = nowMs();
    const threshold = getInactivityMs();
    const lastMove = state ? state.lastMovementAt : null;
    const countdown =
      state && state.autoEndDeadlineAt != null ? Math.max(0, state.autoEndDeadlineAt - t) : null;
    let storedLogs = [];
    try {
      storedLogs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    } catch (e) {}
    return {
      tripStatus: isActive ? 'active' : 'idle',
      moduleLoaded: true,
      watchdogActive: !!watchdogId,
      deadlineScheduled: !!deadlineId,
      inactivityThresholdMs: threshold,
      inactivityThresholdMin: threshold / 60000,
      lastMovementAt: lastMove,
      lastMovementISO: lastMove ? new Date(lastMove).toISOString() : null,
      lastMovementAgoSec: lastMove != null ? Math.floor((t - lastMove) / 1000) : null,
      autoEndDeadlineAt: state ? state.autoEndDeadlineAt : null,
      countdownMs: countdown,
      countdownSec: countdown != null ? Math.floor(countdown / 1000) : null,
      countdownMin: countdown != null ? Number((countdown / 60000).toFixed(2)) : null,
      autoEndFired: !!(state && state.autoEndFired),
      shiftId: state ? state.shiftId : null,
      recentLogs: memoryLogs.slice(-12).length ? memoryLogs.slice(-12) : storedLogs.slice(-12),
    };
  }

  function clearLogs() {
    memoryLogs = [];
    localStorage.removeItem(LOG_KEY);
  }

  global.MPTripAutoEnd = {
    DEFAULT_INACTIVITY_MS: DEFAULT_INACTIVITY_MS,
    getInactivityMs: getInactivityMs,
    setTickCallback: setTickCallback,
    onTripStarted: onTripStarted,
    onRestore: onRestore,
    onMovementDetected: onMovementDetected,
    onGpsTick: onGpsTick,
    checkInactivity: checkInactivity,
    shouldAutoEnd: shouldAutoEnd,
    msUntilAutoEnd: msUntilAutoEnd,
    onTripEnded: onTripEnded,
    getLastMovementAt: getLastMovementAt,
    getDebugState: getDebugState,
    clearLogs: clearLogs,
    log: log,
  };
})(typeof window !== 'undefined' ? window : globalThis);
