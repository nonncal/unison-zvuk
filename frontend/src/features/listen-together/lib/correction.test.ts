import { describe, it, expect } from 'vitest'
import { correction } from './correction'
describe('drift correction', () => {
  it('corrects in the proper direction and hard-seeks large errors', () => {
    expect(correction(100).rate).toBeGreaterThan(1)
    expect(correction(-100).rate).toBeLessThan(1)
    expect(correction(251).seek).toBe(true)
    expect(correction(50)).toEqual({ rate: 1, seek: false })
  })
})
