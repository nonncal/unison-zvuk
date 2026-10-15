import { useEffect, useState } from 'react'
import type { Reaction, ReactionEmoji, Participant } from '@/entities/room'
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
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(timer)
  }, [])
  return (
    <section className="room-reactions" aria-label="Реакции">
      <div className="reaction-stream" aria-live="polite" aria-atomic="false">
        {reactions
          .filter((r) => r.createdAt > now - 5000)
          .map((r, i) => (
            <span
              className="reaction-bubble"
              key={r.id}
              style={{ left: `${10 + ((i * 17) % 75)}%` }}
            >
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
