import { Headphones, Link2, LoaderCircle, Plus, Radio, VolumeX } from 'lucide-react'
import type { Snapshot } from '@/entities/room'
export function RoomParticipants({
  snapshot,
  participantId,
  isHost,
  onInvite,
  onClose,
}: {
  snapshot: Snapshot
  participantId: string | null
  isHost: boolean
  onInvite: () => void
  onClose: () => void
}) {
  return (
    <aside className="together-panel">
      <div className="panel-heading">
        <h2>На одной волне</h2>
        <span>{snapshot.participants.length} из 2</span>
      </div>
      <div className="participants">
        {snapshot.participants.map((p, index) => (
          <div className="participant" key={p.id}>
            <div className={`avatar ${index ? 'avatar-plum' : ''}`}>
              {p.displayName.slice(0, 1).toLocaleUpperCase()}
              <span className={`avatar-dot ${p.connectionState === 'offline' ? 'offline' : ''}`} />
            </div>
            <div className="participant-copy">
              <strong>
                {p.displayName}{' '}
                {p.id === participantId && <span className="you-label">это вы</span>}
              </strong>
              <span>{p.role === 'host' ? 'Ведущий комнаты' : 'Слушатель'}</span>
            </div>
            <span
              className="participant-state"
              title={
                p.connectionState === 'offline'
                  ? 'Нет связи'
                  : p.readiness === 'ready'
                    ? 'Готов к прослушиванию'
                    : p.readiness === 'autoplayBlocked'
                      ? 'Звук ещё не включён'
                      : 'Загружает композицию'
              }
            >
              {p.connectionState === 'offline' ? (
                <Radio size={17} />
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
        {snapshot.participants.length < 2 && (
          <div className="participant empty-participant">
            <div className="avatar avatar-empty">
              <Plus size={22} />
            </div>
            <div className="participant-copy">
              <strong>Для вашего человека</strong>
              <span>Место рядом пока свободно</span>
            </div>
          </div>
        )}
      </div>
      {snapshot.participants.length < 2 && isHost && (
        <button
          className="text-link panel-invite"
          onClick={() => {
            onInvite()
          }}
        >
          Отправить приглашение <Link2 size={16} />
        </button>
      )}
      <div className="together-note">
        <span className="note-icon">
          <Headphones size={21} />
        </span>
        <h3>Расстояние — это условность.</h3>
        <p>
          Включите одну песню.
          <br />
          Побудьте в одном моменте.
        </p>
      </div>
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
