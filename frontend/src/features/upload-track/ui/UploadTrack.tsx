import { useEffect, useRef, useState } from 'react'
import { FileAudio, UploadCloud, X } from 'lucide-react'
import { gateway } from '@/entities/room'
import { errorMessage } from '@/shared/lib/errors'
export function Upload({ roomId, onDone }: { roomId: string; onDone: () => void }) {
  const [stage, setStage] = useState<'idle' | 'sending' | 'processing' | 'done'>('idle'),
    [progress, setProgress] = useState(0),
    [error, setError] = useState(''),
    [name, setName] = useState(''),
    [dragging, setDragging] = useState(false)
  const controller = useRef<AbortController | null>(null),
    input = useRef<HTMLInputElement>(null)
  useEffect(() => () => controller.current?.abort(), [])
  async function upload(file?: File) {
    if (!file || stage === 'sending' || stage === 'processing') return
    const abort = new AbortController()
    controller.current = abort
    setName(file.name)
    setError('')
    setProgress(0)
    setStage('sending')
    try {
      await gateway.upload(
        roomId,
        file,
        (value) => {
          setProgress(value)
          if (value === 100) setStage('processing')
        },
        abort.signal,
      )
      if (abort.signal.aborted) return
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
