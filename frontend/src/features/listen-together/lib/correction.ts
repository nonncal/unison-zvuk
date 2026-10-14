export function correction(driftMs: number): { rate: number; seek: boolean } {
  if (Math.abs(driftMs) > 250) return { rate: 1, seek: true }
  if (Math.abs(driftMs) <= 80) return { rate: 1, seek: false }
  return { rate: driftMs > 0 ? 1.02 : 0.98, seek: false }
}
