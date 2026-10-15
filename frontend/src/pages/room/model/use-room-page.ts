import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
  gateway,
  roomActions,
  selectRoomState,
  roomApi,
  type PlayerAction,
  type ReactionEmoji,
} from '@/entities/room'
import type { PlaybackCommand, RoomState } from '@/entities/room'
import {
  audioActions,
  selectAudioState,
  audioEngine,
  useListeningRoom,
} from '@/features/listen-together'
import { AppError, errorMessage } from '@/shared/lib/errors'
export function useRoomPage() {
  const { roomId = '' } = useParams(),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    store = useStore<{ room: RoomState }>()
  const { snapshot, participantId, connection, error } = useSelector(selectRoomState),
    audio = useSelector(selectAudioState)
  const [dialog, setDialog] = useState<
      'library' | 'upload' | 'invite' | 'close' | 'rooms' | 'create' | 'settings' | 'rotate' | null
    >(null),
    [busy, setBusy] = useState(false),
    [invite, setInvite] = useState(''),
    [copied, setCopied] = useState(false),
    [inviteError, setInviteError] = useState(''),
    [previewSeek, setPreviewSeek] = useState<number | null>(null),
    [allowNotReady, setAllowNotReady] = useState(false),
    [retry, setRetry] = useState(0)
  const toastTimer = useRef(0)
  const { tracks, reloadTracks, selected, transport, position, displayStatus, serverNow } =
    useListeningRoom(roomId, retry)
  useEffect(() => () => clearTimeout(toastTimer.current), [])
  const me = snapshot?.participants.find((p) => p.id === participantId),
    isHost = me?.id === snapshot?.room.hostParticipantId,
    canEdit = Boolean(isHost || me?.canEdit),
    host = snapshot?.participants.find((p) => p.id === snapshot.room.hostParticipantId)
  const command = useCallback(
    async (value: PlaybackCommand) => {
      const current = store.getState().room.snapshot
      if (!current || !transport.current || busy) return
      setBusy(true)
      dispatch(roomActions.error(null))
      try {
        await transport.current.send(value, current.playback.playbackRevision)
        setAllowNotReady(false)
        if (value.type === 'playback.select') setDialog(null)
      } catch (e) {
        if (e instanceof AppError && e.code === 'NOT_ALL_READY') setAllowNotReady(true)
        else dispatch(roomActions.error(errorMessage(e)))
      } finally {
        setBusy(false)
      }
    },
    [dispatch, busy, store, transport],
  )
  async function playerAction(payload: Omit<PlayerAction, 'expectedPlaybackRevision'>) {
    const current = store.getState().room.snapshot
    if (!current || busy) return
    setBusy(true)
    dispatch(roomActions.error(null))
    try {
      dispatch(
        roomActions.received(
          await roomApi.player(roomId, {
            ...payload,
            expectedPlaybackRevision: current.playback.playbackRevision,
          }),
        ),
      )
    } catch (error) {
      dispatch(roomActions.error(errorMessage(error)))
      transport.current?.snapshot()
    } finally {
      setBusy(false)
    }
  }
  const react = (emoji: ReactionEmoji) => {
    try {
      transport.current?.react?.(emoji)
    } catch (error) {
      dispatch(roomActions.error(errorMessage(error)))
    }
  }
  const controlsDisabled =
    !canEdit ||
    connection !== 'connected' ||
    busy ||
    Boolean(
      snapshot?.playback.pendingTransition &&
      snapshot.playback.pendingTransition.effectiveAtServerTimeMs > serverNow,
    )
  async function unlock() {
    try {
      await audioEngine.unlock()
    } catch (e) {
      dispatch(roomActions.error(errorMessage(e)))
    }
  }
  async function openInvite() {
    setDialog('invite')
    setCopied(false)
    setInviteError('')
    try {
      setInvite(await gateway.invite(roomId))
    } catch (e) {
      dispatch(roomActions.error(errorMessage(e)))
    }
  }
  async function rotateInvite() {
    setBusy(true)
    try {
      setInvite((await roomApi.rotate(roomId)).inviteUrl)
      setCopied(false)
      setDialog('invite')
    } catch (e) {
      dispatch(roomActions.error(errorMessage(e)))
    } finally {
      setBusy(false)
    }
  }
  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(invite)
      setCopied(true)
      clearTimeout(toastTimer.current)
      toastTimer.current = window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setInviteError(
        'Не удалось скопировать автоматически. Выделите ссылку и скопируйте её вручную.',
      )
    }
  }
  async function leave(close = false) {
    if (busy || !snapshot) return
    setBusy(true)
    try {
      if (close) {
        await gateway.close(roomId, snapshot.playback.playbackRevision)
        setDialog(null)
      } else {
        await gateway.leave(roomId)
        navigate('/')
      }
    } catch (e) {
      dispatch(roomActions.error(errorMessage(e)))
    } finally {
      setBusy(false)
    }
  }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        event.code === 'Space' &&
        !dialog &&
        !controlsDisabled &&
        selected &&
        !['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'].includes(target.tagName)
      ) {
        event.preventDefault()
        void command({
          type: displayStatus === 'playing' ? 'playback.pause' : 'playback.play',
          payload: displayStatus === 'playing' ? {} : { allowNotReady: false },
        } as PlaybackCommand)
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [dialog, controlsDisabled, selected, displayStatus, command])
  const allPlaying =
    (snapshot?.participants.length ?? 0) > 1 &&
    snapshot?.participants.every(
      (p) => p.connectionState === 'online' && p.readiness === 'ready',
    ) &&
    audio.state === 'playing' &&
    connection === 'connected'
  const statusText =
    connection === 'reconnecting'
      ? 'Восстанавливаем соединение'
      : audio.state === 'locked' && selected
        ? 'Нужно включить звук'
        : audio.state === 'buffering'
          ? 'Загружаем композицию'
          : displayStatus === 'playing'
            ? allPlaying
              ? 'Слушаете вместе'
              : 'Композиция звучит'
            : displayStatus === 'ended'
              ? 'Композиция закончилась'
              : selected
                ? 'Готовы к вашему моменту'
                : 'Начните с любимой композиции'

  return {
    roomId,
    snapshot,
    participantId,
    connection,
    error,
    audio,
    tracks,
    dialog,
    setDialog,
    busy,
    invite,
    copied,
    inviteError,
    previewSeek,
    setPreviewSeek,
    allowNotReady,
    setAllowNotReady,
    setRetry,
    position,
    displayStatus,
    isHost,
    canEdit,
    playerAction,
    react,
    selected,
    host,
    reloadTracks,
    command,
    controlsDisabled,
    unlock,
    openInvite,
    copyInvite,
    rotateInvite,
    leave,
    statusText,
    retryAudio: () => {
      audioEngine.retrySource()
      transport.current?.snapshot()
    },
    dismissError: () => dispatch(roomActions.error(null)),
    toggleMute: () => dispatch(audioActions.mute()),
    setVolume: (value: number) => dispatch(audioActions.volume(value)),
  }
}
