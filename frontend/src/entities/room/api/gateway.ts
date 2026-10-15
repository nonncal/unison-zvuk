import { AppError } from '@/shared/lib/errors'
import type { Gateway } from '../model/types'
import { demoGateway } from './demo-gateway'
import { request, requestModel } from '@/shared/api'
import { normalizeSnapshot } from './normalize-snapshot'
import { normalizeTrack } from '@/entities/track/@x/room'
import { appMode } from '@/shared/config'
import { connectWebSocket } from './websocket'
import { validateFile } from '@/shared/lib/media'
const remoteGateway: Gateway = {
  mode: 'api',
  async create(name, title, options) {
    const data = await requestModel('CreateRoomResult', '/rooms', {
      method: 'POST',
      headers: { 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({ displayName: name, title, ...options }),
    })
    return { ...data, role: 'host', snapshot: normalizeSnapshot(data.snapshot) }
  },
  async preview(roomId, token) {
    const data = await requestModel('PreviewResult', '/invites/preview', {
      method: 'POST',
      body: JSON.stringify({ inviteToken: token }),
    })
    if (data.roomId !== roomId) throw new Error('Ссылка ведёт в другую комнату.')
    return data
  },
  async join(roomId, token, name) {
    const entry = await requestModel('EntryResult', `/rooms/${roomId}/entry`, {
      method: 'POST',
      body: JSON.stringify({ inviteToken: token, displayName: name }),
    })
    if (entry.status !== 'admitted' || !entry.membership)
      throw new AppError(
        entry.status === 'pending' ? 'JOIN_PENDING' : 'JOIN_REJECTED',
        entry.status === 'pending' ? 'Ожидаем допуска ведущего' : 'Ведущий отклонил заявку',
      )
    const data = entry.membership
    localStorage.setItem(`unison:api:participant:${roomId}`, data.participantId)
    return { ...data, snapshot: normalizeSnapshot(data.snapshot) }
  },
  async restore(roomId) {
    const data = await requestModel('JoinRoomResult', `/rooms/${roomId}/resume`, {
      method: 'POST',
      body: '{}',
    })
    localStorage.setItem(`unison:api:participant:${roomId}`, data.participantId)
    return { ...data, snapshot: normalizeSnapshot(data.snapshot) }
  },
  async invite(roomId) {
    return (await requestModel('InviteResult', `/rooms/${roomId}/invite`)).inviteUrl
  },
  async tracks(roomId) {
    const data = await requestModel('TrackList', `/rooms/${roomId}/tracks?limit=100`)
    return data.items.map(normalizeTrack)
  },
  async audioUrl(roomId, track) {
    return (
      await requestModel('PlaybackURL', `/rooms/${roomId}/tracks/${track.id}/playback-url`, {
        method: 'POST',
        body: '{}',
      })
    ).url
  },
  async upload(roomId, file, progress, signal) {
    validateFile(file)
    const reservation = await requestModel('ReserveUploadResult', `/rooms/${roomId}/uploads`, {
      method: 'POST',
      signal,
      headers: { 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({
        fileName: file.name,
        sizeBytes: file.size,
        contentType: (
          { mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4' } as Record<string, string>
        )[file.name.split('.').at(-1)!.toLowerCase()],
      }),
    })
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest(),
          abort = () => xhr.abort()
        xhr.open('PUT', reservation.uploadUrl)
        for (const [key, value] of Object.entries(reservation.requiredHeaders ?? {}))
          xhr.setRequestHeader(key, value)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) progress(Math.round((event.loaded / event.total) * 100))
        }
        xhr.onload = () => {
          signal.removeEventListener('abort', abort)
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error('Файл не отправлен. Попробуйте снова.'))
        }
        xhr.onerror = () => {
          signal.removeEventListener('abort', abort)
          reject(new Error('Не удалось отправить файл. Проверьте соединение.'))
        }
        xhr.onabort = () => {
          signal.removeEventListener('abort', abort)
          reject(new DOMException('Загрузка отменена', 'AbortError'))
        }
        if (signal.aborted) {
          reject(new DOMException('Загрузка отменена', 'AbortError'))
          return
        }
        signal.addEventListener('abort', abort, { once: true })
        xhr.send(file)
      })
      const complete = await requestModel(
        'CompleteUploadResult',
        `/rooms/${roomId}/uploads/${reservation.uploadId}/complete`,
        { method: 'POST', body: '{}', signal },
      )
      for (let i = 0; i < 60; i++) {
        signal.throwIfAborted()
        const track = await requestModel('Track', `/rooms/${roomId}/tracks/${complete.trackId}`, {
          signal,
        })
        if (track.status === 'ready') return normalizeTrack(track)
        if (track.status === 'failed')
          throw new Error('Не удалось обработать аудио. Выберите другой файл.')
        await new Promise<void>((resolve, reject) => {
          const abort = () => {
            clearTimeout(timer)
            reject(new DOMException('Загрузка отменена', 'AbortError'))
          }
          const timer = window.setTimeout(() => {
            signal.removeEventListener('abort', abort)
            resolve()
          }, 2000)
          signal.addEventListener('abort', abort, { once: true })
        })
      }
      throw new Error('Обработка продолжается. Композиция появится в подборке после завершения.')
    } catch (error) {
      await request(`/rooms/${roomId}/uploads/${reservation.uploadId}`, { method: 'DELETE' }).catch(
        () => undefined,
      )
      throw error
    }
  },
  async leave(roomId) {
    await request(`/rooms/${roomId}/leave`, { method: 'POST', body: '{}' })
  },
  async close(roomId, revision) {
    await request(`/rooms/${roomId}/close`, {
      method: 'POST',
      body: JSON.stringify({ expectedPlaybackRevision: revision }),
    })
  },
  connect(roomId, _pid, onSnapshot, onConnection, onError, onReaction, onTracksChanged) {
    return connectWebSocket(roomId, onSnapshot, onConnection, onError, onReaction, onTracksChanged)
  },
}
const originalCreate = remoteGateway.create
remoteGateway.create = async (name, title, options) => {
  const room = await originalCreate(name, title, options)
  localStorage.setItem(`unison:api:participant:${room.roomId}`, room.participantId)
  return room
}
export const gateway = appMode === 'api' ? remoteGateway : demoGateway
