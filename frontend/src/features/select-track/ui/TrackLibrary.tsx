import { useState } from 'react'
import { Check, Search, Music2 } from 'lucide-react'
import type { Track } from '@/entities/track'
import { formatTime } from '@/shared/lib/time'
import { Cover } from '@/shared/ui/Cover'
export function Library({
  tracks,
  selected,
  onSelect,
  busy,
}: {
  tracks: Track[]
  selected: string | null
  onSelect: (track: Track) => void
  busy: boolean
}) {
  const [query, setQuery] = useState('')
  const filtered = tracks.filter((track) =>
    `${track.title} ${track.artist}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )
  return (
    <div>
      <p className="dialog-description">Что станет вашим общим моментом?</p>
      <label className="search-field">
        <Search size={19} />
        <input
          aria-label="Поиск композиции"
          placeholder="Название или исполнитель"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="track-list">
        {filtered.map((track) => (
          <div className={`track-row ${selected === track.id ? 'selected' : ''}`} key={track.id}>
            <Cover small theme={track.cover} />
            <div className="track-description">
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
            </div>
            <span className="track-duration">{formatTime(track.durationMs)}</span>
            <button
              className="track-select"
              aria-label={`Выбрать ${track.title}`}
              disabled={busy || track.status !== 'ready'}
              onClick={() => onSelect(track)}
            >
              {selected === track.id ? <Check size={19} /> : <Music2 size={19} />}
            </button>
          </div>
        ))}
      </div>
      {!filtered.length && (
        <p className="empty-search">
          Ничего не найдено.
          <br />
          Попробуйте другое название.
        </p>
      )}
    </div>
  )
}
