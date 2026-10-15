import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Headphones, Link2 } from 'lucide-react'
import { Brand } from '@/shared/ui/Brand'
import { ModeNotice } from '@/shared/ui/ModeNotice'
import { gateway, roomApi } from '@/entities/room'
import { audioEngine } from '@/features/listen-together'
import type { Preview } from '@/entities/room'
import { errorMessage, AppError } from '@/shared/lib/errors'
export function Join() {
  const { roomId = '' } = useParams(),
    navigate = useNavigate(),
    [token] = useState(() => new URLSearchParams(location.hash.slice(1)).get('invite') ?? ''),
    [preview, setPreview] = useState<Preview | null>(null),
    [error, setError] = useState(''),
    [name, setName] = useState(() => sessionStorage.getItem(`unison:waiting:name:${roomId}`) ?? ''),
    [pending, setPending] = useState(
      () => sessionStorage.getItem(`unison:waiting:${roomId}`) === '1',
    ),
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
  useEffect(() => {
    if (!pending || gateway.mode !== 'api') return
    let active = true,
      timer = 0
    const poll = async () => {
      try {
        const result = await roomApi.admission(roomId)
        if (!active) return
        if (result.status === 'approved' || result.status === 'admitted') {
          await gateway.join(roomId, token, name)
          if (!active) return
          sessionStorage.removeItem(`unison:waiting:${roomId}`)
          navigate(`/room/${roomId}`, { replace: true })
          return
        }
        if (['expired', 'cancelled', 'rejected', 'none'].includes(result.status)) {
          sessionStorage.removeItem(`unison:waiting:${roomId}`)
          setPending(false)
          setError(
            result.status === 'rejected'
              ? 'Ведущий отклонил заявку.'
              : 'Заявка истекла или отменена. Можно отправить её снова.',
          )
          return
        }
      } catch (e) {
        if (active) setError(errorMessage(e))
      }
      if (active) timer = window.setTimeout(() => void poll(), 2000)
    }
    void poll()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [pending, roomId, token, name, navigate])
  async function cancelWaiting() {
    try {
      await roomApi.cancelAdmission(roomId)
      sessionStorage.removeItem(`unison:waiting:${roomId}`)
      setPending(false)
      setError('')
    } catch (e) {
      setError(errorMessage(e))
    }
  }
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
      if (e instanceof AppError && e.code === 'JOIN_PENDING') {
        sessionStorage.setItem(`unison:waiting:${roomId}`, '1')
        sessionStorage.setItem(`unison:waiting:name:${roomId}`, name.trim())
        setPending(true)
      } else setError(errorMessage(e))
      setBusy(false)
    }
  }
  const full = preview && !preview.moderated && preview.participantCount >= preview.capacity
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
        {pending ? (
          <div className="entry-form">
            <p role="status">Вы в зале ожидания. Ведущий решает, кого впустить.</p>
            <p className="field-hint">
              Можно оставить эту страницу открытой. До одобрения вы не подключены к музыке.
            </p>
            <button className="button button-secondary" onClick={() => void cancelWaiting()}>
              Отменить заявку
            </button>
          </div>
        ) : !preview && !error ? (
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
              {busy
                ? 'Присоединяемся…'
                : preview.moderated
                  ? 'Попросить впустить'
                  : 'Войти и включить звук'}
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
            {preview?.capacity === 2
              ? 'Комната уже заполнена. Здесь могут слушать двое.'
              : `Комната уже заполнена. Мест в комнате: ${preview?.capacity}.`}
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
