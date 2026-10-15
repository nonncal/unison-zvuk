import {
  ArrowUp,
  ArrowDown,
  Trash2,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Music2,
} from 'lucide-react'
import type { Snapshot, PlayerAction } from '@/entities/room'
import type { Track } from '@/entities/track'
import { Cover } from '@/shared/ui/Cover'
import { apiOrigin } from '@/shared/config'
type Action = (payload: Omit<PlayerAction, 'expectedPlaybackRevision'>) => void
export function PlaybackNavigation({
  snapshot,
  disabled,
  onAction,
  children,
}: {
  children?: React.ReactNode
  snapshot: Snapshot
  disabled: boolean
  onAction: Action
}) {
  const repeat = snapshot.playlist?.repeat ?? 'off',
    shuffle = snapshot.playlist?.shuffle ?? false
  return (
    <div className="playback-navigation">
      <button
        className="icon-button"
        aria-label="Перемешивание"
        aria-pressed={shuffle}
        disabled={disabled}
        onClick={() => onAction({ action: 'options', shuffle: !shuffle })}
      >
        <Shuffle size={20} />
      </button>
      <button
        className="icon-button"
        aria-label="Предыдущая песня"
        disabled={disabled || !snapshot.playback.trackId}
        onClick={() => onAction({ action: 'previous' })}
      >
        <SkipBack size={22} />
      </button>
      {children}
      <button
        className="icon-button"
        aria-label="Следующая песня"
        disabled={disabled || !snapshot.playlist?.trackIds.length}
        onClick={() => onAction({ action: 'next' })}
      >
        <SkipForward size={22} />
      </button>
      <button
        className="icon-button"
        aria-label={`Повтор: ${repeat === 'off' ? 'выключен' : repeat === 'one' ? 'одна песня' : 'вся очередь'}`}
        aria-pressed={repeat !== 'off'}
        disabled={disabled}
        onClick={() =>
          onAction({
            action: 'options',
            repeat: repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off',
          })
        }
      >
        {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
      </button>
    </div>
  )
}
export function RoomPlaylist({
  snapshot,
  tracks,
  canEdit,
  busy,
  onAction,
  onSelect,
}: {
  snapshot: Snapshot
  tracks: Track[]
  canEdit: boolean
  busy: boolean
  onAction: Action
  onSelect: (track: Track) => void
}) {
  const ids = snapshot.playlist?.trackIds ?? []
  return (
    <section className="playlist-panel" aria-label="Общая очередь">
      <div className="panel-heading">
        <h2>Очередь</h2>
        <span>{ids.length}/100</span>
      </div>
      {!ids.length && <p>Добавьте песни из подборки. Очередь общая для всех участников.</p>}
      {Boolean(snapshot.playlist?.skippedTrackIds?.length) && (
        <p className="field-hint" role="status">
          Пропущено недоступных композиций: {snapshot.playlist?.skippedTrackIds?.length}. Уберите их
          из очереди или загрузите заново.
        </p>
      )}
      <ol className="queue-list">
        {ids.map((id, index) => {
          const track = tracks.find((t) => t.id === id)
          return (
            <li key={id} className={snapshot.playback.trackId === id ? 'queue-current' : ''}>
              <span className="queue-number">{index + 1}</span>
              <Cover
                small
                src={
                  track?.coverUrl
                    ? `${apiOrigin}/api/v1/rooms/${snapshot.room.id}/${track.coverUrl}`
                    : undefined
                }
                theme={track?.cover}
              />
              <button
                className="queue-track"
                disabled={!canEdit || busy || !track}
                onClick={() => track && onSelect(track)}
              >
                <strong>{track?.title ?? 'Композиция'}</strong>
                <small>{track?.artist}</small>
              </button>
              {canEdit && (
                <div className="queue-actions">
                  <button
                    className="icon-button"
                    aria-label={`Выше ${track?.title}`}
                    disabled={busy || index === 0}
                    onClick={() => onAction({ action: 'move', trackId: id, toIndex: index - 1 })}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Ниже ${track?.title}`}
                    disabled={busy || index === ids.length - 1}
                    onClick={() => onAction({ action: 'move', trackId: id, toIndex: index + 1 })}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Убрать ${track?.title}`}
                    disabled={busy}
                    onClick={() => onAction({ action: 'remove', trackId: id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ol>
      {!canEdit && (
        <p className="field-hint">
          <Music2 size={14} /> Ведущий может выдать вам право менять очередь и плеер.
        </p>
      )}
    </section>
  )
}
