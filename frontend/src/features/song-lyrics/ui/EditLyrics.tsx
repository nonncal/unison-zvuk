import { useRef, useState } from 'react'
import { lyricsApi, type Track } from '@/entities/track'
import { Dialog } from '@/shared/ui/Dialog'
import { errorMessage } from '@/shared/lib/errors'
export function EditLyrics({
  roomId,
  track,
  has,
  onClose,
  onDone,
}: {
  roomId: string
  track: Track
  has: boolean
  onClose: () => void
  onDone: () => void
}) {
  const input = useRef<HTMLInputElement>(null),
    [text, setText] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  async function pick(file?: File) {
    if (!file) return
    if (file.size > 128 * 1024) return setError('Файл с текстом больше 128 КБ')
    setError('')
    setText(await file.text())
  }
  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError('')
    try {
      await action()
      onDone()
      onClose()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog title="Текст песни" onClose={onClose}>
      <p className="dialog-description">
        Файл .lrc с временными метками подсвечивает строки в такт музыке. Обычный текст показывается
        целиком.
      </p>
      <input
        ref={input}
        className="visually-hidden"
        type="file"
        accept=".lrc,.txt,text/plain"
        aria-label="Файл с текстом"
        onChange={(e) => {
          void pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <button className="button button-secondary full-width" onClick={() => input.current?.click()}>
        Выбрать файл .lrc или .txt
      </button>
      <label className="field">
        Или вставьте текст
        <textarea
          rows={8}
          value={text}
          maxLength={20000}
          placeholder={'[00:12.50] Первая строка\n[00:17.00] Вторая строка'}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <div className="button-row">
        {has && (
          <button
            className="button button-danger"
            disabled={busy}
            onClick={() => void run(() => lyricsApi.remove(roomId, track.id))}
          >
            Убрать текст
          </button>
        )}
        <button
          className="button button-primary"
          disabled={busy || !text.trim()}
          onClick={() => void run(() => lyricsApi.save(roomId, track.id, text))}
        >
          {busy ? 'Сохраняем…' : 'Сохранить текст'}
        </button>
      </div>
    </Dialog>
  )
}
