import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Headphones, Link2 } from 'lucide-react'
import { Brand } from '@/shared/ui/Brand'
import { ModeNotice } from '@/shared/ui/ModeNotice'
import { gateway } from '@/entities/room'
import { audioEngine } from '@/features/listen-together'
import type { Preview } from '@/entities/room'
import { errorMessage } from '@/shared/lib/errors'
export function Join() {
  const { roomId = '' } = useParams(),
    navigate = useNavigate(),
    [token] = useState(() => new URLSearchParams(location.hash.slice(1)).get('invite') ?? ''),
    [preview, setPreview] = useState<Preview | null>(null),
    [error, setError] = useState(''),
    [name, setName] = useState(''),
    [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    gateway
      .preview(roomId, token)
      .then((value) => {
        if (active) setPreview(value)
      })
      .catch((e) => {
        if (active) setError(errorMessage(e))
      })
    return () => {
      active = false
    }
  }, [roomId, token])
  async function join(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    void audioEngine.unlock().catch(() => undefined)
    try {
      await gateway.join(roomId, token, name.trim())
      navigate(`/room/${roomId}`, { replace: true })
    } catch (e) {
      setError(errorMessage(e))
      setBusy(false)
    }
  }
  const full = preview && preview.participantCount >= preview.capacity
  return (
    <div className="entry-page">
      <header className="site-header">
        <Brand />
        <span className="header-note">Вместе — с первой ноты</span>
      </header>
      <ModeNotice />
      <main className="entry-main">
        <div className="entry-icon">
          <Headphones size={32} />
        </div>
        <p className="soft-label">Вас пригласили слушать вместе</p>
        <h1>{preview?.title ?? 'Ваш общий момент'}</h1>
        <p className="entry-description">
          Один трек. Один плеер.
          <br />И человек на другой стороне.
        </p>
        {!preview && !error ? (
          <p role="status">Открываем приглашение…</p>
        ) : preview && !full ? (
          <form className="entry-form" onSubmit={join}>
            <label className="field">
              Как вас зовут
              <input
                autoFocus
                required
                maxLength={32}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
              />
            </label>
            <button className="button button-primary full-width" disabled={busy || !name.trim()}>
              <Headphones size={19} />
              {busy ? 'Присоединяемся…' : 'Войти и включить звук'}
            </button>
            <p className="field-hint">
              Микрофон и камера не нужны.
              <br />
              Звук включается только с вашего разрешения.
            </p>
          </form>
        ) : null}
        {full && (
          <p className="error-message" role="alert">
            Комната уже заполнена. Здесь могут слушать двое.
          </p>
        )}
        {error && (
          <p className="error-message entry-error" role="alert">
            {error}
          </p>
        )}
        {(error || full) && (
          <Link className="button button-secondary" to="/">
            Создать свою комнату
          </Link>
        )}
        <p className="privacy-note">
          <Link2 size={14} /> Комната доступна по приглашению
        </p>
      </main>
    </div>
  )
}
