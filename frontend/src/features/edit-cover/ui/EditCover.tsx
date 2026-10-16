import { useRef, useState } from 'react'
import { roomApi } from '@/entities/room'
import { errorMessage } from '@/shared/lib/errors'
export function EditCover({
  roomId,
  trackId,
  onDone,
}: {
  roomId: string
  trackId: string
  onDone: () => void
}) {
  const input = useRef<HTMLInputElement>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  async function save(file?: File) {
    if (!file || busy) return
    setError('')
    if (file.size > 5 * 1024 * 1024) {
      setError('Обложка должна быть меньше 5 МБ')
      return
    }
    setBusy(true)
    try {
      await roomApi.cover(roomId, trackId, file)
      onDone()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="edit-cover">
      <input
        className="visually-hidden"
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label="Файл обложки"
        onChange={(e) => {
          void save(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <button className="text-link" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? 'Сохраняем обложку…' : 'Изменить обложку'}
      </button>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  )
}
