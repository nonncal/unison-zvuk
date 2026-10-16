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
  const duration = snapshot.playback.durationMs || 1,
    shown = previewSeek ?? position,
    fraction = Math.min(1, Math.max(0, shown / duration)),
    playLabel = displayStatus === 'playing' ? 'Пауза для всех' : 'Воспроизвести для всех',
    togglePlay = () => {
      void unlock()
      void command(
        displayStatus === 'playing'
          ? { type: 'playback.pause', payload: {} }
          : { type: 'playback.play', payload: { allowNotReady: false } },
      )
    },
    playButton = (
      <button
        className="play-button"
        disabled={controlsDisabled || !selected || audio.state === 'loading'}
        aria-label={playLabel}
        onClick={togglePlay}
      >
        {busy || audio.state === 'loading' || audio.state === 'buffering' ? (
          <LoaderCircle size={28} className="spin" />
        ) : displayStatus === 'playing' ? (
          <Pause size={28} fill="currentColor" />
        ) : (
          <Play size={28} fill="currentColor" />
        )}
      </button>
    )
  return (
    <div className="player">
      <div className="player-status" aria-live="polite">
        <span className={`little-dot ${displayStatus === 'playing' ? 'dot-playing' : ''}`} />
        {statusText}
        <span className="player-status-right">
          {snapshot.participants.length}/{snapshot.room.capacity} в комнате
        </span>
      </div>
      <div className="seek-wrap" style={{ '--p': fraction } as CSSProperties}>
        {selected && (
          <div className="sync-marks" aria-hidden="true">
            {snapshot.participants.map((p, index) =>
              p.connectionState === 'online' ? (
                <span
                  key={p.id}
                  className={`sync-mark tone-${index % 6} ${p.readiness === 'ready' ? '' : 'pending'}`}
                  title={`${p.displayName}: ${p.readiness === 'ready' ? 'готов' : 'ещё загружает'}`}
                />
              ) : null,
            )}
          </div>
        )}
        <input
          type="range"
          aria-label="Общая позиция композиции"
          min={0}
          max={snapshot.playback.durationMs || 1}
          step={1000}
          aria-valuetext={`${formatTime(shown)} из ${formatTime(snapshot.playback.durationMs)}`}
          value={shown}
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
        />
        <div className="seek-times">
          <span>{formatTime(shown)}</span>
          <span>{formatTime(snapshot.playback.durationMs)}</span>
        </div>
      </div>
      <div className="player-controls">
        {gateway.mode === 'api' ? (
          <PlaybackNavigation
            snapshot={snapshot}
            disabled={controlsDisabled}
            onAction={(payload) => void playerAction(payload)}
          >
            {playButton}
          </PlaybackNavigation>
        ) : (
          <div className="playback-navigation">{playButton}</div>
        )}
      </div>
      <div className="player-foot">
        <p className="control-caption">
          {canEdit
            ? 'Трек, пауза и перемотка — общие для всех.'
            : `Трек, паузу и перемотку выбирает ${host?.displayName ?? 'ведущий'}.`}
        </p>
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
            style={{ '--p': audio.muted ? 0 : audio.volume } as CSSProperties}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
          <span className="volume-caption">Только у вас</span>
        </div>
      </div>
      {audio.state === 'locked' && selected && (
        <div className="player-notice">
          <p>Браузер не включает звук сам. Нажмите, чтобы слышать комнату.</p>
          <button
            className="button button-primary unlock-button"
            onClick={() => {
              void unlock()
            }}
          >
            <Headphones size={18} />
            Включить звук
          </button>
        </div>
      )}
      {audio.state === 'error' && (
        <p className="error-message" role="alert">
          Не удалось загрузить аудио. Проверьте сеть.{' '}
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
      {displayStatus === 'ended' && (
        <p className="player-hint" role="status">
          {canEdit
            ? 'Очередь закончилась. Добавьте песню или включите повтор.'
            : 'Очередь закончилась. Ведущий может добавить песню или включить повтор.'}
        </p>
      )}
      {allowNotReady && (
        <div className="player-notice">
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
