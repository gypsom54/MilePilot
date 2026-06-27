/**
 * MilePilot Tracking Engine v2 (MP-013)
 * Single source of truth for shift lifecycle, GPS mileage, and persistence.
 */
(function (global) {
  'use strict';

  const ENGINE_VERSION = 2;
  const STORAGE = { SHIFTS: 'mp_shifts', ACTIVE: 'mp_active_shift' };

  const ENGINE = {
    MIN_MOVE_M: 6,
    MAX_JUMP_M: 400,
    MAX_SPEED_MPS: 67,
    STOP_SPEED_MPS: 0.9,
    STOP_AFTER_MS: 90000,
    ROUTE_MAX: 500,
    ACC_MAX: 120,
    GPS_RECONNECT_MS: 15000,
  };

  /** Smart movement detection — architecture only (disabled by default). */
  const movementDetection = {
    enabled: false,
    minSpeedMps: 4.47,
    minDurationMs: 45000,
    candidateSince: null,
    onPrompt: null,
    reset() {
      this.candidateSince = null;
    },
    configure(opts) {
      if (opts && typeof opts.enabled === 'boolean') this.enabled = opts.enabled;
      if (opts && typeof opts.onPrompt === 'function') this.onPrompt = opts.onPrompt;
    },
    check(speedMps, now) {
      if (!this.enabled || !this.onPrompt) return;
      if (speedMps >= this.minSpeedMps) {
        if (!this.candidateSince) this.candidateSince = now;
        else if (now - this.candidateSince >= this.minDurationMs) {
          this.candidateSince = null;
          this.onPrompt({
            message: "Looks like you're driving.\nStart tracking this as a business journey?",
            actions: ['track', 'ignore', 'personal'],
          });
        }
      } else {
        this.candidateSince = null;
      }
    },
    respond(action) {
      this.reset();
      return action;
    },
  };

  let hooks = { onUpdate: null, claimRate: () => 0.55 };

  let state = {
    ccState: 'idle',
    miles: 0,
    elapsed: 0,
    shiftStartedAt: null,
    shiftId: null,
    vehicle: 'car',
    routePoints: [],
    lastPoint: null,
    shiftStops: [],
    stopCandidateAt: null,
    stopCandidatePoint: null,
    movingSeconds: 0,
    currentJourneyMiles: 0,
    gpsLossAt: null,
    lastGpsAt: null,
  };

  function haversineM(a, b) {
    const R = 6371000;
    const rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad;
    const dLon = (b.lon - a.lon) * rad;
    const la1 = a.lat * rad;
    const la2 = b.lat * rad;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function downsampleRoute(pts, max) {
    max = max || ENGINE.ROUTE_MAX;
    if (!pts || !pts.length) return [];
    if (pts.length <= max) return pts.slice();
    const step = Math.ceil(pts.length / max);
    return pts.filter(function (_, i) {
      return i % step === 0 || i === pts.length - 1;
    });
  }

  function journeyCount(stops, miles) {
    const stopsLen = (stops && stops.length) || 0;
    if (stopsLen) return stopsLen + (miles > 0.05 ? 1 : 0);
    return miles > 0.05 ? 1 : 0;
  }

  function averageSpeedMph(miles, movingSeconds) {
    if (!miles || !movingSeconds) return 0;
    return Number(((miles / (movingSeconds / 3600)) || 0).toFixed(1));
  }

  function normaliseShift(raw, vehicleDefault, claimFn) {
    const v = raw.vehicle || vehicleDefault || 'car';
    const mi = Number(raw.miles) || 0;
    const sec = Number(raw.seconds) || 0;
    const mov = Number(raw.movingSeconds) || 0;
    const route = raw.route || raw.routePoints || raw.gpsPoints || [];
    const stops = raw.stops || [];
    const rate = typeof claimFn === 'function' ? claimFn(1, v) : 0.55;
    const hmrc = Number(raw.hmrc) || Number((mi * rate).toFixed(2));
    const startISO = raw.startISO || new Date().toISOString();
    const endISO = raw.endISO || startISO;
    const id = raw.id || 'shift_' + Date.now() + Math.random();
    return {
      id: id,
      miles: mi,
      seconds: sec,
      movingSeconds: mov,
      vehicle: v,
      hmrc: hmrc,
      date: raw.date || new Date(startISO).toLocaleDateString('en-GB'),
      startISO: startISO,
      endISO: endISO,
      route: route,
      gpsPoints: route,
      stops: stops,
      journeyCount: Number(raw.journeyCount) || journeyCount(stops, mi),
      averageSpeed: Number(raw.averageSpeed) || averageSpeedMph(mi, mov),
      createdAt: raw.createdAt || endISO,
      engineVersion: raw.engineVersion || ENGINE_VERSION,
    };
  }

  function emit() {
    if (typeof hooks.onUpdate === 'function') hooks.onUpdate(getState());
  }

  function recordStop(endP) {
    if (!state.stopCandidateAt) return;
    state.shiftStops.push({
      lat: (state.stopCandidatePoint && state.stopCandidatePoint.lat) != null ? state.stopCandidatePoint.lat : endP.lat,
      lon: (state.stopCandidatePoint && state.stopCandidatePoint.lon) != null ? state.stopCandidatePoint.lon : endP.lon,
      startISO: new Date(state.stopCandidateAt).toISOString(),
      endISO: new Date(endP.t).toISOString(),
    });
    state.stopCandidateAt = null;
    state.stopCandidatePoint = null;
    state.currentJourneyMiles = 0;
  }

  function processGpsPoint(p) {
    state.routePoints.push(p);
    state.lastGpsAt = p.t;
    state.gpsLossAt = null;
    const prev = state.lastPoint;
    if (prev) {
      const d = haversineM(prev, p);
      const dt = Math.max(0.001, (p.t - prev.t) / 1000);
      const speed = d / dt;
      movementDetection.check(speed, p.t);
      if (d >= ENGINE.MIN_MOVE_M && d < ENGINE.MAX_JUMP_M && speed < ENGINE.MAX_SPEED_MPS) {
        if (state.stopCandidateAt) recordStop(p);
        const mi = d / 1609.344;
        state.miles += mi;
        state.currentJourneyMiles += mi;
        state.movingSeconds += Math.min(dt, 120);
      } else if (speed < ENGINE.STOP_SPEED_MPS && d < ENGINE.MIN_MOVE_M * 2) {
        if (!state.stopCandidateAt) {
          state.stopCandidateAt = p.t;
          state.stopCandidatePoint = p;
        } else if (p.t - state.stopCandidateAt >= ENGINE.STOP_AFTER_MS) {
          recordStop(p);
        }
      } else if (d >= ENGINE.MAX_JUMP_M) {
        state.stopCandidateAt = null;
        state.stopCandidatePoint = null;
      }
    }
    state.lastPoint = p;
    return getState();
  }

  function resetEngine() {
    state.shiftStops = [];
    state.stopCandidateAt = null;
    state.stopCandidatePoint = null;
    state.movingSeconds = 0;
    state.currentJourneyMiles = 0;
    state.gpsLossAt = null;
    state.lastGpsAt = null;
    movementDetection.reset();
  }

  function getActiveShiftPayload() {
    return {
      engineVersion: ENGINE_VERSION,
      shiftId: state.shiftId || 'shift_' + state.shiftStartedAt,
      startedAt: state.shiftStartedAt,
      miles: state.miles,
      elapsed: state.elapsed,
      movingSeconds: state.movingSeconds,
      currentJourneyMiles: state.currentJourneyMiles,
      routePoints: downsampleRoute(state.routePoints),
      stops: state.shiftStops,
      lastPoint: state.lastPoint,
      vehicle: state.vehicle,
    };
  }

  function restoreEngineFromPayload(s) {
    state.shiftStops = s.stops || [];
    state.movingSeconds = Number(s.movingSeconds) || 0;
    state.currentJourneyMiles = Number(s.currentJourneyMiles) || 0;
    state.shiftId = s.shiftId || null;
    state.stopCandidateAt = null;
    state.stopCandidatePoint = null;
  }

  function buildCompletedShift(claimFn) {
    if (state.stopCandidateAt && state.lastPoint) recordStop(state.lastPoint);
    const route = downsampleRoute(state.routePoints);
    const mi = Number(state.miles.toFixed(2));
    const mov = Math.round(state.movingSeconds);
    return normaliseShift(
      {
        id: state.shiftId || 'shift_' + Date.now(),
        miles: mi,
        seconds: state.elapsed,
        movingSeconds: mov,
        vehicle: state.vehicle,
        hmrc: Number((claimFn ? claimFn(mi, state.vehicle) : mi * 0.55).toFixed(2)),
        date: new Date().toLocaleDateString('en-GB'),
        startISO: new Date(state.shiftStartedAt).toISOString(),
        endISO: new Date().toISOString(),
        route: route,
        stops: state.shiftStops.slice(),
        engineVersion: ENGINE_VERSION,
        createdAt: new Date().toISOString(),
      },
      state.vehicle,
      claimFn
    );
  }

  function startShift(vehicle) {
    state.miles = 0;
    state.elapsed = 0;
    state.routePoints = [];
    state.lastPoint = null;
    resetEngine();
    state.shiftId = 'shift_' + Date.now();
    state.shiftStartedAt = Date.now();
    state.vehicle = vehicle || state.vehicle || 'car';
    state.ccState = 'active';
    emit();
    return getState();
  }

  function endShift(claimFn) {
    const shift = buildCompletedShift(claimFn);
    state.ccState = 'idle';
    state.miles = 0;
    state.elapsed = 0;
    state.routePoints = [];
    state.lastPoint = null;
    resetEngine();
    state.shiftId = null;
    state.shiftStartedAt = null;
    emit();
    return shift;
  }

  function restoreActive(s) {
    if (!s || !s.startedAt) return false;
    state.ccState = 'active';
    state.shiftStartedAt = s.startedAt;
    state.miles = Number(s.miles) || 0;
    state.elapsed = Math.floor((Date.now() - state.shiftStartedAt) / 1000);
    state.routePoints = s.routePoints || [];
    state.lastPoint = s.lastPoint || null;
    state.vehicle = s.vehicle || state.vehicle;
    restoreEngineFromPayload(s);
    emit();
    return true;
  }

  function tickElapsed() {
    if (state.ccState !== 'active' || !state.shiftStartedAt) return state.elapsed;
    state.elapsed = Math.floor((Date.now() - state.shiftStartedAt) / 1000);
    return state.elapsed;
  }

  function markGpsLoss(now) {
    if (!state.gpsLossAt) state.gpsLossAt = now || Date.now();
  }

  function clearGpsLoss() {
    state.gpsLossAt = null;
  }

  function gpsLossMs(now) {
    if (!state.gpsLossAt) return 0;
    return (now || Date.now()) - state.gpsLossAt;
  }

  function saveActiveShift() {
    if (state.ccState !== 'active') return true;
    try {
      localStorage.setItem(STORAGE.ACTIVE, JSON.stringify(getActiveShiftPayload()));
      return true;
    } catch (e) {
      try {
        const p = getActiveShiftPayload();
        p.routePoints = downsampleRoute(state.routePoints, 150);
        localStorage.setItem(STORAGE.ACTIVE, JSON.stringify(p));
        return true;
      } catch (e2) {
        return false;
      }
    }
  }

  function clearActiveShift() {
    localStorage.removeItem(STORAGE.ACTIVE);
  }

  function loadActiveShiftRaw() {
    try {
      const raw = localStorage.getItem(STORAGE.ACTIVE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function loadShifts(vehicleDefault, claimFn) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.SHIFTS) || '[]').map(function (s) {
        return normaliseShift(s, vehicleDefault, claimFn);
      });
    } catch (e) {
      return [];
    }
  }

  function saveShifts(shifts) {
    try {
      localStorage.setItem(STORAGE.SHIFTS, JSON.stringify(shifts));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Dev/QA only — inject synthetic GPS movement for mileage testing. */
  function simulateMovement(totalMiles, startLat, startLon) {
    if (state.ccState !== 'active') return getState();
    const milesToAdd = Math.max(0, Number(totalMiles) || 0);
    if (!milesToAdd) return getState();
    const baseLat = startLat != null ? startLat : (state.lastPoint && state.lastPoint.lat) || 51.5072;
    const baseLon = startLon != null ? startLon : (state.lastPoint && state.lastPoint.lon) || -0.1276;
    const stepM = ENGINE.MIN_MOVE_M + 2;
    const totalM = milesToAdd * 1609.344;
    const steps = Math.max(1, Math.ceil(totalM / stepM));
    const latStep = stepM / 111320;
    let t = Date.now();
    if (!state.lastPoint) {
      processGpsPoint({ lat: baseLat, lon: baseLon, acc: 8, t: t - 1000 });
    }
    for (let i = 1; i <= steps; i++) {
      t += 2500;
      processGpsPoint({ lat: baseLat + latStep * i, lon: baseLon, acc: 8, t: t });
    }
    return getState();
  }

  function getState() {
    return {
      ccState: state.ccState,
      miles: state.miles,
      elapsed: state.elapsed,
      shiftStartedAt: state.shiftStartedAt,
      shiftId: state.shiftId,
      vehicle: state.vehicle,
      routePoints: state.routePoints,
      lastPoint: state.lastPoint,
      shiftStops: state.shiftStops.slice(),
      movingSeconds: state.movingSeconds,
      currentJourneyMiles: state.currentJourneyMiles,
      journeyCount: journeyCount(state.shiftStops, state.miles),
      gpsLossAt: state.gpsLossAt,
      lastGpsAt: state.lastGpsAt,
    };
  }

  function applyExternal(patch) {
    Object.keys(patch).forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(state, k)) state[k] = patch[k];
    });
  }

  function init(opts) {
    hooks.onUpdate = opts && opts.onUpdate;
    if (opts && opts.claimRate) hooks.claimRate = opts.claimRate;
    if (opts && opts.movementDetection) movementDetection.configure(opts.movementDetection);
    document.addEventListener('visibilitychange', function () {
      if (state.ccState === 'active') saveActiveShift();
    });
    window.addEventListener('pagehide', function () {
      if (state.ccState === 'active') saveActiveShift();
    });
  }

  global.MPTracking = {
    ENGINE_VERSION: ENGINE_VERSION,
    ENGINE: ENGINE,
    STORAGE: STORAGE,
    movementDetection: movementDetection,
    init: init,
    getState: getState,
    applyExternal: applyExternal,
    startShift: startShift,
    endShift: endShift,
    restoreActive: restoreActive,
    tickElapsed: tickElapsed,
    processGpsPoint: processGpsPoint,
    processPoint: processGpsPoint,
    recordStop: recordStop,
    resetEngine: resetEngine,
    getActiveShiftPayload: getActiveShiftPayload,
    saveActiveShift: saveActiveShift,
    clearActiveShift: clearActiveShift,
    loadActiveShiftRaw: loadActiveShiftRaw,
    loadShifts: loadShifts,
    saveShifts: saveShifts,
    normaliseShift: normaliseShift,
    downsampleRoute: downsampleRoute,
    distance: haversineM,
    journeyCount: journeyCount,
    averageSpeedMph: averageSpeedMph,
    markGpsLoss: markGpsLoss,
    clearGpsLoss: clearGpsLoss,
    gpsLossMs: gpsLossMs,
    buildCompletedShift: buildCompletedShift,
    simulateMovement: simulateMovement,
    isActive: function () {
      return state.ccState === 'active';
    },
  };
})(typeof window !== 'undefined' ? window : global);
