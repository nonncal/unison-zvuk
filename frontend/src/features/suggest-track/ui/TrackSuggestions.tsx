import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { roomApi, type Snapshot } from '@/entities/room'
import type { Track } from '@/entities/track'
import { errorMessage } from '@/shared/lib/errors'
import './suggestions.css'
export function TrackSuggestions({
  snapshot,
  tracks,
  isHost,
  disabled,
  onSnapshot,
}: {
  snapshot: Snapshot
  tracks: Track[]
  isHost: boolean
  disabled: boolean
  onSnapshot: (value: Snapshot) => void
}) {
  const [trackId, setTrackId] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const pending = snapshot.playlist?.suggestions ?? []
  const available = tracks.filter(
    (t) =>
      t.status === 'ready' &&
      !snapshot.playlist?.trackIds.includes(t.id) &&
      !pending.some((s) => s.trackId === t.id),
  )
  async function run(action: () => Promise<Snapshot>, success: string) {
    if (busy || disabled) return
    setBusy(true)
    setMessage('')
    try {
      onSnapshot(await action())
      setMessage(success)
      setTrackId('')
    } catch (e) {
      setMessage(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  if (!available.length && !pending.length && !message) return null
  return (
    <section className="suggestions-panel" aria-label="Предложения песен">
      <h2>Что послушаем дальше?</h2>
      <p>Предложить песню может каждый. Ведущий добавит её в общую очередь.</p>
      {available.length > 0 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (trackId)
              void run(
                () => roomApi.suggest(snapshot.room.id, trackId),
                'Предложение отправлено ведущему.',
              )
          }}
        >
          <select
            aria-label="Предложить композицию"
            value={available.some((t) => t.id === trackId) ? trackId : ''}
            onChange={(e) => setTrackId(e.target.value)}
            disabled={busy || disabled}
          >
            <option value="">Выберите песню</option>
            {available.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} — {t.artist}
              </option>
            ))}
          </select>
          <button
            className="button button-secondary"
            disabled={!available.some((t) => t.id === trackId) || busy || disabled}
          >
            <Plus size={18} />
            Предложить
          </button>
        </form>
      ) : (
        <p className="field-hint">Все доступные песни уже в очереди или предложены.</p>
      )}
      <ul>
        {pending.map((s) => (
          <li key={s.id}>
            <div>
              <strong>{tracks.find((t) => t.id === s.trackId)?.title ?? 'Композиция'}</strong>
              <span>Предлагает {s.displayName}</span>
            </div>
            {isHost && (
              <div className="suggestion-actions">
                <button
                  className="icon-button"
                  title="Добавить в очередь"
                  aria-label={`Принять предложение ${tracks.find((t) => t.id === s.trackId)?.title}`}
                  disabled={busy || disabled}
                  onClick={() =>
                    void run(
                      () => roomApi.decideSuggestion(snapshot.room.id, s.id, true),
                      'Песня добавлена в очередь.',
                    )
                  }
                >
                  <Check size={20} />
                </button>
                <button
                  className="icon-button"
                  title="Отклонить"
                  aria-label={`Отклонить предложение ${tracks.find((t) => t.id === s.trackId)?.title}`}
                  disabled={busy || disabled}
                  onClick={() =>
                    void run(
                      () => roomApi.decideSuggestion(snapshot.room.id, s.id, false),
                      'Предложение отклонено.',
                    )
                  }
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {message && <p role="status">{message}</p>}
    </section>
  )
}
