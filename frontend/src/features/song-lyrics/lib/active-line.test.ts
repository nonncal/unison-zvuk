import { describe, expect, it } from 'vitest'
import { activeLine } from './active-line'
const lines = [
  { t: 1000, text: 'a' },
  { t: 5000, text: 'b' },
  { t: 9000, text: '' },
  { t: 12000, text: 'c' },
]
describe('activeLine', () => {
  it('is none before the first stamp and follows the position afterwards', () => {
    expect(activeLine(lines, 0, 0)).toBe(-1)
    expect(activeLine(lines, 999, 0)).toBe(-1)
    expect(activeLine(lines, 1000, 0)).toBe(0)
    expect(activeLine(lines, 8999, 0)).toBe(1)
    expect(activeLine(lines, 9000, 0)).toBe(2)
    expect(activeLine(lines, 99999, 0)).toBe(3)
  })
  it('starts a line slightly early so the eye is ahead of the voice', () => {
    expect(activeLine(lines, 4900, 150)).toBe(1)
  })
  it('handles an empty list', () => {
    expect(activeLine([], 5000)).toBe(-1)
  })
})
