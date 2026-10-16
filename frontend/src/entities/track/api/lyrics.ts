import { request } from '@/shared/api'
import type { Lyrics } from '../model/types'
export const lyricsApi = {
  get: (roomId: string, lyricsUrl: string) =>
    request<Lyrics>(`/rooms/${roomId}/${lyricsUrl}`, {}, 'Lyrics'),
  save: (roomId: string, trackId: string, text: string) =>
    request<void>(`/rooms/${roomId}/tracks/${trackId}/lyrics`, {
      method: 'PUT',
      body: text,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }),
  remove: (roomId: string, trackId: string) =>
    request<void>(`/rooms/${roomId}/tracks/${trackId}/lyrics`, { method: 'DELETE' }),
}
