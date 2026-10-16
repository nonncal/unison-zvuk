import type { LyricLine } from '@/entities/track'
/** Lines come sorted by time; a line is current from its stamp until the next one starts. */
export function activeLine(lines: LyricLine[], positionMs: number, leadMs = 150) {
  const at = positionMs + leadMs
  let low = 0,
    high = lines.length - 1,
    found = -1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (lines[mid].t <= at) {
      found = mid
      low = mid + 1
    } else high = mid - 1
  }
  return found
}
