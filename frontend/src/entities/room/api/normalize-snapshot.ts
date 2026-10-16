import type { HTTPModels } from '@/shared/api'
import type { Participant, Snapshot } from '../model/types'
export function normalizeParticipants(
  items: HTTPModels['Snapshot']['participants'],
): Participant[] {
  return items.map((p) => ({ ...p, readiness: p.readiness?.state ?? 'loading' }))
}
export function normalizeSnapshot(value: HTTPModels['Snapshot']): Snapshot {
  return {
    ...value,
    playlist: {
      nextTrackId: value.playlist?.nextTrackId ?? null,
      suggestions: value.playlist?.suggestions ?? [],
      skippedTrackIds: value.playlist?.skippedTrackIds ?? [],
      trackIds: value.playlist?.trackIds ?? [],
      repeat: value.playlist?.repeat ?? 'off',
      shuffle: value.playlist?.shuffle ?? false,
    },
    participants: normalizeParticipants(value.participants),
    playback: { ...value.playback, playbackRevision: value.playbackRevision },
  }
}
