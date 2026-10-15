import { useEffect, useRef, useState } from 'react'
import { roomApi, type Snapshot } from '@/entities/room'
import { Dialog } from '@/shared/ui/Dialog'
import { errorMessage } from '@/shared/lib/errors'
export function RoomSettings({
  snapshot,
  onClose,
  onSnapshot,
}: {
  snapshot: Snapshot
  onClose: () => void
  onSnapshot: (s: Snapshot) => void
}) {
  const [capacity, setCapacity] = useState(snapshot.room.capacity),
    [moderated, setModerated] = useState(snapshot.room.moderated ?? false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      onSnapshot(await roomApi.settings(snapshot.room.id, { capacity, moderated }))
      onClose()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog title="Настройки комнаты" onClose={onClose}>
      <form onSubmit={save}>
        <label className="field">
          Максимум участников
          <select value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}>
            {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
              <option key={n} value={n}>
                {n} человек
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={moderated}
            onChange={(e) => setModerated(e.target.checked)}
          />
          Зал ожидания: впускает ведущий
        </label>
        <p className="field-hint">
          Гости ожидают одобрения, не получают аудио и не занимают место в комнате до допуска.
        </p>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary full-width" disabled={busy}>
          {busy ? 'Сохраняем…' : 'Сохранить настройки'}
        </button>
      </form>
    </Dialog>
  )
}
export function WaitingRoom({ roomId }: { roomId: string }) {
  const [items, setItems] = useState<Awaited<ReturnType<typeof roomApi.waiting>>['items']>([]),
    [busy, setBusy] = useState(''),
    [error, setError] = useState('')
  const sequence = useRef(0)
  useEffect(() => {
    let active = true
    const load = async () => {
      const seq = ++sequence.current
      try {
        const data = await roomApi.waiting(roomId)
        if (active && seq === sequence.current) setItems(data.items)
      } catch (e) {
        if (active) setError(errorMessage(e))
      }
    }
    void load()
    const timer = window.setInterval(() => void load(), 2500)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [roomId])
  async function decide(id: string, admit: boolean) {
    ++sequence.current
    setBusy(id)
    setError('')
    try {
      const data = await roomApi.decide(roomId, id, admit)
      ++sequence.current
      setItems(data.items)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy('')
    }
  }
  return (
    <section className="waiting-panel" aria-label="Зал ожидания">
      <div className="panel-heading">
        <h3>Зал ожидания</h3>
        <span>{items.length}</span>
      </div>
      {!items.length && <p className="field-hint">Здесь появятся заявки на вход.</p>}
      {items.map((p) => (
        <div className="waiting-guest" key={p.id}>
          <strong>{p.displayName}</strong>
          <button
            className="text-link"
            disabled={Boolean(busy)}
            onClick={() => void decide(p.id, true)}
          >
            Впустить {p.displayName}
          </button>
          <button
            className="text-link"
            disabled={Boolean(busy)}
            onClick={() => void decide(p.id, false)}
          >
            Отклонить {p.displayName}
          </button>
        </div>
      ))}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export function ParticipantActions({
  roomId,
  id,
  name,
  canEdit,
  onSnapshot,
}: {
  roomId: string
  id: string
  name: string
  canEdit: boolean
  onSnapshot: (s: Snapshot) => void
}) {
  const [confirm, setConfirm] = useState<'transfer' | 'remove' | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  async function permission() {
    setBusy(true)
    setError('')
    try {
      onSnapshot(await roomApi.permission(roomId, id, !canEdit))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  async function act() {
    if (!confirm) return
    setBusy(true)
    setError('')
    try {
      onSnapshot(await roomApi.memberAction(roomId, id, confirm))
      setConfirm(null)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="member-actions">
      <button
        className="text-link"
        disabled={busy}
        aria-label={`${canEdit ? 'Отозвать' : 'Выдать'} права: ${name}`}
        onClick={() => void permission()}
      >
        {canEdit ? 'Убрать права' : 'Дать права'}
      </button>
      <button
        className="text-link"
        disabled={busy}
        aria-label={`Передать роль: ${name}`}
        onClick={() => setConfirm('transfer')}
      >
        Сделать ведущим
      </button>
      <button
        className="text-link"
        disabled={busy}
        aria-label={`Удалить участника: ${name}`}
        onClick={() => setConfirm('remove')}
      >
        Удалить
      </button>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      {confirm && (
        <Dialog
          title={confirm === 'transfer' ? `Передать роль ${name}?` : `Удалить ${name}?`}
          onClose={() => !busy && setConfirm(null)}
        >
          <p className="dialog-description">
            {confirm === 'transfer'
              ? 'Вы останетесь слушателем. Новый ведущий получит управление доступом и комнатой.'
              : 'Участник потеряет доступ к комнате. Уже загруженное аудио нельзя отозвать с устройства; ранее выданная ссылка на файл истекает за 5 минут.'}
          </p>
          <div className="button-row">
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={() => setConfirm(null)}
            >
              Отмена
            </button>
            <button className="button button-danger" disabled={busy} onClick={() => void act()}>
              {confirm === 'transfer' ? 'Передать роль' : 'Удалить из комнаты'}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
