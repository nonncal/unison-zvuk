function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('unison-demo-assets', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('audio')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(new Error('Хранилище браузера недоступно. Разрешите локальное хранение.'))
  })
}
export async function saveAudio(id: string, blob: Blob) {
  const db = await database()
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('audio', 'readwrite')
      transaction.objectStore('audio').put(blob, id)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  } finally {
    db.close()
  }
}
export async function getAudio(id: string): Promise<Blob> {
  const db = await database()
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('audio', 'readonly').objectStore('audio').get(id)
      request.onsuccess = () =>
        request.result
          ? resolve(request.result as Blob)
          : reject(new Error('Файл не найден в этом браузере. Загрузите его снова.'))
      request.onerror = () => reject(request.error)
    })
  } finally {
    db.close()
  }
}
export function validateFile(file: Pick<File, 'name' | 'size'>) {
  if (!/\.(mp3|wav|m4a)$/i.test(file.name)) throw new Error('Выберите MP3, WAV или M4A.')
  if (file.size > 50 * 1024 * 1024)
    throw new Error('Файл больше 50 МБ. Выберите файл меньшего размера.')
  if (!file.size) throw new Error('Файл пустой. Выберите другую композицию.')
}
export async function durationOf(file: Blob, signal: AbortSignal): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const audio = new Audio()
    const timer = window.setTimeout(
      () => finish(new Error('Не удалось прочитать аудио. Выберите другой файл.')),
      15000,
    )
    function finish(error?: Error) {
      clearTimeout(timer)
      signal.removeEventListener('abort', abort)
      const ms = Math.round(audio.duration * 1000)
      audio.removeAttribute('src')
      audio.load()
      URL.revokeObjectURL(url)
      if (error) reject(error)
      else if (!Number.isFinite(ms) || ms <= 0 || ms > 900000)
        reject(new Error('Композиция должна длиться не более 15 минут.'))
      else resolve(ms)
    }
    function abort() {
      finish(new DOMException('Загрузка отменена', 'AbortError'))
    }
    if (signal.aborted) {
      abort()
      return
    }
    signal.addEventListener('abort', abort, { once: true })
    audio.onloadedmetadata = () => finish()
    audio.onerror = () =>
      finish(new Error('Браузер не смог прочитать аудио. Попробуйте MP3 или WAV.'))
    audio.preload = 'metadata'
    audio.src = url
  })
}
