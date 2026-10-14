import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog } from '@/shared/ui/Dialog'
import { gateway } from '@/entities/room'
import { errorMessage } from '@/shared/lib/errors'
export function CreateRoomDialog({
  onClose,
  onUnlock,
}: {
  onClose: () => void
  onUnlock: () => Promise<void>
}) {
  const navigate = useNavigate(),
    [name, setName] = useState(''),
    [title, setTitle] = useState('Вечер на двоих'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    void onUnlock().catch(() => undefined)
    try {
      const room = await gateway.create(name.trim(), title.trim())
      navigate(`/room/${room.roomId}`)
    } catch (e) {
      setError(errorMessage(e))
      setBusy(false)
    }
  }
  return (
    <Dialog
      title="Ваша новая комната"
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <p className="dialog-description">Сначала — ваше имя. Потом — любимая музыка.</p>
      <form onSubmit={submit}>
        <label className="field">
          Как вас зовут
          <input
            autoFocus
            required
            minLength={1}
            maxLength={32}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
          />
        </label>
        <label className="field">
          Название комнаты
          <input required maxLength={64} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button
          className="button button-primary full-width"
          disabled={busy || !name.trim() || !title.trim()}
        >
          {busy ? 'Создаём комнату…' : 'Создать комнату'}
        </button>
      </form>
    </Dialog>
  )
}
