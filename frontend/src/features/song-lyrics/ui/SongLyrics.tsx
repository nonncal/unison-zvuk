import { useEffect, useRef, useState } from 'react'
import { lyricsApi, type Lyrics, type Track } from '@/entities/track'
import { errorMessage } from '@/shared/lib/errors'
import { activeLine } from '../lib/active-line'
import { EditLyrics } from './EditLyrics'
import './song-lyrics.css'
const origin = {
  lrc: 'Текст из файла .lrc',
  text: 'Текст без таймкодов',
  embedded: 'Текст из тегов файла',
}
type Loaded = { key: string; lyrics: Lyrics | null; error: string }
export function SongLyrics({
  roomId,
  track,
  positionMs,
  canEdit,
  onSeek,
  onChanged,
}: {
  roomId: string
  track: Track | undefined
  positionMs: number
  canEdit: boolean
  onSeek?: (ms: number) => void
  onChanged: () => void
}) {
  const key = track?.lyricsUrl ? `${roomId}/${track.lyricsUrl}` : '',
    [loaded, setLoaded] = useState<Loaded | null>(null),
    [editing, setEditing] = useState(false),
    scroller = useRef<HTMLDivElement>(null),
    current = useRef<HTMLElement | null>(null),
    pausedUntil = useRef(0)
  useEffect(() => {
    if (!key || !track?.lyricsUrl) return
    let active = true
    lyricsApi
      .get(roomId, track.lyricsUrl)
      .then((lyrics) => active && setLoaded({ key, lyrics, error: '' }))
      .catch((e) => active && setLoaded({ key, lyrics: null, error: errorMessage(e) }))
    return () => {
      active = false
    }
  }, [key, roomId, track?.lyricsUrl])
  const state = loaded?.key === key ? loaded : null,
    lyrics = state?.lyrics ?? null,
    index = lyrics?.kind === 'synced' ? activeLine(lyrics.lines ?? [], positionMs) : -1
  useEffect(() => {
    const box = scroller.current,
      line = current.current
    if (!box || !line || Date.now() < pausedUntil.current) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    box.scrollTo({
      top: line.offsetTop - box.clientHeight / 2 + line.clientHeight / 2,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [index, lyrics])
  if (!track) return null
  const own = track.source === 'upload'
  if (!key)
    return (
      <section className="lyrics lyrics-empty" aria-label="Текст песни">
        <p>У этой песни нет текста.</p>
        {canEdit && own && (
          <button className="text-link" onClick={() => setEditing(true)}>
            Добавить текст
          </button>
        )}
        {editing && (
          <EditLyrics
            roomId={roomId}
            track={track}
            has={false}
            onClose={() => setEditing(false)}
            onDone={onChanged}
          />
        )}
      </section>
    )
  return (
    <section className="lyrics" aria-label="Текст песни">
      {state?.error && (
        <p role="alert" className="error-message">
          {state.error}
        </p>
      )}
      {!state && <p role="status">Загружаем текст…</p>}
      {lyrics && (
        <>
          <div
            className={`lyrics-scroll ${lyrics.kind}`}
            ref={scroller}
            tabIndex={0}
            onWheel={() => (pausedUntil.current = Date.now() + 4000)}
            onTouchMove={() => (pausedUntil.current = Date.now() + 4000)}
          >
            {lyrics.kind === 'synced' ? (
              <ol>
                {(lyrics.lines ?? []).map((line, i) => (
                  <li
                    key={`${line.t}-${i}`}
                    ref={(node) => {
                      if (i === index) current.current = node
                    }}
                    className={i === index ? 'now' : i < index ? 'past' : ''}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    {line.text &&
                      (onSeek ? (
                        <button onClick={() => onSeek(line.t)}>{line.text}</button>
                      ) : (
                        line.text
                      ))}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="plain">{lyrics.text}</p>
            )}
          </div>
          <div className="lyrics-foot">
            <small>{origin[lyrics.source]}</small>
            {canEdit && own && (
              <button className="text-link" onClick={() => setEditing(true)}>
                Изменить текст
              </button>
            )}
          </div>
        </>
      )}
      {editing && (
        <EditLyrics
          roomId={roomId}
          track={track}
          has
          onClose={() => setEditing(false)}
          onDone={onChanged}
        />
      )}
    </section>
  )
}
