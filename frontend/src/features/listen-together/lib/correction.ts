/** Correct moderate drift gradually; reserve seeks for discontinuities. */
export function correction(driftMs: number): { rate: number; seek: boolean } {
  if (Math.abs(driftMs) > 400) return { rate: 1, seek: true }
  if (Math.abs(driftMs) <= 60) return { rate: 1, seek: false }
  const adjustment = Math.min(0.03, Math.max(0.01, Math.abs(driftMs) / 4000))
  return { rate: 1 + Math.sign(driftMs) * adjustment, seek: false }
}
