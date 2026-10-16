import type { Track } from '@/entities/track/@x/room'
import { AppError } from '@/shared/lib/errors'
import type {
  Gateway,
  Membership,
  PlaybackCommand,
  Readiness,
  RoomConnection,
  Snapshot,
} from '../model/types'
import { timelineAt } from '../lib/timeline'
import { catalog } from '@/entities/track/@x/room'
import { durationOf, getAudio, saveAudio, validateFile } from '@/shared/lib/media'
interface DemoRoom {
  snapshot: Snapshot
  token: string
  tracks: Track[]
  sessions: Record<string, number>
}
const prefix = 'unison:demo:room:'
function participantId() {
  let id = sessionStorage.getItem('unison:participant')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('unison:participant', id)
  }
  return id
}
function read(id: string): DemoRoom {
  const value = localStorage.getItem(prefix + id)
  if (!value)
    throw new AppError(
      'INVITE_INVALID',
      'Комната не найдена. В деморежиме ссылка работает только в этом браузере.',
    )
  const data = JSON.parse(value) as DemoRoom
  let refreshed = false
  data.tracks = data.tracks.map((track) => {
    const replacement = catalog.find((entry) => entry.id === track.id)
    if (
      track.source !== 'catalog' ||
      !replacement ||
      track.mediaVersion === replacement.mediaVersion
    )
      return track
    refreshed = true
    return { ...replacement }
  })
  if (refreshed) {
    const playback = data.snapshot.playback
    const selected = data.tracks.find((track) => track.id === playback.trackId)
    if (selected && selected.mediaVersion !== playback.mediaVersion) {
      Object.assign(playback, {
        mediaVersion: selected.mediaVersion,
        durationMs: selected.durationMs,
        status: 'paused',
        positionMs: 0,
        pendingTransition: null,
        anchorServerTimeMs: Date.now(),
        playbackRevision: playback.playbackRevision + 1,
      })
    }
    localStorage.setItem(prefix + id, JSON.stringify(data))
  }
  if (data.snapshot.room.expiresAt <= Date.now()) data.snapshot.room.status = 'expired'
  const p = data.snapshot.playback
  if (p.pendingTransition && Date.now() >= p.pendingTransition.effectiveAtServerTimeMs) {
    p.status = p.pendingTransition.nextStatus
    p.positionMs = p.pendingTransition.positionMs
    p.anchorServerTimeMs = p.pendingTransition.effectiveAtServerTimeMs
    p.pendingTransition = null
  }
  if (p.status === 'playing' && timelineAt(p, Date.now()).status === 'ended') {
    p.status = 'ended'
    p.positionMs = p.durationMs
    p.pendingTransition = null
    p.playbackRevision++
  }
  return data
}
function write(data: DemoRoom) {
  localStorage.setItem(prefix + data.snapshot.room.id, JSON.stringify(data))
  const channel = new BroadcastChannel('unison-demo')
  channel.postMessage(data.snapshot.room.id)
  channel.close()
}
async function mutate<T>(id: string, operation: (data: DemoRoom) => T): Promise<T> {
  if (!navigator.locks)
    throw new Error(
      'Этот браузер не поддерживает локальные демокомнаты. Откройте приложение в Chrome или подключите API.',
    )
  return navigator.locks.request(prefix + id, () => {
    const data = read(id)
    const result = operation(data)
    write(data)
    return result
  })
}
function active(data: DemoRoom) {
  if (data.snapshot.room.status !== 'active')
    throw new AppError('ROOM_CLOSED', 'Эта комната завершена. Создайте новую.')
}
function member(data: DemoRoom) {
  const participant = data.snapshot.participants.find((p) => p.id === participantId())
  if (!participant) throw new AppError('FORBIDDEN', 'Войдите в комнату по приглашению.')
  return participant
}
function host(data: DemoRoom) {
  active(data)
  if (member(data).id !== data.snapshot.room.hostParticipantId)
    throw new AppError('FORBIDDEN', 'Воспроизведением управляет ведущий.')
}
function cleanPresence(data: DemoRoom) {
  const now = Date.now()
  for (const p of data.snapshot.participants)
    p.connectionState = now - (data.sessions[p.id] ?? 0) < 15000 ? 'online' : 'offline'
  const oldHost = data.snapshot.room.hostParticipantId
  if (now - (data.sessions[oldHost ?? ''] ?? 0) > 45000) {
    const next = data.snapshot.participants.find((p) => p.connectionState === 'online')
    if (next) {
      data.snapshot.room.hostParticipantId = next.id
      for (const p of data.snapshot.participants) p.role = p.id === next.id ? 'host' : 'listener'
    }
  }
}
function applyCommand(data: DemoRoom, command: PlaybackCommand, revision: number) {
  host(data)
  const p = data.snapshot.playback
  if (p.playbackRevision !== revision)
    throw new AppError('CONFLICT', 'Комната обновилась. Попробуйте действие ещё раз.')
  if (p.pendingTransition)
    throw new AppError('PENDING_TRANSITION', 'Применяем предыдущее действие. Подождите немного.')
  if (command.type === 'playback.select') {
    const track = data.tracks.find((t) => t.id === command.payload.trackId && t.status === 'ready')
    if (!track) throw new AppError('TRACK_NOT_READY', 'Композиция ещё не готова.')
    Object.assign(p, {
      trackId: track.id,
      mediaVersion: track.mediaVersion,
      durationMs: track.durationMs,
      positionMs: 0,
      status: 'paused',
      anchorServerTimeMs: Date.now(),
      playbackRevision: p.playbackRevision + 1,
    })
    for (const participant of data.snapshot.participants) participant.readiness = 'loading'
    return
  }
  if (!p.trackId) throw new AppError('TRACK_NOT_READY', 'Сначала выберите композицию.')
  if (
    command.type === 'playback.play' &&
    !command.payload.allowNotReady &&
    data.snapshot.participants.some(
      (participant) =>
        participant.connectionState === 'online' && participant.readiness !== 'ready',
    )
  )
    throw new AppError(
      'NOT_ALL_READY',
      'Не все участники готовы. Можно подождать или начать без ожидания.',
    )
  const effectiveAt = Date.now() + 500
  const current = timelineAt(p, effectiveAt)
  const position =
    command.type === 'playback.seek'
      ? command.payload.positionMs
      : command.type === 'playback.play' && current.status === 'ended'
        ? 0
        : current.positionMs
  if (!Number.isFinite(position) || position < 0 || position > p.durationMs)
    throw new AppError('INVALID_POSITION', 'Позиция за пределами композиции.')
  const nextStatus =
    position >= p.durationMs
      ? 'ended'
      : command.type === 'playback.play'
        ? 'playing'
        : command.type === 'playback.pause'
          ? 'paused'
          : current.status === 'playing'
            ? 'playing'
            : 'paused'
  p.pendingTransition = {
    type:
      command.type === 'playback.play'
        ? 'play'
        : command.type === 'playback.pause'
          ? 'pause'
          : 'seek',
    nextStatus,
    positionMs: position,
    effectiveAtServerTimeMs: effectiveAt,
  }
  p.playbackRevision++
}
export const demoGateway: Gateway = {
  mode: 'demo',
  async create(name, title) {
    const id = crypto.randomUUID(),
      pid = participantId(),
      token = crypto.randomUUID() + crypto.randomUUID()
    const snapshot: Snapshot = {
      room: {
        id,
        title: title.trim() || 'Вечер на двоих',
        status: 'active',
        capacity: 2,
        expiresAt: Date.now() + 86400000,
        hostParticipantId: pid,
      },
      participants: [
        {
          id: pid,
          displayName: name.trim(),
          role: 'host',
          connectionState: 'online',
          readiness: 'autoplayBlocked',
        },
      ],
      playback: {
        roomId: id,
        epoch: crypto.randomUUID(),
        playbackRevision: 0,
        trackId: null,
        mediaVersion: null,
        status: 'empty',
        positionMs: 0,
        anchorServerTimeMs: Date.now(),
        durationMs: 0,
        pendingTransition: null,
      },
      presenceSeq: 1,
    }
    write({ snapshot, token, tracks: catalog, sessions: { [pid]: Date.now() } })
    return {
      roomId: id,
      participantId: pid,
      role: 'host',
      snapshot,
      inviteUrl: `${location.origin}/join/${id}#invite=${token}`,
      expiresAt: snapshot.room.expiresAt,
    }
  },
  async preview(roomId, token) {
    const data = read(roomId)
    if (data.token !== token)
      throw new AppError(
        'INVITE_INVALID',
        'Ссылка недействительна. Попросите друга прислать новую.',
      )
    active(data)
    cleanPresence(data)
    return {
      roomId,
      title: data.snapshot.room.title,
      status: data.snapshot.room.status,
      participantCount: data.snapshot.participants.filter(
        (p) => Date.now() - (data.sessions[p.id] ?? 0) < 45000,
      ).length,
      capacity: 2,
      expiresAt: data.snapshot.room.expiresAt,
    }
  },
  async join(roomId, token, name) {
    return mutate(roomId, (data) => {
      active(data)
      if (data.token !== token) throw new AppError('INVITE_INVALID', 'Ссылка недействительна.')
      const id = participantId()
      let existing = data.snapshot.participants.find((p) => p.id === id)
      if (!existing) {
        data.snapshot.participants = data.snapshot.participants.filter(
          (p) => Date.now() - (data.sessions[p.id] ?? 0) < 45000,
        )
        if (data.snapshot.participants.length >= 2)
          throw new AppError('ROOM_FULL', 'Комната уже заполнена. Здесь могут слушать двое.')
        existing = {
          id,
          displayName: name.trim(),
          role: 'listener',
          connectionState: 'online',
          readiness: 'autoplayBlocked',
        }
        data.snapshot.participants.push(existing)
      }
      data.sessions[id] = Date.now()
      cleanPresence(data)
      data.snapshot.presenceSeq++
      return { participantId: id, role: existing.role, snapshot: data.snapshot }
    })
  },
  async restore(roomId): Promise<Membership> {
    const data = read(roomId)
    const me = member(data)
    return { participantId: me.id, role: me.role, snapshot: data.snapshot }
  },
  async invite(roomId) {
    const data = read(roomId)
    host(data)
    return `${location.origin}/join/${roomId}#invite=${data.token}`
  },
  async tracks(roomId) {
    const data = read(roomId)
    member(data)
    return data.tracks
  },
  async audioUrl(roomId, track) {
    const data = read(roomId)
    member(data)
    if (!data.tracks.some((t) => t.id === track.id)) throw new Error('Композиция недоступна.')
    return track.source === 'upload'
      ? URL.createObjectURL(await getAudio(track.id))
      : `/audio/${track.id}.mp3`
  },
  async upload(roomId, file, progress, signal) {
    validateFile(file)
    const data = read(roomId)
    host(data)
    if (data.tracks.filter((t) => t.source === 'upload').length >= 10)
      throw new Error('В комнате уже десять загруженных файлов.')
    progress(10)
    const durationMs = await durationOf(file, signal)
    signal.throwIfAborted()
    progress(60)
    const track: Track = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^.]+$/, ''),
      artist: 'Ваш аудиофайл',
      durationMs,
      status: 'ready',
      mediaVersion: crypto.randomUUID(),
      cover: 'plum',
      source: 'upload',
    }
    await saveAudio(track.id, file)
    signal.throwIfAborted()
    await mutate(roomId, (current) => {
      host(current)
      current.tracks.push(track)
    })
    progress(100)
    return track
  },
  async leave(roomId) {
    await mutate(roomId, (data) => {
      const id = participantId()
      data.snapshot.participants = data.snapshot.participants.filter((p) => p.id !== id)
      delete data.sessions[id]
      if (data.snapshot.room.hostParticipantId === id && data.snapshot.participants[0]) {
        data.snapshot.room.hostParticipantId = data.snapshot.participants[0].id
        data.snapshot.participants[0].role = 'host'
      }
      data.snapshot.presenceSeq++
    })
  },
  async close(roomId, revision) {
    await mutate(roomId, (data) => {
      host(data)
      if (revision !== data.snapshot.playback.playbackRevision)
        throw new Error('Комната обновилась. Повторите закрытие.')
      data.snapshot.room.status = 'closed'
      data.snapshot.playback.status = 'paused'
      data.snapshot.playback.pendingTransition = null
      data.snapshot.playback.playbackRevision++
    })
  },
  connect(roomId, pid, onSnapshot, onConnection, onError): RoomConnection {
    let disposed = false
    const channel = new BroadcastChannel('unison-demo')
    const refresh = () => {
      if (disposed) return
      try {
        const data = read(roomId)
        member(data)
        onSnapshot(data.snapshot)
        onConnection(data.snapshot.room.status === 'active' ? 'connected' : 'closed')
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Комната недоступна')
        onConnection('failed')
      }
    }
    const storage = (event: StorageEvent) => {
      if (event.key === prefix + roomId) refresh()
    }
    channel.onmessage = (event) => {
      if (event.data === roomId) refresh()
    }
    window.addEventListener('storage', storage)
    const heartbeat = async () => {
      if (disposed) return
      try {
        await mutate(roomId, (data) => {
          if (data.snapshot.room.status !== 'active') return
          member(data)
          data.sessions[pid] = Date.now()
          cleanPresence(data)
        })
        refresh()
      } catch {
        onConnection('failed')
      }
    }
    const timer = window.setInterval(() => {
      void heartbeat()
    }, 5000)
    void heartbeat()
    return {
      async send(command, revision) {
        try {
          await mutate(roomId, (data) => applyCommand(data, command, revision))
        } finally {
          refresh()
        }
        window.setTimeout(refresh, 510)
      },
      readiness(value: Readiness) {
        void mutate(roomId, (data) => {
          const me = member(data)
          if (
            data.snapshot.playback.trackId === value.trackId &&
            data.snapshot.playback.mediaVersion === value.mediaVersion
          )
            me.readiness = value.state
        })
          .then(refresh)
          .catch(() => undefined)
      },
      snapshot: refresh,
      now: () => Date.now(),
      dispose() {
        disposed = true
        clearInterval(timer)
        channel.close()
        window.removeEventListener('storage', storage)
      },
    }
  },
}
