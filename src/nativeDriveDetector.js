/**
 * MP-048 — Headless driving detection for native iOS auto-start.
 * Pure state machine — mirrors WebView autopilot-motion thresholds.
 */

export const DETECTOR = Object.freeze({
  DRIVING_SPEED_MPS: 4.0,
  SUSTAINED_MS: 25000,
  MAX_START_ACCURACY_M: 80,
  WALKING_MAX_MPS: 2.2,
  MIN_CANDIDATE_SAMPLES: 3,
  CONFIDENCE_THRESHOLD: 0.72,
  CANDIDATE_TIMEOUT_MS: 45000,
});

export function createDriveDetectorState() {
  return {
    candidateStartedAt: 0,
    candidateSamples: 0,
    candidateConfidence: 0,
    lastSample: null,
    motionActivity: 'unknown',
  };
}

function distanceMeters(a, b) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const la1 = a.lat * rad;
  const la2 = b.lat * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function calcSpeedMps(sample, prev) {
  if (sample.speedMps != null && sample.speedMps >= 0) return sample.speedMps;
  if (!prev || sample.lat == null || prev.lat == null) return 0;
  const d = distanceMeters(prev, sample);
  const dt = Math.max(0.001, (sample.t - prev.t) / 1000);
  return d / dt;
}

function isPoorGps(acc) {
  return acc == null || acc >= 999 || acc > DETECTOR.MAX_START_ACCURACY_M;
}

function isWalkingSpeed(speedMps) {
  return speedMps > 0.3 && speedMps < DETECTOR.WALKING_MAX_MPS;
}

export function isDrivingSpeed(speedMps) {
  return speedMps >= DETECTOR.DRIVING_SPEED_MPS;
}

export function computeConfidence(speedMps, acc, sustainedMs, motionActivity) {
  let score = 0;
  if (isDrivingSpeed(speedMps)) score += 0.45;
  else if (speedMps >= DETECTOR.DRIVING_SPEED_MPS * 0.85) score += 0.25;
  if (!isPoorGps(acc)) score += 0.25;
  else score -= 0.2;
  if (sustainedMs >= DETECTOR.SUSTAINED_MS) score += 0.25;
  else score += (sustainedMs / DETECTOR.SUSTAINED_MS) * 0.15;
  if (motionActivity === 'automotive' || motionActivity === 'driving') score += 0.1;
  if (isWalkingSpeed(speedMps)) score -= 0.35;
  return Math.max(0, Math.min(1, score));
}

function resetCandidate(state, reason) {
  state.candidateStartedAt = 0;
  state.candidateSamples = 0;
  state.candidateConfidence = 0;
  return { state, confirmed: false, reason };
}

/**
 * @param {ReturnType<typeof createDriveDetectorState>} state
 * @param {{ lat: number, lon: number, acc?: number, t?: number, speedMps?: number|null, motion?: string }} sample
 */
export function ingestDriveSample(state, sample) {
  if (!sample || sample.lat == null || sample.lon == null) {
    return { state, confirmed: false, reason: 'invalid_sample' };
  }

  const prev = state.lastSample;
  const normalized = {
    lat: sample.lat,
    lon: sample.lon,
    acc: sample.acc != null ? sample.acc : 999,
    t: sample.t || Date.now(),
    speedMps: sample.speedMps,
    motion: sample.motion || state.motionActivity,
  };
  state.lastSample = normalized;
  if (sample.motion) state.motionActivity = sample.motion;

  const speedMps = calcSpeedMps(normalized, prev);

  if (isPoorGps(normalized.acc)) {
    return resetCandidate(state, 'poor_gps');
  }

  if (isWalkingSpeed(speedMps)) {
    return resetCandidate(state, 'walking');
  }

  if (!isDrivingSpeed(speedMps)) {
    if (
      state.candidateStartedAt &&
      Date.now() - state.candidateStartedAt > DETECTOR.CANDIDATE_TIMEOUT_MS
    ) {
      return resetCandidate(state, 'speed_dropped');
    }
    return { state, confirmed: false, reason: 'below_driving_speed' };
  }

  const now = normalized.t;
  if (!state.candidateStartedAt) {
    state.candidateStartedAt = now;
    state.candidateSamples = 1;
  } else {
    state.candidateSamples += 1;
  }

  const sustainedMs = now - state.candidateStartedAt;
  state.candidateConfidence = computeConfidence(
    speedMps,
    normalized.acc,
    sustainedMs,
    state.motionActivity
  );

  if (
    sustainedMs >= DETECTOR.SUSTAINED_MS &&
    state.candidateSamples >= DETECTOR.MIN_CANDIDATE_SAMPLES &&
    state.candidateConfidence >= DETECTOR.CONFIDENCE_THRESHOLD
  ) {
    return {
      state,
      confirmed: true,
      confidence: state.candidateConfidence,
      sustainedMs,
      reason: 'driving_confirmed',
    };
  }

  return { state, confirmed: false, reason: 'candidate_building', confidence: state.candidateConfidence };
}
