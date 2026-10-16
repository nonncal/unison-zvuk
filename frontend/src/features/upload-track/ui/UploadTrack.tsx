import { useEffect, useRef, useState } from 'react'
import { FileAudio, UploadCloud, X } from 'lucide-react'
import { gateway } from '@/entities/room'
import { lyricsApi } from '@/entities/track'
import { errorMessage } from '@/shared/lib/errors'
export function Upload({ roomId, onDone }: { roomId: string; onDone: () => void }) {
  const [stage, setStage] = useState<'idle' | 'sending' | 'processing' | 'done'>('idle'),
    [progress, setProgress] = useState(0),
    [error, setError] = useState(''),
    [name, setName] = useState(''),
    [dragging, setDragging] = useState(false),
    [lyrics, setLyricsState] = useState<File | null>(null),
    [uploadedId, setUploadedId] = useState(''),
    [note, setNote] = useState('')
  const controller = useRef<AbortController | null>(null),
    input = useRef<HTMLInputElement>(null),
    lyricsInput = useRef<HTMLInputElement>(null),
    lyricsRef = useRef<File | null>(null)
  const setLyrics = (file: File | null) => {
    lyricsRef.current = file
    setLyricsState(file)
  }
  async function saveLyrics(trackId: string, file: File) {
    try {
      await lyricsApi.save(roomId, trackId, await file.text())
      setNote('Текст сохранён')
      setLyrics(null)
      onDone()
    } catch (e) {
      setNote(`Текст не сохранён. ${errorMessage(e)}`)
    }
  }
  useEffect(() => () => controller.current?.abort(), [])
  async function upload(file?: File) {
    if (!file || stage === 'sending' || stage === 'processing') return
    const abort = new AbortController()
    controller.current = abort
    setName(file.name)
    setUploadedId('')
    setError('')
    setProgress(0)
    setStage('sending')
    try {
      const track = await gateway.upload(
        roomId,
        file,
        (value) => {
          setProgress(value)
          if (value === 100) setStage('processing')
        },
        abort.signal,
      )
      if (abort.signal.aborted) return
      setUploadedId(track.id)
      // The lyrics file may have been picked while the audio was still uploading.
      if (lyricsRef.current && gateway.mode === 'api') await saveLyrics(track.id, lyricsRef.current)
      setStage('done')
      onDone()
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError(errorMessage(e))
      setStage('idle')
    }
  }
  const busy = stage === 'sending' || stage === 'processing'
  return (
    <div>
      <p className="dialog-description">
        Файл увидят только участники этой комнаты. Обложка из тегов файла подставится автоматически.
      </p>
      <input
        ref={input}
        className="visually-hidden"
        type="file"
        accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4"
        aria-label="Выберите аудиофайл"
        onChange={(e) => {
          void upload(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {gateway.mode === 'api' && (
        <div className="lyrics-pick">
          <input
            ref={lyricsInput}
            className="visually-hidden"
            type="file"
            accept=".lrc,.txt,text/plain"
            aria-label="Файл с текстом песни"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              if (file.size > 128 * 1024) return setNote('Файл с текстом больше 128 КБ')
              setNote('')
              setLyrics(file)
              // A song that is already uploaded takes the text right away.
              if (uploadedId && stage === 'done') void saveLyrics(uploadedId, file)
            }}
          />
          <button className="text-link" onClick={() => lyricsInput.current?.click()}>
            {lyrics ? `Текст: ${lyrics.name}` : 'Добавить текст песни (.lrc или .txt)'}
          </button>
          {lyrics && (
            <button className="text-link" disabled={busy} onClick={() => setLyrics(null)}>
              Убрать
            </button>
          )}
        </div>
      )}
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void upload(e.dataTransfer.files[0])
        }}
      >
        <span className="upload-icon">
          <UploadCloud size={31} />
        </span>
        <h3>Перетащите композицию сюда</h3>
        <p>MP3, WAV или M4A · до 50 МБ и 15 минут</p>
        <button
          className="button button-secondary"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          Выбрать файл
        </button>
      </div>
      {name && (
        <div className="upload-file">
          <FileAudio size={23} />
          <div>
            <strong title={name}>{name}</strong>
            <span role="status">
              {stage === 'done'
                ? 'Композиция добавлена в подборку'
                : stage === 'processing'
                  ? 'Обрабатываем аудио…'
                  : stage === 'sending'
                    ? `Отправляем: ${progress}%`
                    : 'Можно выбрать другой файл'}
            </span>
            {stage === 'sending' && (
              <progress max={100} value={progress} aria-label="Отправка файла" />
            )}
          </div>
          {busy && (
            <button
              className="icon-button"
              aria-label="Отменить загрузку"
              onClick={() => controller.current?.abort()}
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}
      {note && (
        <p className="field-hint" role="status">
          {note}
        </p>
      )}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <p className="field-hint">
        {gateway.mode === 'demo'
          ? 'В демоверсии файл хранится только в этом браузере. Серверная обработка ещё не подключена.'
          : 'Файл доступен вашей комнате и удаляется не позднее 24 часов после её завершения.'}
      </p>
    </div>
  )
}
