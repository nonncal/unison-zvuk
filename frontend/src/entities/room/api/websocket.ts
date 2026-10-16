import { AppError } from '@/shared/lib/errors'
import type {
  ConnectionState,
  RoomConnection,
  Snapshot,
  Reaction,
  ReactionEmoji,
} from '../model/types'
import { clockSample, estimateOffset } from '@/shared/lib/clock'
import { apiOrigin } from '@/shared/config'
import type { HTTPModels } from '@/shared/api'
import { parseEvent, parseCommand } from '@/shared/api'
import { normalizeSnapshot, normalizeParticipants } from './normalize-snapshot'
import { timelineAt } from '../lib/timeline'
export function connectWebSocket(
  roomId: string,
  onSnapshot: (snapshot: Snapshot) => void,
  onConnection: (state: ConnectionState) => void,
  onError: (error: string) => void,
  onReaction?: (reaction: Reaction) => void,
  onTracksChanged?: () => void,
): RoomConnection {
  let socket: WebSocket | null = null,
    disposed = false,
    offset = 0,
    attempt = 0,
    reconnectTimer = 0,
    lastMessage = 0,
    lastProbe = 0,
    reconnectStart = 0,
    probeTimer = 0,
    probesRemaining = 0,
    connectedAt = 0,
    lastTelemetry = -Infinity
  const epochBase = Date.now() - performance.now()
  const localNow = () => epochBase + performance.now()
  let snapshot: Snapshot | null = null
  let samples: { offset: number; rtt: number }[] = []
  const probes = new Map<string, number>()
  const receipts = new Map<
    string,
    { resolve: () => void; reject: (error: Error) => void; timer: number }
  >()
  function send(
    type: string,
    payload: unknown,
    revision: number | null = null,
    requestId = crypto.randomUUID(),
  ) {
    if (socket?.readyState !== WebSocket.OPEN)
      throw new Error('Соединение потеряно. Дождитесь восстановления.')
    socket.send(
      JSON.stringify(
        parseCommand(
          JSON.stringify({ v: 1, type, requestId, expectedPlaybackRevision: revision, payload }),
        ),
      ),
    )
    return requestId
  }
  function stopProbing() {
    clearTimeout(probeTimer)
    probes.clear()
    probesRemaining = 0
  }
  function sendProbe() {
    if (disposed || socket?.readyState !== WebSocket.OPEN || probesRemaining <= 0) return
    const probeId = crypto.randomUUID(),
      t0 = Math.round(localNow())
    probesRemaining--
    probes.set(probeId, t0)
    send('clock.probe', { probeId, clientSentAtMs: t0 })
    // A lost reply must not stop calibration or let outstanding probes accumulate.
    probeTimer = window.setTimeout(() => {
      probes.delete(probeId)
      sendProbe()
    }, 3000)
  }
  function probe() {
    if (socket?.readyState !== WebSocket.OPEN || probes.size || probesRemaining) return
    lastProbe = localNow()
    probesRemaining = 5
    sendProbe()
  }
  function requestSnapshot() {
    if (socket?.readyState === WebSocket.OPEN) send('room.snapshot.request', {})
  }
  function apply(value: HTTPModels['Snapshot']) {
    const incoming = normalizeSnapshot(value)
    if (snapshot?.playback.epoch !== incoming.playback.epoch) {
      stopProbing()
      samples = []
      offset = 0
      connectedAt = localNow()
    }
    snapshot = incoming
    onSnapshot(incoming)
    if (!samples.length) probe()
  }
  function rejectReceipts() {
    for (const item of receipts.values()) {
      clearTimeout(item.timer)
      item.reject(new Error('Соединение потеряно. Команда не будет повторена автоматически.'))
    }
    receipts.clear()
  }
  function connect() {
    if (disposed) return
    onConnection(attempt ? 'reconnecting' : 'connecting')
    const url = new URL(`/ws/v1/rooms/${encodeURIComponent(roomId)}`, apiOrigin || location.origin)
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    socket = new WebSocket(url)
    socket.onopen = () => {
      lastMessage = localNow()
      stopProbing()
      samples = []
      connectedAt = localNow()
      // The server sends hello with a snapshot. Calibrate after that initial work.
    }
    socket.onmessage = (event) => {
      if (typeof event.data !== 'string' || event.data.length > 65536) {
        onError('Некорректное сообщение сервера.')
        return
      }
      const receivedAt = localNow()
      lastMessage = receivedAt
      try {
        const message = parseEvent(event.data)
        if (message.v !== 1) {
          onError('Версия сервера не поддерживается. Обновите приложение.')
          socket?.close(1002)
          return
        }
        if (message.type === 'hello') {
          apply(message.payload.snapshot)
        } else if (message.type === 'room.snapshot') apply(message.payload)
        else if (message.type === 'playback.state' && snapshot) {
          const revision = message.playbackRevision
          if (revision < snapshot.playback.playbackRevision) return
          if (revision > snapshot.playback.playbackRevision + 1) requestSnapshot()
          else {
            snapshot = { ...snapshot, playback: { ...message.payload, playbackRevision: revision } }
            onSnapshot(snapshot)
          }
        } else if (
          message.type === 'presence.changed' &&
          snapshot &&
          message.payload.presenceSeq >= snapshot.presenceSeq
        ) {
          snapshot = {
            ...snapshot,
            participants: normalizeParticipants(message.payload.participants),
            presenceSeq: message.payload.presenceSeq,
          }
          onSnapshot(snapshot)
        } else if (message.type === 'host.changed') requestSnapshot()
        else if (message.type === 'clock.reply') {
          const p = message.payload
          const t0 = probes.get(String(p.probeId))
          if (
            t0 === undefined ||
            !Number.isFinite(p.serverReceivedAtMs) ||
            !Number.isFinite(p.serverSentAtMs)
          )
            return
          clearTimeout(probeTimer)
          probes.delete(String(p.probeId))
          probeTimer = window.setTimeout(sendProbe, 100)
          const t1 = Number(p.serverReceivedAtMs),
            t2 = Number(p.serverSentAtMs)
          // Ignore expired samples and impossible ordering after a server clock reset.
          if (receivedAt - t0 > 3000 || t2 < t1 || t2 - t1 > receivedAt - t0 + 2) return
          samples.push(clockSample(t0, t1, t2, receivedAt))
          samples = samples.slice(-15)
          offset = estimateOffset(samples)
          if (samples.length >= 3 && snapshot) {
            attempt = 0
            reconnectStart = 0
            onConnection('connected')
          }
        } else if (message.type === 'heartbeat.ping')
          send('heartbeat.pong', { pingId: message.payload.pingId })
        else if (message.type === 'room.closed') {
          if (snapshot) {
            snapshot = { ...snapshot, room: { ...snapshot.room, status: 'closed' } }
            onSnapshot(snapshot)
          }
          onConnection('closed')
        } else if (message.type === 'reaction.created') {
          onReaction?.({
            id: message.eventId,
            participantId: message.payload.participantId,
            emoji: message.payload.emoji,
            createdAt: Date.now(),
          })
        } else if (message.type === 'track.updated') onTracksChanged?.()
        else if (message.type === 'command.ack' || message.type === 'command.error') {
          const p = message.payload
          const id = String(p.requestId),
            pending = receipts.get(id)
          if ('snapshot' in p && p.snapshot) apply(p.snapshot)
          if (pending) {
            clearTimeout(pending.timer)
            receipts.delete(id)
            if (message.type === 'command.ack') {
              requestSnapshot()
              pending.resolve()
            } else
              pending.reject(
                new AppError(
                  String(message.type === 'command.error' ? message.payload.code : ''),
                  String(message.type === 'command.error' ? message.payload.message : ''),
                ),
              )
          }
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Ошибка сообщения сервера.')
      }
    }
    socket.onerror = () => onConnection('reconnecting')
    socket.onclose = (event) => {
      stopProbing()
      rejectReceipts()
      if (disposed) return
      if ([1002, 1008, 4001, 4004, 4009].includes(event.code)) {
        onConnection('closed')
        onError(
          [4001, 4009].includes(event.code)
            ? 'Комната открыта в другой вкладке.'
            : event.code === 1008
              ? 'Сессия завершена. Войдите по приглашению.'
              : 'Комната завершена.',
        )
        return
      }
      onConnection('reconnecting')
      reconnectStart ||= localNow()
      if (localNow() - reconnectStart >= 60000) {
        onConnection('failed')
        return
      }
      const delay = Math.min(8000, 500 * 2 ** attempt++) * (0.8 + Math.random() * 0.4)
      reconnectTimer = window.setTimeout(connect, delay)
    }
  }
  const periodic = window.setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      if (localNow() - lastMessage > 15000) socket.close()
      else if (localNow() - lastProbe >= (localNow() - connectedAt < 30000 ? 5000 : 30000)) probe()
    }
  }, 5000)
  const visible = () => {
    if (document.visibilityState === 'visible') {
      requestSnapshot()
      probe()
    }
  }
  window.addEventListener('online', visible)
  document.addEventListener('visibilitychange', visible)
  connect()
  return {
    telemetry(value) {
      const p = snapshot?.playback
      if (
        socket?.readyState !== WebSocket.OPEN ||
        samples.length < 3 ||
        !p ||
        p.trackId !== value.trackId ||
        p.mediaVersion !== value.mediaVersion ||
        localNow() - lastTelemetry < 6000 ||
        !Number.isFinite(value.positionMs)
      )
        return
      const fastest = [...samples].sort((a, b) => a.rtt - b.rtt).slice(0, 3)
      const rtts = fastest.map((sample) => sample.rtt).sort((a, b) => a - b)
      send('sync.telemetry', {
        trackId: value.trackId,
        mediaVersion: value.mediaVersion,
        localState: value.localState,
        driftMs: Math.round(
          Math.max(
            -900000,
            Math.min(900000, timelineAt(p, localNow() + offset).positionMs - value.positionMs),
          ),
        ),
        rttMs: Math.round(Math.min(60000, rtts[Math.floor(rtts.length / 2)])),
      })
      lastTelemetry = localNow()
    },
    react(emoji: ReactionEmoji) {
      send('reaction.send', { emoji })
    },
    send(command, revision) {
      return new Promise((resolve, reject) => {
        const id = crypto.randomUUID()
        const timer = window.setTimeout(() => {
          receipts.delete(id)
          reject(new Error('Нет подтверждения команды. Обновите состояние и попробуйте снова.'))
          requestSnapshot()
        }, 15000)
        receipts.set(id, { resolve, reject, timer })
        try {
          send(command.type, command.payload, revision, id)
        } catch (error) {
          clearTimeout(timer)
          receipts.delete(id)
          reject(error)
        }
      })
    },
    readiness(value) {
      if (socket?.readyState === WebSocket.OPEN)
        send('participant.readiness', {
          ...value,
          bufferedAheadMs: Math.round(Math.max(0, Math.min(900000, value.bufferedAheadMs))),
        })
    },
    snapshot: requestSnapshot,
    now: () => localNow() + offset,
    dispose() {
      disposed = true
      stopProbing()
      clearTimeout(reconnectTimer)
      clearInterval(periodic)
      rejectReceipts()
      socket?.close()
      window.removeEventListener('online', visible)
      document.removeEventListener('visibilitychange', visible)
    },
  }
}
