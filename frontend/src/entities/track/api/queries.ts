import { baseApi, requestModel, type HTTPModels } from '@/shared/api'
import { errorMessage } from '@/shared/lib/errors'
import { normalizeTrack } from './normalize-track'
import type { Track } from '../model/types'
export const trackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    roomTracks: builder.query<Track[], string>({
      async queryFn(roomId) {
        try {
          const tracks: Track[] = []
          let cursor: string | null = null
          do {
            const page: HTTPModels['TrackList'] = await requestModel(
              'TrackList',
              `/rooms/${roomId}/tracks?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
            )
            tracks.push(...page.items.map(normalizeTrack))
            cursor = page.nextCursor ?? null
          } while (cursor)
          return { data: tracks }
        } catch (error) {
          return { error: { message: errorMessage(error) } }
        }
      },
      providesTags: ['RoomTracks'],
    }),
  }),
})
export const { useRoomTracksQuery } = trackApi
