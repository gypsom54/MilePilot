/**
 * MP-047 Phase 0 — Shared idle timer policy (web + native).
 * Walking and GPS drift must not reset the 90-minute driving idle clock.
 */

export const IDLE = Object.freeze({
  INACTIVITY_MS: 90 * 60 * 1000,
  DRIVING_MIN_SPEED_MPS: 1.8,
  DRIVING_MIN_MOVE_M: 40,
  WALKING_MAX_SPEED_MPS: 1.5,
  MILE_GRACE_MS: 20 * 60 * 1000,
  MAX_ACC_M: 65,
});

/**
 * @param {{ distanceM: number, speedMps: number|null, accuracyM?: number|null, activityAutomotive?: boolean }} opts
 */
export function shouldResetIdleTimer({ distanceM, speedMps, accuracyM = null, activityAutomotive = false }) {
  const { DRIVING_MIN_MOVE_M, DRIVING_MIN_SPEED_MPS, WALKING_MAX_SPEED_MPS, MAX_ACC_M } = IDLE;

  if (accuracyM != null && accuracyM > MAX_ACC_M) return false;
  if (activityAutomotive && distanceM >= DRIVING_MIN_MOVE_M) return true;
  if (speedMps == null || speedMps < DRIVING_MIN_SPEED_MPS) return false;
  if (speedMps <= WALKING_MAX_SPEED_MPS) return false;
  return distanceM >= DRIVING_MIN_MOVE_M;
}
