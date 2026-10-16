/**
 * Correct moderate drift gradually; reserve seeks for discontinuities.
 * Rate changes are small and sticky: once correcting, keep going until the drift is
 * nearly gone, so the rate does not flip around the threshold (each flip is audible).
 */
export const HARD_SEEK_MS = 400
export const START_CORRECTION_MS = 90
export const STOP_CORRECTION_MS = 30
export function correction(driftMs: number, correcting = false): { rate: number; seek: boolean } {
  const drift = Math.abs(driftMs)
  if (drift > HARD_SEEK_MS) return { rate: 1, seek: true }
  if (drift <= (correcting ? STOP_CORRECTION_MS : START_CORRECTION_MS))
    return { rate: 1, seek: false }
  const adjustment = Math.min(0.02, Math.max(0.005, drift / 6000))
  return { rate: 1 + Math.sign(driftMs) * adjustment, seek: false }
}
