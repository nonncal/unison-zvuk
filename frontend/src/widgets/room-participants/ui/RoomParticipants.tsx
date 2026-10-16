import { Headphones, Link2, LoaderCircle, Plus, Radio, VolumeX } from 'lucide-react'
import type { Snapshot } from '@/entities/room'
export function RoomParticipants({
  snapshot,
  participantId,
  isHost,
  onInvite,
  onClose,
  extra,
  renderActions,
}: {
  snapshot: Snapshot
  participantId: string | null
  isHost: boolean
  onInvite: () => void
  extra?: React.ReactNode
  renderActions?: (participant: Snapshot['participants'][number]) => React.ReactNode
  onClose: () => void
}) {
  return (
    <aside className="together-panel">
      <div className="panel-heading">
        <h2>Участники</h2>
        <span>
          {snapshot.participants.length} из {snapshot.room.capacity}
        </span>
      </div>
      <div className="participants">
        {snapshot.participants.map((p, index) => (
          <div className="participant" key={p.id}>
            <div className={`avatar tone-${index % 6}`}>
              {p.displayName.slice(0, 1).toLocaleUpperCase()}
              <span className={`avatar-dot ${p.connectionState === 'offline' ? 'offline' : ''}`} />
            </div>
            <div className="participant-copy">
              <strong>
                {p.displayName}{' '}
                {p.id === participantId && <span className="you-label">это вы</span>}
              </strong>
              <span>{p.role === 'host' ? 'Ведущий' : p.canEdit ? 'Редактор' : 'Слушатель'}</span>
              <span className="readiness-text">
                {p.connectionState !== 'online'
                  ? 'Нет связи'
                  : !snapshot.playback.trackId
                    ? 'Ждёт выбора песни'
                    : p.readiness === 'ready'
                      ? 'Готов к старту'
                      : p.readiness === 'autoplayBlocked'
                        ? 'Нужно включить звук'
                        : p.readiness === 'error'
                          ? 'Ошибка аудио'
                          : 'Загружает трек'}
              </span>
            </div>
            {isHost && p.id !== snapshot.room.hostParticipantId && renderActions?.(p)}
            <span
              className="participant-state"
              title={
                p.connectionState === 'offline'
                  ? 'Нет связи'
                  : !snapshot.playback.trackId
                    ? 'Ждёт выбора песни'
                    : p.readiness === 'ready'
                      ? 'Готов к прослушиванию'
                      : p.readiness === 'autoplayBlocked'
                        ? 'Звук ещё не включён'
                        : 'Загружает композицию'
              }
            >
              {p.connectionState === 'offline' ? (
                <Radio size={17} />
              ) : !snapshot.playback.trackId ? (
                <Headphones size={17} />
              ) : p.readiness === 'ready' ? (
                <Headphones size={17} />
              ) : p.readiness === 'loading' || p.readiness === 'buffering' ? (
                <LoaderCircle size={17} className="spin" />
              ) : (
                <VolumeX size={17} />
              )}
            </span>
          </div>
        ))}
        {snapshot.participants.length < snapshot.room.capacity && (
          <div className="participant empty-participant">
            <div className="avatar avatar-empty">
              <Plus size={22} />
            </div>
            <div className="participant-copy">
              <strong>Свободное место</strong>
              <span>Пригласите ещё одного слушателя</span>
            </div>
          </div>
        )}
      </div>
      {snapshot.participants.length < snapshot.room.capacity && isHost && (
        <button
          className="text-link panel-invite"
          onClick={() => {
            onInvite()
          }}
        >
          Отправить приглашение <Link2 size={16} />
        </button>
      )}
      {extra}
      {snapshot.playback.trackId && (
        <div className="readiness-summary" role="status">
          <Headphones size={18} />
          <span>
            {
              snapshot.participants.filter(
                (p) => p.connectionState === 'online' && p.readiness === 'ready',
              ).length
            }{' '}
            из {snapshot.participants.length} готовы к старту
          </span>
        </div>
      )}
      <div className="room-details">
        <span>
          <span className="little-dot" />
          По приглашению
        </span>
        <span>Комната на 24 часа</span>
      </div>
      {isHost && (
        <button className="text-link close-room-link" onClick={() => onClose()}>
          Закрыть комнату для всех
        </button>
      )}
    </aside>
  )
}
