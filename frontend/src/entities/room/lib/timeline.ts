import type { Playback, PlaybackStatus } from '../model/types'
export function timelineAt(
  playback: Playback,
  now: number,
): { positionMs: number; status: PlaybackStatus } {
  let { positionMs, status, anchorServerTimeMs } = playback
  const transition = playback.pendingTransition
  if (transition && now >= transition.effectiveAtServerTimeMs) {
    positionMs = transition.positionMs
    status = transition.nextStatus
    anchorServerTimeMs = transition.effectiveAtServerTimeMs
  }
  const position = Math.max(
    0,
    Math.min(
      playback.durationMs,
      positionMs + (status === 'playing' ? Math.max(0, now - anchorServerTimeMs) : 0),
    ),
  )
  return {
    positionMs: position,
    status: position >= playback.durationMs && playback.durationMs > 0 ? 'ended' : status,
  }
}
