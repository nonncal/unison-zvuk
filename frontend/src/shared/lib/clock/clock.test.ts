import { describe, it, expect } from 'vitest'
import { clockSample, estimateOffset } from './index'
describe('clock estimate and drift', () => {
  it('removes server processing time from RTT', () => {
    expect(clockSample(100, 650, 660, 210)).toEqual({ offset: 500, rtt: 100 })
  })
  it('uses the median of the three fastest samples', () => {
    expect(
      estimateOffset([
        { offset: 1000, rtt: 900 },
        { offset: 498, rtt: 20 },
        { offset: 502, rtt: 30 },
        { offset: 500, rtt: 25 },
      ]),
    ).toBe(500)
  })
})
