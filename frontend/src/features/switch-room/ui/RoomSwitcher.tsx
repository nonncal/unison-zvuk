import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomApi } from '@/entities/room'
import { Dialog } from '@/shared/ui/Dialog'
import { errorMessage } from '@/shared/lib/errors'
export function RoomSwitcher({
  currentId,
  onClose,
  onCreate,
}: {
  currentId: string
  onClose: () => void
  onCreate: () => void
}) {
  const navigate = useNavigate(),
    [rooms, setRooms] = useState<Awaited<ReturnType<typeof roomApi.mine>>['items']>([]),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    roomApi
      .mine()
      .then((data) => {
        if (active) setRooms(data.items)
      })
      .catch((e) => {
        if (active) setError(errorMessage(e))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])
  return (
    <Dialog title="Ваши комнаты" onClose={onClose}>
      <p className="dialog-description">В каждой комнате своя очередь и свои участники.</p>
      {loading && <p role="status">Загружаем комнаты…</p>}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <div className="room-switch-list">
        {rooms.map((room) => (
          <button
            key={room.id}
            className="button button-secondary"
            disabled={room.id === currentId}
            onClick={() => {
              onClose()
              navigate(`/room/${room.id}`)
            }}
          >
            <span>{room.title}</span>
            <small>
              {room.id === currentId
                ? 'Вы здесь'
                : `${room.role === 'host' ? 'Ведущий' : 'Слушатель'} · до ${room.capacity} человек`}
            </small>
          </button>
        ))}
      </div>
      <button className="button button-primary full-width" onClick={onCreate}>
        Создать ещё одну комнату
      </button>
    </Dialog>
  )
}
