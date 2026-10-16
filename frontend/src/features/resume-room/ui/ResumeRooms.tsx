import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { gateway, roomApi } from '@/entities/room'
import './resume-rooms.css'
type Mine = Awaited<ReturnType<typeof roomApi.mine>>['items']
export function ResumeRooms() {
  const [rooms, setRooms] = useState<Mine>([])
  useEffect(() => {
    if (gateway.mode !== 'api') return
    let active = true
    roomApi
      .mine()
      .then((data) => {
        if (active) setRooms(data.items)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])
  if (!rooms.length) return null
  return (
    <section className="resume" aria-label="Ваши комнаты">
      <h2>{rooms.length === 1 ? 'Ваша комната уже открыта' : 'Ваши открытые комнаты'}</h2>
      <ul>
        {rooms.map((room, index) => (
          <li key={room.id}>
            <Link to={`/room/${room.id}`} className={`resume-room tone-${index % 6}`}>
              <span className="resume-mark" aria-hidden="true" />
              <span className="resume-text">
                <strong>{room.title}</strong>
                <small>
                  {room.role === 'host' ? 'Вы ведущий' : 'Вы слушатель'}, до {room.capacity} мест
                </small>
              </span>
              <span className="resume-go">
                Вернуться <ArrowRight size={18} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
