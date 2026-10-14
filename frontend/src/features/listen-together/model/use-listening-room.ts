import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { roomActions, selectRoomState, timelineAt, gateway } from '@/entities/room'
import type { RoomConnection, RoomState } from '@/entities/room'
import { useRoomTracksQuery, type Track } from '@/entities/track'
import { appMode } from '@/shared/config'
import { errorMessage } from '@/shared/lib/errors'
import { audioActions, selectAudioState } from './audio-slice'
import { audioEngine } from '../lib/audio-engine'
export function useListeningRoom(roomId: string, retry: number) {
  const dispatch = useDispatch(),
    store = useStore<{ room: RoomState }>()
  const { snapshot, connection } = useSelector(selectRoomState),
    audio = useSelector(selectAudioState)
  const [demoTracks, setTracks] = useState<Track[]>([]),
    [position, setPosition] = useState(0),
    [displayStatus, setDisplayStatus] = useState('empty'),
    [serverNow, setServerNow] = useState(0)
  const transport = useRef<RoomConnection | null>(null)
  const remoteTracks = useRoomTracksQuery(roomId, {
    skip:
      appMode === 'demo' ||
      !snapshot ||
      snapshot.room.id !== roomId ||
      snapshot.room.status !== 'active',
  })
  const { refetch } = remoteTracks
  const tracks = appMode === 'api' ? (remoteTracks.data ?? []) : demoTracks
  const selected = tracks.find((t) => t.id === snapshot?.playback.trackId)
  const reloadTracks = useCallback(() => {
    if (appMode === 'api') {
      void refetch()
      return
    }
    gateway
      .tracks(roomId)
      .then(setTracks)
      .catch((e) => dispatch(roomActions.error(errorMessage(e))))
  }, [roomId, dispatch, refetch])
  useEffect(() => {
    let cancelled = false
    dispatch(roomActions.reset())
    dispatch(roomActions.connection('connecting'))
    gateway
      .restore(roomId)
      .then((membership) => {
        if (cancelled) return
        dispatch(roomActions.membership(membership.participantId))
        dispatch(roomActions.received(membership.snapshot))
        transport.current = gateway.connect(
          roomId,
          membership.participantId,
          (value) => dispatch(roomActions.received(value)),
          (value) => dispatch(roomActions.connection(value)),
          (value) => dispatch(roomActions.error(value)),
        )
      })
      .catch((e) => {
        if (!cancelled) {
          dispatch(roomActions.error(errorMessage(e)))
          dispatch(roomActions.connection('failed'))
        }
      })
    return () => {
      cancelled = true
      transport.current?.dispose()
      transport.current = null
    }
  }, [roomId, dispatch, retry])
  useEffect(() => {
    if (snapshot?.room.id === roomId) reloadTracks()
  }, [snapshot?.room.id, snapshot?.playback.trackId, roomId, reloadTracks])
  useEffect(
    () =>
      audioEngine.listen(
        {
          state: (value) => dispatch(audioActions.state(value)),
          position: (value) => dispatch(audioActions.position(value)),
          ready: (value, bufferedMs) => {
            const p = store.getState().room.snapshot?.playback
            if (p?.trackId && p.mediaVersion)
              transport.current?.readiness({
                trackId: p.trackId,
                mediaVersion: p.mediaVersion,
                state: value,
                bufferedAheadMs: bufferedMs,
                autoplayAllowed: value !== 'autoplayBlocked',
              })
          },
        },
        () => transport.current?.now() ?? Date.now(),
      ),
    [dispatch, roomId, store],
  )
  useEffect(() => {
    audioEngine.setVolume(audio.volume, audio.muted)
    try {
      localStorage.setItem('unison:volume', String(audio.volume))
    } catch {
      /* Local volume still works when persistence is unavailable. */
    }
  }, [audio.volume, audio.muted])
  useEffect(() => {
    if (!snapshot) return
    if (snapshot.room.status !== 'active') {
      audioEngine.pauseForConnection()
      return
    }
    void audioEngine.update(snapshot.playback, selected, () => gateway.audioUrl(roomId, selected!))
  }, [snapshot, selected, roomId])
  useEffect(() => {
    if (connection === 'connected') {
      audioEngine.resumeForConnection()
      return
    }
    const timer = window.setTimeout(
      () => audioEngine.pauseForConnection(),
      connection === 'closed' ? 0 : 3000,
    )
    return () => clearTimeout(timer)
  }, [connection])
  useEffect(() => {
    const update = () => {
      if (snapshot) {
        const now = transport.current?.now() ?? Date.now()
        setServerNow(now)
        const value = timelineAt(snapshot.playback, now)
        setPosition(value.positionMs)
        setDisplayStatus(value.status)
      }
    }
    const timer = window.setInterval(update, 100)
    update()
    return () => clearInterval(timer)
  }, [snapshot])

  useEffect(() => {
    if (remoteTracks.error && 'message' in remoteTracks.error)
      dispatch(roomActions.error(remoteTracks.error.message ?? 'Не удалось загрузить подборку'))
  }, [remoteTracks.error, dispatch])

  return { tracks, reloadTracks, selected, transport, position, displayStatus, serverNow }
}
