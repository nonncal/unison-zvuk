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
    participants: normalizeParticipants(value.participants),
    playback: { ...value.playback, playbackRevision: value.playbackRevision },
  }
}
