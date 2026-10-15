import { describe, it, expect } from 'vitest'
import { correction } from './correction'
describe('drift correction', () => {
  it('corrects in the proper direction and hard-seeks large errors', () => {
    expect(correction(100).rate).toBeGreaterThan(1)
    expect(correction(-100).rate).toBeLessThan(1)
    expect(correction(401).seek).toBe(true)
    expect(correction(50)).toEqual({ rate: 1, seek: false })
  })
})

// Simulate a real media clock advancing at the commanded rate.
it('converges moderate positive and negative drift without a seek', () => {
  for (const initial of [200, -200, 390, -390]) {
    let drift = initial
    for (let ms = 0; ms < 12000; ms += 250) {
      const action = correction(drift)
      expect(action.seek).toBe(false)
      expect(Math.abs(action.rate - 1)).toBeLessThanOrEqual(0.030001)
      drift -= (action.rate - 1) * 250
    }
    expect(Math.abs(drift)).toBeLessThanOrEqual(60)
  }
})
