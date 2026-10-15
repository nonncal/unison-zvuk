import type { CSSProperties } from 'react'
import { Headphones, LoaderCircle, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import {
  gateway,
  type Snapshot,
  type AudioState,
  type PlaybackCommand,
  type PlayerAction,
} from '@/entities/room'
import type { Track } from '@/entities/track'
import { PlaybackNavigation } from '@/features/room-playlist'
import { formatTime } from '@/shared/lib/time'
import './room-player.css'
interface Props {
  snapshot: Snapshot
  audio: { state: AudioState; volume: number; muted: boolean }
  selected?: Track
  previewSeek: number | null
  setPreviewSeek: (value: number | null) => void
  position: number
  controlsDisabled: boolean
  command: (value: PlaybackCommand) => Promise<void>
  displayStatus: string
  busy: boolean
  unlock: () => Promise<void>
  canEdit: boolean
  host?: Snapshot['participants'][number]
  playerAction: (value: Omit<PlayerAction, 'expectedPlaybackRevision'>) => Promise<void>
  statusText: string
  toggleMute: () => void
  setVolume: (value: number) => void
  retryAudio: () => void
  allowNotReady: boolean
  setAllowNotReady: (value: boolean) => void
}
export function RoomPlayer({
  snapshot,
  audio,
  selected,
  previewSeek,
  setPreviewSeek,
  position,
  controlsDisabled,
  command,
  displayStatus,
  busy,
  unlock,
  canEdit,
  host,
  playerAction,
  statusText,
  toggleMute,
  setVolume,
  retryAudio,
  allowNotReady,
  setAllowNotReady,
}: Props) {
  return (
    <div className="player">
      <div className="player-status" aria-live="polite">
        <span className={`little-dot ${displayStatus === 'playing' ? 'dot-playing' : ''}`} />
        {statusText}
        <span className="player-status-right">
          {snapshot.participants.length}/{snapshot.room.capacity} в комнате
        </span>
      </div>
      <div className="seek-wrap">
        <input
          type="range"
          aria-label="Общая позиция композиции"
          min={0}
          max={snapshot.playback.durationMs || 1}
          step={1000}
          aria-valuetext={`${formatTime(previewSeek ?? position)} из ${formatTime(snapshot.playback.durationMs)}`}
          value={previewSeek ?? position}
          disabled={controlsDisabled || !selected}
          onChange={(event) => setPreviewSeek(Number(event.target.value))}
          onPointerUp={(event) => {
            if (!controlsDisabled)
              void command({
                type: 'playback.seek',
                payload: { positionMs: Number(event.currentTarget.value) },
              })
            setPreviewSeek(null)
          }}
          onPointerCancel={() => setPreviewSeek(null)}
          onBlur={() => setPreviewSeek(null)}
          onKeyUp={(event) => {
            if (
              ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)
            ) {
              void command({
                type: 'playback.seek',
                payload: { positionMs: Number(event.currentTarget.value) },
              })
              setPreviewSeek(null)
            }
          }}
          style={
            {
              '--progress': `${((previewSeek ?? position) / (snapshot.playback.durationMs || 1)) * 100}%`,
            } as CSSProperties
          }
        />
        <div className="seek-times">
          <span>{formatTime(previewSeek ?? position)}</span>
          <span>{formatTime(snapshot.playback.durationMs)}</span>
        </div>
      </div>
      <div className="player-controls">
        <div className="volume-control">
          <button
            className="icon-button"
            aria-label={audio.muted ? 'Включить звук у меня' : 'Выключить звук у меня'}
            onClick={() => toggleMute()}
          >
            {audio.muted || audio.volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audio.muted ? 0 : audio.volume}
            aria-label="Моя громкость"
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </div>
        {gateway.mode === 'api' ? (
          <PlaybackNavigation
            snapshot={snapshot}
            disabled={controlsDisabled}
            onAction={(payload) => void playerAction(payload)}
          >
            <button
              className="play-button"
              disabled={controlsDisabled || !selected || audio.state === 'loading'}
              aria-label={displayStatus === 'playing' ? 'Пауза для всех' : 'Воспроизвести для всех'}
              onClick={() => {
                void unlock()
                void command(
                  displayStatus === 'playing'
                    ? { type: 'playback.pause', payload: {} }
                    : { type: 'playback.play', payload: { allowNotReady: false } },
                )
              }}
            >
              {busy ? (
                <LoaderCircle size={26} className="spin" />
              ) : displayStatus === 'playing' ? (
                <Pause size={25} fill="currentColor" />
              ) : (
                <Play size={25} fill="currentColor" />
              )}
            </button>
          </PlaybackNavigation>
        ) : (
          <button
            className="play-button"
            disabled={controlsDisabled || !selected || audio.state === 'loading'}
            aria-label={displayStatus === 'playing' ? 'Пауза для всех' : 'Воспроизвести для всех'}
            onClick={() => {
              void unlock()
              void command(
                displayStatus === 'playing'
                  ? { type: 'playback.pause', payload: {} }
                  : { type: 'playback.play', payload: { allowNotReady: false } },
              )
            }}
          >
            {busy ? (
              <LoaderCircle size={26} className="spin" />
            ) : displayStatus === 'playing' ? (
              <Pause size={25} fill="currentColor" />
            ) : (
              <Play size={25} fill="currentColor" />
            )}
          </button>
        )}
        <span className="control-caption">
          {canEdit ? 'Общий плеер' : `Управляет ${host?.displayName ?? 'ведущий'}`}
        </span>
      </div>
      {audio.state === 'locked' && selected && (
        <button
          className="button button-secondary unlock-button"
          onClick={() => {
            void unlock()
          }}
        >
          <Headphones size={18} />
          Включить звук
        </button>
      )}
      {audio.state === 'error' && (
        <p className="error-message" role="alert">
          Не удалось загрузить аудио.{' '}
          <button
            className="text-link"
            onClick={() => {
              retryAudio()
            }}
          >
            Попробовать снова
          </button>
        </p>
      )}
      {allowNotReady && (
        <div className="readiness-decision">
          <p>
            Не готовы:{' '}
            {snapshot.participants
              .filter((p) => p.connectionState !== 'online' || p.readiness !== 'ready')
              .map((p) => p.displayName)
              .join(', ') || 'проверяем готовность участников'}
            .
          </p>
          <div className="button-row">
            <button className="button button-secondary" onClick={() => setAllowNotReady(false)}>
              Подождать
            </button>
            <button
              className="button button-primary"
              onClick={() => {
                void command({ type: 'playback.play', payload: { allowNotReady: true } })
              }}
            >
              Начать без ожидания
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
