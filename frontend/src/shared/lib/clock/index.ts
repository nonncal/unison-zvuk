export function clockSample(t0: number, t1: number, t2: number, t3: number) {
  return { offset: (t1 - t0 + (t2 - t3)) / 2, rtt: Math.max(0, t3 - t0 - (t2 - t1)) }
}
export function estimateOffset(samples: { offset: number; rtt: number }[]) {
  const offsets = [...samples]
    .sort((a, b) => a.rtt - b.rtt)
    .slice(0, 3)
    .map((s) => s.offset)
    .sort((a, b) => a - b)
  return offsets.length ? offsets[Math.floor(offsets.length / 2)] : 0
}
