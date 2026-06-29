/**
 * MilePilot Tracking Engine v3 — Never Miss A Trip
 * Auto-records journeys; classifies after motion stops (pending → business | personal).
 */
(function (global) {
  'use strict';

  const ENGINE_VERSION = 3;
  const STORAGE = { SHIFTS: 'mp_shifts', ACTIVE: 'mp_active_shift' };

  const ENGINE = {
    MIN_MOVE_M: 6,
    MAX_JUMP_M: 400,
    MAX_SPEED_MPS: 67,
    STOP_SPEED_MPS: 0.9,
    STOP_AFTER_MS: 90000,
    ROUTE_MAX: 500,
    ACC_MAX: 120,
    ACC_SOFT_MAX: 220,
    GPS_RECONNECT_MS: 15000,
    GPS_STALE_MS: 35000,
    BG_GPS_POLL_MS: 12000,
    NATIVE_SPEED_GATE_DT: 2,
    AUTO_START_SPEED_MPS: 4.47,
    AUTO_START_MS: 20000,
    MOTION_MIN_DURATION_MS: 18000,
    MOTION_MAGNITUDE_MIN: 11,
  };

  /** Auto-start recording on sustained motion — no pre-classification prompt. */
  const autoMotion = {
    enabled: true,
    candidateSince: null,
    motionCandidateSince: null,
    configure(opts) {
      if (opts && typeof opts.enabled === 'boolean') this.enabled = opts.enabled;
    },
    reset() {
      this.candidateSince = null;
      this.motionCandidateSince = null;
    },
    check(speedMps, now) {
      if (!this.enabled || state.activeTrip) return;
      now = now || Date.now();
      if (speedMps >= ENGINE.AUTO_START_SPEED_MPS) {
        if (!this.candidateSince) this.candidateSince = now;
        else if (now - this.candidateSince >= ENGINE.AUTO_START_MS) {
          this.candidateSince = null;
          ensureAutoTripStarted(now);
        }
      } else {
        this.candidateSince = null;
      }
    },
    checkDeviceMotion(magnitude, now) {
      if (!this.enabled || state.activeTrip) return;
      now = now || Date.now();
      if (magnitude >= ENGINE.MOTION_MAGNITUDE_MIN) {
        if (!this.motionCandidateSince) this.motionCandidateSince = now;
        else if (now - this.motionCandidateSince >= ENGINE.MOTION_MIN_DURATION_MS) {
          this.motionCandidateSince = null;
          ensureAutoTripStarted(now);
        }
      } else {
        this.motionCandidateSince = null;
      }
    },
  };

  let hooks = { onUpdate: null, onTripRecorded: null, claimRate: () => 0.55 };

  const SHIFT_STATUS = {
    IDLE: 'idle',
    TRACKING: 'tracking',
    ENDING: 'ending',
    SAVING: 'saving',
    COMPLETED: 'completed',
  };

  let state = {
    shiftStatus: SHIFT_STATUS.IDLE,
    businessMiles: 0,
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
    activeTrip: null,
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

  function syncMilesFromBusiness() {
    state.miles = state.businessMiles + getRecordingMiles();
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
      trips: raw.trips || [],
    };
  }

  function emit() {
    if (typeof hooks.onUpdate === 'function') hooks.onUpdate(getState());
  }

  function beginActiveTrip(now) {
    if (state.activeTrip) return state.activeTrip;
    now = now || Date.now();
    state.activeTrip = {
      id: 'trip_' + now,
      status: 'recording',
      miles: 0,
      movingSeconds: 0,
      routePoints: [],
      startedAt: now,
      startISO: new Date(now).toISOString(),
      startPoint: null,
    };
    state.currentJourneyMiles = 0;
    autoMotion.reset();
    emit();
    return state.activeTrip;
  }

  function ensureAutoTripStarted(now) {
    if (state.activeTrip) return true;
    if (state.shiftStatus !== SHIFT_STATUS.TRACKING) {
      startShift(state.vehicle);
    }
    beginActiveTrip(now);
    return true;
  }

  function buildPendingTripPayload(endP) {
    const trip = state.activeTrip;
    if (!trip) return null;
    const endMs = endP.t || Date.now();
    const route = downsampleRoute(trip.routePoints);
    const mi = Number(trip.miles.toFixed(2));
    const sec = Math.max(0, Math.round((endMs - trip.startedAt) / 1000));
    const startPt = trip.startPoint || (route[0] ? { lat: route[0].lat, lon: route[0].lon } : { lat: endP.lat, lon: endP.lon });
    return {
      id: trip.id,
      status: 'pending',
      miles: mi,
      seconds: sec,
      movingSeconds: Math.round(trip.movingSeconds),
      vehicle: state.vehicle,
      hmrc: 0,
      date: new Date(trip.startISO).toLocaleDateString('en-GB'),
      startISO: trip.startISO,
      endISO: new Date(endMs).toISOString(),
      route: route,
      routePoints: route,
      startLat: startPt.lat,
      startLon: startPt.lon,
      endLat: endP.lat,
      endLon: endP.lon,
      notes: '',
      shiftId: state.shiftId,
      aiSuggestion: null,
      createdAt: new Date().toISOString(),
      classifiedAt: null,
    };
  }

  function finalizeActiveTrip(endP) {
    if (!state.activeTrip) return null;
    const mi = state.activeTrip.miles;
    if (mi < 0.05) {
      state.activeTrip = null;
      state.currentJourneyMiles = 0;
      emit();
      return null;
    }
    const pendingTrip = buildPendingTripPayload(endP);
    state.activeTrip = null;
    state.currentJourneyMiles = 0;
    state.stopCandidateAt = null;
    state.stopCandidatePoint = null;
    autoMotion.reset();
    if (typeof hooks.onTripRecorded === 'function') hooks.onTripRecorded(pendingTrip);
    emit();
    return pendingTrip;
  }

  function addBusinessMiles(mi) {
    state.businessMiles += mi;
    syncMilesFromBusiness();
  }

  /** Native GPS can burst faster than 1 Hz — avoid false speed spikes when gating miles. */
  function movementSpeedMps(d, p, prev) {
    const dtSec = Math.max(0.001, (p.t - prev.t) / 1000);
    if (p.speedMps != null && p.speedMps >= 0 && isFinite(p.speedMps)) {
      return p.speedMps;
    }
    const gateDt = p.nativeGps ? Math.max(dtSec, ENGINE.NATIVE_SPEED_GATE_DT || 2) : dtSec;
    return d / gateDt;
  }

  function processGpsPoint(p) {
    if (state.shiftStatus !== SHIFT_STATUS.TRACKING) return getState();
    state.routePoints.push(p);
    state.lastGpsAt = p.t;
    state.gpsLossAt = null;
    const prev = state.lastPoint;
    if (prev) {
      const d = haversineM(prev, p);
      const dt = Math.max(0.001, (p.t - prev.t) / 1000);
      const speed = movementSpeedMps(d, p, prev);

      if (!state.activeTrip) {
        autoMotion.check(speed, p.t);
      }

      const recording = !!state.activeTrip;
      const validMove =
        d >= ENGINE.MIN_MOVE_M && d < ENGINE.MAX_JUMP_M && speed < ENGINE.MAX_SPEED_MPS;

      if (recording && validMove) {
        if (!state.activeTrip.startPoint) state.activeTrip.startPoint = { lat: prev.lat, lon: prev.lon };
        const mi = d / 1609.344;
        state.activeTrip.miles += mi;
        state.activeTrip.movingSeconds += Math.min(dt, 120);
        state.activeTrip.routePoints.push(p);
        state.currentJourneyMiles = state.activeTrip.miles;
        state.movingSeconds += Math.min(dt, 120);
        if (state.stopCandidateAt) {
          state.stopCandidateAt = null;
          state.stopCandidatePoint = null;
        }
      } else if (speed < ENGINE.STOP_SPEED_MPS && d < ENGINE.MIN_MOVE_M * 2) {
        if (!state.stopCandidateAt) {
          state.stopCandidateAt = p.t;
          state.stopCandidatePoint = p;
        } else if (p.t - state.stopCandidateAt >= ENGINE.STOP_AFTER_MS) {
          if (state.activeTrip) finalizeActiveTrip(p);
          else recordStop(p);
        }
      } else if (d >= ENGINE.MAX_JUMP_M) {
        state.stopCandidateAt = null;
        state.stopCandidatePoint = null;
      }
    } else if (!state.activeTrip) {
      autoMotion.check(0, p.t);
    }
    state.lastPoint = p;
    if (state.activeTrip && !state.activeTrip.routePoints.length) {
      state.activeTrip.routePoints.push(p);
    }
    return getState();
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
    autoMotion.reset();
  }

  function resetEngine() {
    state.shiftStops = [];
    state.stopCandidateAt = null;
    state.stopCandidatePoint = null;
    state.movingSeconds = 0;
    state.currentJourneyMiles = 0;
    state.gpsLossAt = null;
    state.lastGpsAt = null;
    state.activeTrip = null;
    autoMotion.reset();
  }

  function syncLegacyCcState() {
    state.ccState = state.shiftStatus === SHIFT_STATUS.TRACKING ? 'active' : 'idle';
  }

  function getShiftStatus() {
    return state.shiftStatus;
  }

  function isTracking() {
    return state.shiftStatus === SHIFT_STATUS.TRACKING;
  }

  function isShiftLive() {
    return (
      state.shiftStatus === SHIFT_STATUS.TRACKING ||
      state.shiftStatus === SHIFT_STATUS.ENDING ||
      state.shiftStatus === SHIFT_STATUS.SAVING
    );
  }

  function clearShiftRuntime() {
    state.businessMiles = 0;
    state.miles = 0;
    state.elapsed = 0;
    state.routePoints = [];
    state.lastPoint = null;
    resetEngine();
    state.shiftId = null;
    state.shiftStartedAt = null;
  }

  function getActiveShiftPayload() {
    return {
      engineVersion: ENGINE_VERSION,
      shiftStatus: state.shiftStatus,
      shiftId: state.shiftId || 'shift_' + state.shiftStartedAt,
      startedAt: state.shiftStartedAt,
      miles: state.miles,
      businessMiles: state.businessMiles,
      elapsed: state.elapsed,
      movingSeconds: state.movingSeconds,
      currentJourneyMiles: state.currentJourneyMiles,
      routePoints: downsampleRoute(state.routePoints),
      stops: state.shiftStops,
      lastPoint: state.lastPoint,
      vehicle: state.vehicle,
      activeTrip: state.activeTrip,
    };
  }

  function restoreEngineFromPayload(s) {
    state.shiftStops = s.stops || [];
    state.movingSeconds = Number(s.movingSeconds) || 0;
    state.currentJourneyMiles = Number(s.currentJourneyMiles) || 0;
    state.businessMiles = Number(s.businessMiles) || Number(s.miles) || 0;
    state.miles = state.businessMiles;
    state.shiftId = s.shiftId || null;
    state.activeTrip = s.activeTrip || null;
    state.stopCandidateAt = null;
    state.stopCandidatePoint = null;
  }

  function buildCompletedShift(claimFn) {
    if (state.activeTrip && state.lastPoint) {
      finalizeActiveTrip(state.lastPoint);
    } else if (state.activeTrip && state.activeTrip.miles >= 0.05) {
      finalizeActiveTrip(state.lastPoint || { lat: 0, lon: 0, t: Date.now() });
    }
    if (state.stopCandidateAt && state.lastPoint) recordStop(state.lastPoint);
    const route = downsampleRoute(state.routePoints);
    const mi = Number(state.businessMiles.toFixed(2));
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
    state.shiftStatus = SHIFT_STATUS.TRACKING;
    syncLegacyCcState();
    state.businessMiles = 0;
    state.miles = 0;
    state.elapsed = 0;
    state.routePoints = [];
    state.lastPoint = null;
    resetEngine();
    state.shiftId = 'shift_' + Date.now();
    state.shiftStartedAt = Date.now();
    state.vehicle = vehicle || state.vehicle || 'car';
    beginActiveTrip(state.shiftStartedAt);
    saveActiveShift();
    emit();
    return getState();
  }

  function applyClassifiedTripMiles(mi, status) {
    if (status === 'business' && mi > 0) addBusinessMiles(mi);
    emit();
  }

  function getRecordingMiles() {
    return state.activeTrip ? state.activeTrip.miles : 0;
  }

  function requestEndShift() {
    if (state.shiftStatus !== SHIFT_STATUS.TRACKING) return false;
    state.shiftStatus = SHIFT_STATUS.ENDING;
    syncLegacyCcState();
    emit();
    return true;
  }

  function cancelEndShift() {
    if (state.shiftStatus !== SHIFT_STATUS.ENDING) return false;
    state.shiftStatus = SHIFT_STATUS.TRACKING;
    syncLegacyCcState();
    emit();
    return true;
  }

  function completeShift(claimFn) {
    if (
      state.shiftStatus !== SHIFT_STATUS.TRACKING &&
      state.shiftStatus !== SHIFT_STATUS.ENDING &&
      state.shiftStatus !== SHIFT_STATUS.SAVING
    ) {
      return null;
    }
    state.shiftStatus = SHIFT_STATUS.SAVING;
    syncLegacyCcState();
    emit();
    const shift = buildCompletedShift(claimFn);
    clearShiftRuntime();
    state.shiftStatus = SHIFT_STATUS.COMPLETED;
    syncLegacyCcState();
    emit();
    return shift;
  }

  function acknowledgeShiftComplete() {
    if (state.shiftStatus !== SHIFT_STATUS.COMPLETED) return false;
    clearShiftRuntime();
    state.shiftStatus = SHIFT_STATUS.IDLE;
    syncLegacyCcState();
    emit();
    return true;
  }

  function forceIdle() {
    clearShiftRuntime();
    state.shiftStatus = SHIFT_STATUS.IDLE;
    syncLegacyCcState();
    emit();
    return true;
  }

  function endShift(claimFn) {
    if (state.shiftStatus === SHIFT_STATUS.TRACKING) requestEndShift();
    return completeShift(claimFn);
  }

  function restoreActive(s) {
    if (!s || !s.startedAt) return false;
    state.shiftStatus = SHIFT_STATUS.TRACKING;
    syncLegacyCcState();
    state.shiftStartedAt = s.startedAt;
    state.businessMiles = Number(s.businessMiles) || Number(s.miles) || 0;
    state.miles = state.businessMiles;
    state.elapsed = Math.floor((Date.now() - state.shiftStartedAt) / 1000);
    state.routePoints = s.routePoints || [];
    state.lastPoint = s.lastPoint || null;
    state.vehicle = s.vehicle || state.vehicle;
    restoreEngineFromPayload(s);
    emit();
    return true;
  }

  function tickElapsed() {
    if (state.shiftStatus !== SHIFT_STATUS.TRACKING || !state.shiftStartedAt) return state.elapsed;
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
    if (state.shiftStatus !== SHIFT_STATUS.TRACKING) return true;
    try {
      localStorage.setItem(STORAGE.ACTIVE, JSON.stringify(getActiveShiftPayload()));
      return true;
    } catch (e) {
      try {
        const p = getActiveShiftPayload();
        p.routePoints = downsampleRoute(state.routePoints, 150);
        if (p.activeTrip && p.activeTrip.routePoints) {
          p.activeTrip.routePoints = downsampleRoute(p.activeTrip.routePoints, 80);
        }
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

  function simulateMovement(totalMiles, startLat, startLon) {
    if (state.shiftStatus !== SHIFT_STATUS.TRACKING) return getState();
    ensureAutoTripStarted(Date.now());
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
    syncLegacyCcState();
    syncMilesFromBusiness();
    return {
      shiftStatus: state.shiftStatus,
      ccState: state.ccState,
      miles: state.miles,
      businessMiles: state.businessMiles,
      recordingMiles: getRecordingMiles(),
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
      activeTrip: state.activeTrip,
      isRecordingTrip: !!state.activeTrip,
    };
  }

  function applyExternal(patch) {
    Object.keys(patch).forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(state, k)) state[k] = patch[k];
    });
  }

  function init(opts) {
    hooks.onUpdate = opts && opts.onUpdate;
    hooks.onTripRecorded = opts && opts.onTripRecorded;
    if (opts && opts.claimRate) hooks.claimRate = opts.claimRate;
    if (opts && opts.autoMotion) autoMotion.configure(opts.autoMotion);
  }

  global.MPTracking = {
    ENGINE_VERSION: ENGINE_VERSION,
    ENGINE: ENGINE,
    STORAGE: STORAGE,
    SHIFT_STATUS: SHIFT_STATUS,
    autoMotion: autoMotion,
    init: init,
    getState: getState,
    getShiftStatus: getShiftStatus,
    isTracking: isTracking,
    isShiftLive: isShiftLive,
    applyExternal: applyExternal,
    startShift: startShift,
    ensureAutoTripStarted: ensureAutoTripStarted,
    finalizeActiveTrip: finalizeActiveTrip,
    applyClassifiedTripMiles: applyClassifiedTripMiles,
    requestEndShift: requestEndShift,
    cancelEndShift: cancelEndShift,
    completeShift: completeShift,
    acknowledgeShiftComplete: acknowledgeShiftComplete,
    forceIdle: forceIdle,
    endShift: endShift,
    restoreActive: restoreActive,
    tickElapsed: tickElapsed,
    processGpsPoint: processGpsPoint,
    processPoint: processGpsPoint,
    checkMovement: function (speedMps, now) {
      autoMotion.check(speedMps, now || Date.now());
    },
    checkDeviceMotion: function (magnitude, now) {
      autoMotion.checkDeviceMotion(magnitude, now || Date.now());
    },
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
      return isTracking();
    },
  };
})(typeof window !== 'undefined' ? window : global);
