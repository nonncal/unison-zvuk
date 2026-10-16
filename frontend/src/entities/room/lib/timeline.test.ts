import { describe, expect, it } from 'vitest'
import { timelineAt } from './timeline'
import type { Playback } from '../model/types'
const playback: Playback = {
  roomId: 'room',
  epoch: 'epoch',
  playbackRevision: 2,
  trackId: 'track',
  mediaVersion: 'v1',
  status: 'playing',
  positionMs: 10000,
  anchorServerTimeMs: 1000,
  durationMs: 60000,
  pendingTransition: {
    type: 'seek',
    nextStatus: 'playing',
    positionMs: 30000,
    effectiveAtServerTimeMs: 3000,
  },
}
describe('authoritative timeline', () => {
  it('keeps the committed position before a scheduled seek', () => {
    expect(timelineAt(playback, 2999)).toEqual({ positionMs: 11999, status: 'playing' })
  })
  it('applies seek exactly at its effective timestamp', () => {
    expect(timelineAt(playback, 3000)).toEqual({ positionMs: 30000, status: 'playing' })
  })
  it('joins a late event at its current position instead of replaying it', () => {
    expect(timelineAt(playback, 8000)).toEqual({ positionMs: 35000, status: 'playing' })
  })
  it('does not advance a scheduled paused position', () => {
    expect(
      timelineAt(
        {
          ...playback,
          pendingTransition: { ...playback.pendingTransition!, nextStatus: 'paused' },
        },
        9000,
      ),
    ).toEqual({ positionMs: 30000, status: 'paused' })
  })
  it('caps at the end of the media', () => {
    expect(timelineAt(playback, 100000)).toEqual({ positionMs: 60000, status: 'ended' })
  })
  it('never moves before the anchor when clocks are still being calibrated', () => {
    expect(timelineAt({ ...playback, pendingTransition: null }, 500).positionMs).toBe(10000)
  })
})
