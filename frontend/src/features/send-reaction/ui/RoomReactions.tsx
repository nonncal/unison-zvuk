import { useEffect, useState } from 'react'
import type { Reaction, ReactionEmoji, Participant } from '@/entities/room'
const LIFETIME_MS = 4600
function lane(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return 4 + (hash % 84)
}
const emojis: ReactionEmoji[] = ['❤️', '🔥', '👏', '✨', '🎶', '😂']
export function RoomReactions({
  reactions,
  participants,
  disabled,
  onReact,
}: {
  reactions: Reaction[]
  participants: Participant[]
  disabled: boolean
  onReact: (emoji: ReactionEmoji) => void
}) {
  // A bubble keeps one lane for its whole life (derived from its id), and leaves the
  // list only once its animation is over, so a burst of reactions never reshuffles
  // the bubbles that are still rising.
  const [now, setNow] = useState(() => Date.now())
  const live = reactions.filter((r) => r.createdAt > now - LIFETIME_MS)
  const active = live.length > 0
  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setNow(Date.now()), 750)
    return () => clearInterval(timer)
  }, [active])
  return (
    <section className="room-reactions" aria-label="Реакции">
      <div className="reaction-stream" aria-live="polite" aria-atomic="false">
        {live.map((r) => (
          <span className="reaction-bubble" key={r.id} style={{ left: `${lane(r.id)}%` }}>
            {r.emoji}
            <small>
              {participants.find((p) => p.id === r.participantId)?.displayName ?? 'Участник'}
            </small>
          </span>
        ))}
      </div>
      <div className="reaction-buttons">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            className="reaction-button"
            aria-label={`Реакция ${emoji}`}
            disabled={disabled}
            onClick={() => onReact(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </section>
  )
}
