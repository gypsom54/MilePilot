/**
 * VITAL — Trip auto-end on prolonged inactivity (MP-045)
 * Timestamp-based checks run on every GPS sample (not only setInterval — survives lock screen).
 */
(function (global) {
  'use strict';

  const DEFAULT_INACTIVITY_MS = 90 * 60 * 1000;
  const MOVEMENT_SPEED_MPS = 0.9;
  const STORAGE_KEY = 'mp_auto_end_state';
  const LOG_KEY = 'mp_auto_end_logs';
  const LOG_MAX = 80;
  const LOG_PREFIX = '[MilePilot AutoEnd]';

  let memoryLogs = [];
  let tickCallback = null;

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

  function setTickCallback(fn) {
    tickCallback = typeof fn === 'function' ? fn : null;
  }

  function onTripStarted(shiftId, startedAt) {
    const t = startedAt || nowMs();
    const state = {
      shiftId: shiftId || 'shift_' + t,
      tripStartedAt: t,
      lastMovementAt: t,
      autoEndFired: false,
    };
    saveState(state);
    log('Trip started — inactivity timer armed', {
      shiftId: state.shiftId,
      inactivityMin: getInactivityMs() / 60000,
    });
  }

  function onRestore(shiftId, lastMovementAt) {
    const existing = loadState();
    if (existing && existing.shiftId === shiftId && !existing.autoEndFired) {
      if (lastMovementAt && lastMovementAt > 0) {
        existing.lastMovementAt = lastMovementAt;
      }
      saveState(existing);
      log('Trip restored — inactivity timer resumed', {
        shiftId: shiftId,
        idleSec: Math.floor((nowMs() - existing.lastMovementAt) / 1000),
      });
      return;
    }
    const t = lastMovementAt && lastMovementAt > 0 ? lastMovementAt : nowMs();
    onTripStarted(shiftId, t);
  }

  function onMovementDetected(at, speedMps) {
    const state = loadState();
    if (!state || state.autoEndFired) return;
    if (speedMps != null && speedMps >= 0 && speedMps < MOVEMENT_SPEED_MPS) {
      log('GPS drift ignored — not resetting inactivity timer', { speedMps: speedMps });
      return;
    }
    const t = at || nowMs();
    const prev = state.lastMovementAt;
    state.lastMovementAt = t;
    saveState(state);
    log('Movement detected — inactivity timer reset', {
      idleWasSec: prev ? Math.floor((t - prev) / 1000) : 0,
      speedMps: speedMps,
    });
  }

  function msUntilAutoEnd(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return null;
    const t = at || nowMs();
    return Math.max(0, getInactivityMs() - (t - state.lastMovementAt));
  }

  function shouldAutoEnd(at) {
    const state = loadState();
    if (!state || state.autoEndFired) return false;
    const t = at || nowMs();
    const idle = t - state.lastMovementAt;
    const threshold = getInactivityMs();
    if (idle >= threshold) {
      log('Inactivity threshold reached', {
        idleSec: Math.floor(idle / 1000),
        thresholdSec: Math.floor(threshold / 1000),
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
        return false;
      }
    } else {
      log('Auto-end callback missing — trip not ended', {});
      state.autoEndFired = false;
      saveState(state);
      return false;
    }
    return true;
  }

  function onGpsTick(at, onAutoEnd) {
    const state = loadState();
    if (!state || state.autoEndFired) return false;
    const remaining = msUntilAutoEnd(at);
    if (remaining != null && remaining <= 0) {
      return checkInactivity(at, onAutoEnd);
    }
    return false;
  }

  function onTripEnded(reason) {
    log('Trip ended', { reason: reason || 'unknown' });
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
    const countdown = lastMove != null ? Math.max(0, threshold - (t - lastMove)) : null;
    let storedLogs = [];
    try {
      storedLogs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    } catch (e) {}
    return {
      tripStatus: isActive ? 'active' : 'idle',
      inactivityThresholdMs: threshold,
      inactivityThresholdMin: threshold / 60000,
      lastMovementAt: lastMove,
      lastMovementISO: lastMove ? new Date(lastMove).toISOString() : null,
      lastMovementAgoSec: lastMove != null ? Math.floor((t - lastMove) / 1000) : null,
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
    MOVEMENT_SPEED_MPS: MOVEMENT_SPEED_MPS,
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
