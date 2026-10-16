import { useEffect, useRef, useState } from 'react'
import {
  GripVertical,
  Trash2,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Music2,
} from 'lucide-react'
import type { Snapshot, PlayerAction } from '@/entities/room'
import type { Track } from '@/entities/track'
import { Cover } from '@/shared/ui/Cover'
import { apiOrigin } from '@/shared/config'
type Action = (payload: Omit<PlayerAction, 'expectedPlaybackRevision'>) => void
export function PlaybackNavigation({
  snapshot,
  disabled,
  onAction,
  children,
}: {
  children?: React.ReactNode
  snapshot: Snapshot
  disabled: boolean
  onAction: Action
}) {
  const repeat = snapshot.playlist?.repeat ?? 'off',
    shuffle = snapshot.playlist?.shuffle ?? false
  return (
    <div className="playback-navigation">
      <button
        className="icon-button"
        aria-label="Перемешивание"
        aria-pressed={shuffle}
        disabled={disabled}
        onClick={() => onAction({ action: 'options', shuffle: !shuffle })}
      >
        <Shuffle size={20} />
      </button>
      <button
        className="icon-button"
        aria-label="Предыдущая песня"
        disabled={disabled || !snapshot.playback.trackId}
        onClick={() => onAction({ action: 'previous' })}
      >
        <SkipBack size={22} />
      </button>
      {children}
      <button
        className="icon-button"
        aria-label="Следующая песня"
        disabled={disabled || !snapshot.playlist?.trackIds.length}
        onClick={() => onAction({ action: 'next' })}
      >
        <SkipForward size={22} />
      </button>
      <button
        className="icon-button"
        aria-label={`Повтор: ${repeat === 'off' ? 'выключен' : repeat === 'one' ? 'одна песня' : 'вся очередь'}`}
        aria-pressed={repeat !== 'off'}
        disabled={disabled}
        onClick={() =>
          onAction({
            action: 'options',
            repeat: repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off',
          })
        }
      >
        {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
      </button>
    </div>
  )
}
interface Drag {
  id: string
  from: number
  to: number
  dy: number
  step: number
  active: boolean
}
const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list]
  next.splice(to, 0, next.splice(from, 1)[0])
  return next
}
function scrollParent(node: HTMLElement | null) {
  for (let el = node?.parentElement; el; el = el.parentElement) {
    const overflow = getComputedStyle(el).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight)
      return el
  }
  return null
}
export function RoomPlaylist({
  snapshot,
  tracks,
  canEdit,
  busy,
  onAction,
  onSelect,
}: {
  snapshot: Snapshot
  tracks: Track[]
  canEdit: boolean
  busy: boolean
  onAction: Action
  onSelect: (track: Track) => void
}) {
  const serverIds = snapshot.playlist?.trackIds ?? [],
    key = serverIds.join(),
    [pending, setOptimistic] = useState<{ key: string; ids: string[] } | null>(null),
    [drag, setDrag] = useState<Drag | null>(null),
    [lift, setLift] = useState<{ id: string; to: number } | null>(null),
    [announce, setAnnounce] = useState(''),
    nodes = useRef(new Map<string, HTMLLIElement>()),
    session = useRef<{
      id: string
      startY: number
      startScroll: number
      pointerY: number
      mids: number[]
      scroller: HTMLElement | null
      timer: number
    } | null>(null),
    dragged = useRef(false)
  useEffect(() => {
    if (!pending) return
    const timer = window.setTimeout(() => setOptimistic(null), 2500)
    return () => clearTimeout(timer)
  }, [pending])
  useEffect(() => () => clearInterval(session.current?.timer), [])
  const liftId = lift?.id,
    liftTo = lift?.to
  useEffect(() => {
    if (liftId) nodes.current.get(liftId)?.querySelector<HTMLElement>('.queue-grip')?.focus()
  }, [liftId, liftTo])
  const base = pending?.key === key ? pending.ids : serverIds,
    ids = lift ? move(base, base.indexOf(lift.id), lift.to) : base,
    disabled = !canEdit || busy
  function commit(id: string, from: number, to: number) {
    if (from === to) return
    setOptimistic({ key, ids: move(base, from, to) })
    onAction({ action: 'move', trackId: id, toIndex: to })
  }
  function update() {
    const s = session.current
    if (!s) return
    const index = base.indexOf(s.id),
      scrolled = (s.scroller?.scrollTop ?? window.scrollY) - s.startScroll,
      dy = s.pointerY - s.startY + scrolled,
      center = s.mids[index] + dy
    let to = 0
    s.mids.forEach((mid, i) => {
      if (i !== index && mid < center) to++
    })
    const step = s.mids.length > 1 ? Math.abs(s.mids[1] - s.mids[0]) : 64
    setDrag({ id: s.id, from: index, to, dy, step, active: true })
  }
  function begin(event: React.PointerEvent<HTMLLIElement>, id: string) {
    if (disabled || event.button !== 0) return
    const target = event.target as HTMLElement
    if (target.closest('.queue-actions button')) return
    if (event.pointerType !== 'mouse' && !target.closest('.queue-grip')) return
    const scroller = scrollParent(event.currentTarget)
    session.current = {
      id,
      startY: event.clientY,
      pointerY: event.clientY,
      startScroll: scroller?.scrollTop ?? window.scrollY,
      mids: base.map((other) => {
        const rect = nodes.current.get(other)?.getBoundingClientRect()
        return rect ? rect.top + rect.height / 2 : 0
      }),
      scroller,
      timer: 0,
    }
    // Pointer moves are measured in page space so scrolling during the drag stays consistent.
  }
  function moving(event: React.PointerEvent<HTMLLIElement>) {
    const s = session.current
    if (!s) return
    s.pointerY = event.clientY
    if (!drag?.active && Math.abs(event.clientY - s.startY) < 6) return
    if (!dragged.current && !event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.setPointerCapture(event.pointerId)
    dragged.current = true
    if (!s.timer)
      s.timer = window.setInterval(() => {
        const box = s.scroller?.getBoundingClientRect(),
          top = box?.top ?? 0,
          bottom = box?.bottom ?? window.innerHeight,
          zone = 56
        const delta = s.pointerY < top + zone ? -12 : s.pointerY > bottom - zone ? 12 : 0
        if (delta) {
          if (s.scroller) s.scroller.scrollTop += delta
          else window.scrollBy(0, delta)
          update()
        }
      }, 24)
    update()
  }
  function finish(event: React.PointerEvent<HTMLLIElement>, cancel: boolean) {
    const s = session.current
    if (!s) return
    clearInterval(s.timer)
    session.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    const current = drag
    setDrag(null)
    if (!cancel && current?.active) commit(current.id, current.from, current.to)
    window.setTimeout(() => (dragged.current = false), 0)
  }
  function shift(index: number) {
    if (!drag?.active || index === drag.from) return 0
    if (drag.from < drag.to && index > drag.from && index <= drag.to) return -drag.step
    if (drag.from > drag.to && index >= drag.to && index < drag.from) return drag.step
    return 0
  }
  function grip(event: React.KeyboardEvent, id: string, index: number) {
    if (disabled) return
    const name = tracks.find((t) => t.id === id)?.title ?? 'Композиция'
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      if (!lift) {
        setLift({ id, to: index })
        setAnnounce(`${name} взята. Стрелки меняют место, пробел кладёт на место, Escape отменяет.`)
      } else {
        commit(id, base.indexOf(id), lift.to)
        setAnnounce(`${name} на месте ${lift.to + 1}.`)
        setLift(null)
      }
    } else if (lift && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault()
      const to = Math.max(
        0,
        Math.min(base.length - 1, lift.to + (event.key === 'ArrowUp' ? -1 : 1)),
      )
      setLift({ id, to })
      setAnnounce(`Место ${to + 1} из ${base.length}`)
    } else if (lift && event.key === 'Escape') {
      event.preventDefault()
      setLift(null)
      setAnnounce('Перенос отменён.')
    }
  }
  return (
    <section className="playlist-panel" aria-label="Общая очередь">
      <div className="panel-heading">
        <h2>Очередь</h2>
        <span>{ids.length}/100</span>
      </div>
      {!ids.length && <p>Добавьте песни из подборки. Очередь общая для всех участников.</p>}
      {Boolean(snapshot.playlist?.skippedTrackIds?.length) && (
        <p className="field-hint" role="status">
          Пропущено недоступных композиций: {snapshot.playlist?.skippedTrackIds?.length}. Уберите их
          из очереди или загрузите заново.
        </p>
      )}
      <span className="visually-hidden" aria-live="polite">
        {announce}
      </span>
      <ol className={`queue-list ${drag?.active ? 'is-dragging' : ''}`}>
        {ids.map((id, index) => {
          const track = tracks.find((t) => t.id === id),
            holding = drag?.active && drag.id === id,
            offset = holding ? drag.dy : shift(index)
          return (
            <li
              key={id}
              ref={(node) => {
                if (node) nodes.current.set(id, node)
                else nodes.current.delete(id)
              }}
              className={[
                snapshot.playback.trackId === id ? 'queue-current' : '',
                canEdit ? 'queue-movable' : '',
                holding || lift?.id === id ? 'queue-held' : '',
              ].join(' ')}
              style={offset ? { transform: `translateY(${offset}px)` } : undefined}
              onPointerDown={(event) => begin(event, id)}
              onPointerMove={moving}
              onPointerUp={(event) => finish(event, false)}
              onPointerCancel={(event) => finish(event, true)}
              onClickCapture={(event) => {
                if (dragged.current) {
                  event.preventDefault()
                  event.stopPropagation()
                }
              }}
            >
              {canEdit && (
                <button
                  className="queue-grip"
                  aria-label={`Переместить: ${track?.title ?? 'композиция'}. Сейчас ${index + 1} из ${ids.length}`}
                  aria-pressed={lift?.id === id}
                  disabled={disabled}
                  onKeyDown={(event) => grip(event, id, index)}
                  onBlur={(event) => {
                    // Reordering the DOM blurs the button with no new target; that is not a cancel.
                    if (event.relatedTarget) setLift(null)
                  }}
                >
                  <GripVertical size={18} />
                </button>
              )}
              <span className="queue-number">{index + 1}</span>
              <Cover
                small
                src={
                  track?.coverUrl
                    ? `${apiOrigin}/api/v1/rooms/${snapshot.room.id}/${track.coverUrl}`
                    : undefined
                }
                theme={track?.cover}
              />
              <button
                className="queue-track"
                disabled={!canEdit || busy || !track}
                onClick={() => track && onSelect(track)}
              >
                <strong>{track?.title ?? 'Композиция'}</strong>
                <small>{track?.artist}</small>
              </button>
              {canEdit && (
                <div className="queue-actions">
                  <button
                    className="icon-button"
                    aria-label={`Убрать ${track?.title}`}
                    disabled={busy}
                    onClick={() => onAction({ action: 'remove', trackId: id })}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ol>
      {canEdit && ids.length > 1 && (
        <p className="field-hint">Возьмите песню за любое место и перенесите, куда нужно.</p>
      )}
      {!canEdit && (
        <p className="field-hint">
          <Music2 size={14} /> Ведущий может выдать вам право менять очередь и плеер.
        </p>
      )}
    </section>
  )
}
