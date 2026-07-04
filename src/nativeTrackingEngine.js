/**
 * MP-043 Native Tracking Engine
 * Authoritative mileage calculation for TestFlight — runs when WebView is suspended.
 * Persists trip state to device storage on every GPS update.
 */
import * as FileSystem from 'expo-file-system';
import { onNativeBackgroundLocation } from './nativeAutoEnd';

const STATE_PATH = `${FileSystem.documentDirectory}milepilot_native_trip.json`;
const DEBUG_PATH = `${FileSystem.documentDirectory}milepilot_tracking_debug.json`;

const ENGINE = {
  MIN_MOVE_M: 6,
  MAX_JUMP_M: 400,
  MAX_SPEED_MPS: 67,
  STOP_SPEED_MPS: 0.9,
  STOP_AFTER_MS: 90000,
  ROUTE_MAX: 500,
  ACC_MAX: 120,
  ACC_SOFT_MAX: 220,
  NATIVE_SPEED_GATE_DT: 2,
};

const emptyTrip = () => ({
  active: false,
  shiftId: null,
  startedAt: null,
  vehicle: 'car',
  miles: 0,
  movingSeconds: 0,
  pendingMeters: 0,
  routePoints: [],
  lastPoint: null,
  shiftStops: [],
  stopCandidateAt: null,
  stopCandidatePoint: null,
  lastMileRecordedAt: null,
  gpsPointCount: 0,
  lastGpsAt: null,
  lastGpsLat: null,
  lastGpsLon: null,
  lastGpsAcc: null,
  lastBackgroundUpdateAt: null,
  lastForegroundUpdateAt: null,
  lastPersistAt: null,
  lastError: null,
});

let trip = emptyTrip();
let appInBackground = false;
let debugMeta = {
  permissionStatus: 'unknown',
  backgroundActive: false,
  appState: 'unknown',
  lastSource: null,
  errors: [],
};

function logError(msg, detail) {
  const entry = { t: new Date().toISOString(), msg, detail: detail || null };
  debugMeta.errors.push(entry);
  if (debugMeta.errors.length > 100) debugMeta.errors.shift();
  trip.lastError = msg;
  console.error('[MilePilot NativeEngine]', msg, detail || '');
}

export function setNativeAppBackground(active) {
  appInBackground = !!active;
}

export function isNativeAppBackground() {
  return appInBackground;
}

export function distanceMeters(a, b) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const la1 = a.lat * rad;
  const la2 = b.lat * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function movementSpeedMps(d, p, prev, deviceSpeedMps) {
  const dt = Math.max(0.001, (p.t - prev.t) / 1000);
  const gateDt = Math.max(dt, ENGINE.NATIVE_SPEED_GATE_DT);
  const calcSpeed = d / gateDt;
  if (deviceSpeedMps != null && deviceSpeedMps >= 0.5) return Math.max(deviceSpeedMps, calcSpeed);
  if (p.speedMps != null && p.speedMps >= 0.5) return Math.max(p.speedMps, calcSpeed);
  return calcSpeed;
}

function calcSpeedMps(d, p, prev) {
  const dt = Math.max(0.001, (p.t - prev.t) / 1000);
  const gateDt = Math.max(dt, ENGINE.NATIVE_SPEED_GATE_DT);
  return d / gateDt;
}

function recordStop(endP) {
  if (!trip.stopCandidateAt) return;
  trip.shiftStops.push({
    lat: trip.stopCandidatePoint?.lat ?? endP.lat,
    lon: trip.stopCandidatePoint?.lon ?? endP.lon,
    startISO: new Date(trip.stopCandidateAt).toISOString(),
    endISO: new Date(endP.t).toISOString(),
  });
  trip.stopCandidateAt = null;
  trip.stopCandidatePoint = null;
}

function downsampleRoute(pts, max = ENGINE.ROUTE_MAX) {
  if (!pts?.length) return [];
  if (pts.length <= max) return pts;
  const step = Math.ceil(pts.length / max);
  return pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
}

function processPoint(p, deviceSpeedMps) {
  trip.routePoints.push(p);
  const prev = trip.lastPoint;
  if (prev) {
    const d = distanceMeters(prev, p);
    const dt = Math.max(0.001, (p.t - prev.t) / 1000);
    const speed = movementSpeedMps(d, p, prev, deviceSpeedMps);
    const calcSpeed = calcSpeedMps(d, p, prev);
    if (d >= ENGINE.MAX_JUMP_M) {
      trip.pendingMeters = 0;
      trip.stopCandidateAt = null;
      trip.stopCandidatePoint = null;
      trip.lastPoint = p;
      return;
    }
    const isStopped = d < ENGINE.MIN_MOVE_M * 2 && (d === 0 || calcSpeed < ENGINE.STOP_SPEED_MPS);
    if (isStopped) {
      if (!trip.stopCandidateAt) {
        trip.stopCandidateAt = p.t;
        trip.stopCandidatePoint = p;
      } else if (p.t - trip.stopCandidateAt >= ENGINE.STOP_AFTER_MS) {
        recordStop(p);
      }
    } else if (d > 0 && speed < ENGINE.MAX_SPEED_MPS) {
      if (trip.stopCandidateAt) recordStop(p);
      trip.pendingMeters += d;
      if (trip.pendingMeters >= ENGINE.MIN_MOVE_M) {
        const credited = trip.pendingMeters;
        trip.miles += credited / 1609.344;
        trip.movingSeconds += Math.min(dt, 120);
        trip.lastMileRecordedAt = p.t;
        trip.pendingMeters = 0;
      }
    }
  }
  trip.lastPoint = p;
}

function payloadToPoint(payload) {
  if (!payload?.coords) return null;
  const speedMps =
    payload.coords.speed != null && payload.coords.speed >= 0 ? payload.coords.speed : null;
  return {
    lat: payload.coords.latitude,
    lon: payload.coords.longitude,
    acc: payload.coords.accuracy || 999,
    t: payload.timestamp || Date.now(),
    speedMps,
    nativeGps: true,
  };
}

async function persistState() {
  try {
    if (!FileSystem.documentDirectory) return;
    const body = JSON.stringify({ trip, savedAt: Date.now() });
    await FileSystem.writeAsStringAsync(STATE_PATH, body);
    trip.lastPersistAt = Date.now();
    await FileSystem.writeAsStringAsync(
      DEBUG_PATH,
      JSON.stringify({ trip, debugMeta, savedAt: Date.now() }, null, 2)
    );
  } catch (e) {
    logError('persist failed', e.message);
  }
}

export async function loadPersistedState() {
  try {
    if (!FileSystem.documentDirectory) return false;
    const info = await FileSystem.getInfoAsync(STATE_PATH);
    if (!info.exists) return false;
    const raw = await FileSystem.readAsStringAsync(STATE_PATH);
    const parsed = JSON.parse(raw);
    if (parsed?.trip) {
      trip = { ...emptyTrip(), ...parsed.trip };
      return true;
    }
  } catch (e) {
    if (trip.active && trip.miles > 0) {
      console.warn('[MilePilot NativeEngine] load skipped — using in-memory trip', e.message);
    } else {
      logError('load failed', e.message);
    }
  }
  return false;
}

export function startNativeTrip({ shiftId, startedAt, vehicle, miles: seedMiles, pendingMeters: seedPending, routePoints: seedRoute, lastPoint: seedLastPoint, lastMileRecordedAt: seedLastMile, lastGpsAt: seedLastGps } = {}) {
  trip = {
    ...emptyTrip(),
    active: true,
    shiftId: shiftId || `shift_${Date.now()}`,
    startedAt: startedAt || Date.now(),
    vehicle: vehicle || 'car',
    miles: Number(seedMiles) || 0,
    pendingMeters: Number(seedPending) || 0,
    routePoints: seedRoute || [],
    lastPoint: seedLastPoint || null,
    lastMileRecordedAt: seedLastMile || startedAt || Date.now(),
    lastGpsAt: seedLastGps || seedLastPoint?.t || null,
    gpsPointCount: seedRoute?.length || 0,
  };
  persistState();
  console.log('[MilePilot NativeEngine] trip started', trip.shiftId);
  return getTripSyncPayload();
}

export function stopNativeTrip() {
  const final = getTripSyncPayload();
  trip = emptyTrip();
  persistState();
  console.log('[MilePilot NativeEngine] trip stopped');
  return final;
}

export function restoreNativeTrip(payload) {
  if (!payload?.startedAt) return null;
  const existing = trip.active ? trip : null;
  const incomingMiles = Number(payload.miles) || 0;
  const incomingPending = Number(payload.pendingMeters) || 0;
  const existingOdo = existing ? existing.miles * 1609.344 + existing.pendingMeters : 0;
  const incomingOdo = incomingMiles * 1609.344 + incomingPending;
  const keepExistingOdo = existing && existingOdo > incomingOdo + 0.5;

  function pickNewerPoint(a, b) {
    if (!a) return b || null;
    if (!b) return a;
    return (b.t || 0) >= (a.t || 0) ? b : a;
  }

  function pickLongerRoute(a, b) {
    const ra = a || [];
    const rb = b || [];
    return rb.length > ra.length ? rb : ra;
  }

  trip = {
    ...emptyTrip(),
    active: true,
    shiftId: payload.shiftId || existing?.shiftId || `shift_${payload.startedAt}`,
    startedAt: payload.startedAt,
    vehicle: payload.vehicle || existing?.vehicle || 'car',
    miles: keepExistingOdo ? existing.miles : incomingMiles,
    pendingMeters: keepExistingOdo ? existing.pendingMeters : incomingPending,
    movingSeconds: Math.max(Number(payload.movingSeconds) || 0, existing?.movingSeconds || 0),
    routePoints: pickLongerRoute(existing?.routePoints, payload.routePoints),
    lastPoint: pickNewerPoint(existing?.lastPoint, payload.lastPoint),
    shiftStops: payload.stops?.length ? payload.stops : existing?.shiftStops || [],
    lastMileRecordedAt: Math.max(
      Number(payload.lastMileRecordedAt) || 0,
      Number(existing?.lastMileRecordedAt) || 0
    ) || payload.startedAt,
    gpsPointCount: Math.max(
      existing?.gpsPointCount || 0,
      payload.gpsPointCount || payload.routePoints?.length || 0
    ),
    lastGpsAt: Math.max(existing?.lastGpsAt || 0, payload.lastGpsAt || payload.lastPoint?.t || 0) || null,
    lastBackgroundUpdateAt: existing?.lastBackgroundUpdateAt || null,
    lastForegroundUpdateAt: existing?.lastForegroundUpdateAt || null,
    lastGpsLat: pickNewerPoint(
      existing?.lastPoint,
      payload.lastPoint || (payload.lastGpsLat != null ? { lat: payload.lastGpsLat, t: payload.lastGpsAt } : null)
    )?.lat ?? existing?.lastGpsLat ?? null,
    lastGpsLon: pickNewerPoint(existing?.lastPoint, payload.lastPoint)?.lon ?? existing?.lastGpsLon ?? null,
    lastGpsAcc: pickNewerPoint(existing?.lastPoint, payload.lastPoint)?.acc ?? existing?.lastGpsAcc ?? null,
  };
  persistState();
  return getTripSyncPayload();
}

/**
 * Ingest GPS from foreground watch or background task.
 * Returns sync payload for WebView when trip is active.
 */
export function ingestNativeLocation(payload, { source = 'unknown' } = {}) {
  if (!trip.active) return null;
  const p = payloadToPoint(payload);
  if (!p) return null;

  debugMeta.lastSource = source;
  trip.gpsPointCount += 1;
  trip.lastGpsAt = p.t;
  trip.lastGpsLat = p.lat;
  trip.lastGpsLon = p.lon;
  trip.lastGpsAcc = p.acc;

  if (source === 'background') {
    trip.lastBackgroundUpdateAt = Date.now();
  } else {
    trip.lastForegroundUpdateAt = Date.now();
  }

  if (p.acc > ENGINE.ACC_SOFT_MAX) {
    persistState();
    return getTripSyncPayload();
  }

  const deviceSpeedMps = p.speedMps;
  processPoint(p, deviceSpeedMps);
  onNativeBackgroundLocation(payload);
  persistState();
  return getTripSyncPayload();
}

export function getTripSyncPayload() {
  return {
    type: 'expo:trip:sync',
    active: trip.active,
    shiftId: trip.shiftId,
    startedAt: trip.startedAt,
    miles: Number(trip.miles.toFixed(4)),
    pendingMeters: trip.pendingMeters,
    movingSeconds: trip.movingSeconds,
    routePoints: downsampleRoute(trip.routePoints),
    stops: trip.shiftStops,
    lastPoint: trip.lastPoint,
    lastGpsAt: trip.lastGpsAt,
    lastGpsLat: trip.lastGpsLat,
    lastGpsLon: trip.lastGpsLon,
    lastGpsAcc: trip.lastGpsAcc,
    gpsPointCount: trip.gpsPointCount,
    lastBackgroundUpdateAt: trip.lastBackgroundUpdateAt,
    lastForegroundUpdateAt: trip.lastForegroundUpdateAt,
    lastPersistAt: trip.lastPersistAt,
    lastMileRecordedAt: trip.lastMileRecordedAt,
    vehicle: trip.vehicle,
    engine: 'native',
    timestamp: Date.now(),
  };
}

export function setNativeDebugMeta(patch) {
  debugMeta = { ...debugMeta, ...patch };
}

export function getNativeDebugSnapshot(extra = {}) {
  return {
    ...getTripSyncPayload(),
    permissionStatus: debugMeta.permissionStatus,
    backgroundActive: debugMeta.backgroundActive,
    appState: debugMeta.appState,
    lastSource: debugMeta.lastSource,
    lastError: trip.lastError,
    errors: debugMeta.errors.slice(-20),
    nativeEngine: true,
    trackingMode: 'Native',
    ...extra,
  };
}

export function isNativeTripActive() {
  return trip.active;
}
