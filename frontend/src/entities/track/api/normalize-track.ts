import type { HTTPModels } from '@/shared/api'
import type { Track } from '../model/types'
export function normalizeTrack(track: HTTPModels['Track']): Track {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    durationMs: track.durationMs ?? 0,
    status: track.status === 'uploading' ? 'processing' : track.status,
    mediaVersion: track.mediaVersion ?? '',
    coverUrl: track.coverUrl ?? undefined,
    lyricsUrl: track.lyricsUrl ?? undefined,
    cover: undefined,
    source: track.licenseId ? 'catalog' : 'upload',
  }
}
