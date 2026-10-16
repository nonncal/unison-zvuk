import type { Playback, SyncMeasurement } from '@/entities/room'
import type { Track } from '@/entities/track'
import type { AudioObserver } from './native-audio-engine'

interface Segment {
  key: string
  status: Playback['status']
  positionMs: number
  at: number
}
interface Voice {
  key: string
  source: AudioBufferSourceNode
  gain: GainNode
  at: number
  offset: number
  stopAt: number
}

/** Decode before readiness; the audio clock schedules every audible transition. */
export class DecodedAudioEngine {
  private context: AudioContext | null = null
  private output: GainNode | null = null
  private buffer: AudioBuffer | null = null
  private voices: Voice[] = []
  private endedKeys = new Set<string>()
  private heldPosition = 0
  private observer: AudioObserver | null = null
  private playback: Playback | null = null
  private activeVersion: string | null = null
  private generation = 0
  private request: AbortController | null = null
  private prefetchRequest: AbortController | null = null
  private prefetched: { key: string; bytes: ArrayBuffer } | null = null
  private prefetchKey = ''
  private allowed = false
  private suspended = false
  private volume = 0.65
  private muted = false
  private timer = 0
  private lastReadiness = ''
  private now = () => Date.now()

  private audioContext() {
    if (!this.context) {
      this.context = new AudioContext({ latencyHint: 'interactive' })
      this.output = this.context.createGain()
      this.output.gain.value = this.muted ? 0 : this.volume
      this.output.connect(this.context.destination)
      this.context.addEventListener('statechange', () => {
        if (!this.observer || !this.allowed || this.suspended) return
        if (this.context?.state === 'running') this.sync()
        else {
          this.observer.state('buffering')
          this.readiness('buffering')
        }
      })
    }
    return this.context
  }

  async unlock() {
    const context = this.audioContext()
    // resume must run in the original click handler, before any network await.
    try {
      await context.resume()
      if (context.state !== 'running') throw new Error('Audio context is suspended')
      this.allowed = true
      this.observer?.state('ready')
      this.sync()
    } catch {
      this.allowed = false
      this.observer?.state('locked')
      this.readiness('autoplayBlocked')
      throw new Error('Браузер не разрешил звук. Нажмите «Включить звук» ещё раз.')
    }
  }

  listen(observer: AudioObserver, now: () => number) {
    this.observer = observer
    this.now = now
    this.suspended = false
    this.lastReadiness = ''
    observer.state(this.allowed ? 'ready' : 'locked')
    clearInterval(this.timer)
    this.timer = window.setInterval(() => this.sync(), 250)
    return () => {
      clearInterval(this.timer)
      this.generation++
      this.request?.abort()
      this.prefetchRequest?.abort()
      this.stop()
      this.buffer = null
      this.endedKeys.clear()
      this.prefetched = null
      this.prefetchKey = ''
      this.activeVersion = null
      this.playback = null
      this.observer = null
    }
  }

  setVolume(volume: number, muted: boolean) {
    this.volume = volume
    this.muted = muted
    if (this.context && this.output)
      this.output.gain.setTargetAtTime(muted ? 0 : volume, this.context.currentTime, 0.005)
  }

  private async download(resolve: () => Promise<string>, signal: AbortSignal) {
    for (let attempt = 0; ; attempt++) {
      const url = await resolve()
      try {
        const response = await fetch(url, { signal })
        if (!response.ok) throw new Error(`Audio download failed: ${response.status}`)
        return await response.arrayBuffer()
      } catch (error) {
        if (signal.aborted || attempt >= 1) throw error
      } finally {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      }
    }
  }

  async preload(track: Track, resolve: () => Promise<string>) {
    const key = `${track.id}:${track.mediaVersion}`
    if (!this.buffer || this.prefetchKey === key || this.activeVersion === key) return
    this.prefetchRequest?.abort()
    const request = new AbortController()
    this.prefetchRequest = request
    this.prefetchKey = key
    this.prefetched = null
    try {
      // Keep only one compressed next track; do not double decoded PCM memory.
      const bytes = await this.download(resolve, request.signal)
      if (!request.signal.aborted && this.prefetchKey === key) this.prefetched = { key, bytes }
    } catch {
      if (this.prefetchKey === key) this.prefetchKey = ''
    }
  }

  async update(playback: Playback, track: Track | undefined, resolve: () => Promise<string>) {
    this.playback = playback
    if (!track) {
      this.retrySource()
      this.observer?.position(0)
      return
    }
    const version = `${track.id}:${track.mediaVersion}`
    if (version !== this.activeVersion) {
      this.request?.abort()
      this.stop()
      this.buffer = null
      this.endedKeys.clear()
      this.heldPosition = 0
      this.activeVersion = version
      const generation = ++this.generation
      const request = new AbortController()
      this.request = request
      this.observer?.state('loading')
      this.readiness('loading')
      try {
        const context = this.audioContext()
        const bytes =
          this.prefetched?.key === version
            ? this.prefetched.bytes
            : await this.download(resolve, request.signal)
        if (this.prefetched?.key === version) this.prefetched = null
        if (request.signal.aborted || generation !== this.generation) return
        const buffer = await context.decodeAudioData(bytes)
        if (request.signal.aborted || generation !== this.generation) return
        this.buffer = buffer
        this.readiness(this.allowed ? 'ready' : 'autoplayBlocked')
      } catch {
        if (request.signal.aborted || generation !== this.generation) return
        this.activeVersion = null
        this.observer?.state('error')
        this.readiness('error')
        return
      }
    }
    this.sync()
  }

  retrySource() {
    this.generation++
    this.request?.abort()
    this.prefetchRequest?.abort()
    this.stop()
    this.buffer = null
    this.prefetched = null
    this.prefetchKey = ''
    this.activeVersion = null
    this.lastReadiness = ''
  }

  pauseForConnection() {
    this.heldPosition = this.positionMs()
    this.suspended = true
    this.stop()
    this.observer?.state('paused')
  }

  resumeForConnection() {
    this.suspended = false
    this.lastReadiness = ''
    this.sync()
  }

  measurement(): SyncMeasurement | null {
    if (
      !this.playback?.trackId ||
      !this.playback.mediaVersion ||
      !this.activeVersion ||
      this.suspended
    )
      return null
    return {
      trackId: this.playback.trackId,
      mediaVersion: this.playback.mediaVersion,
      positionMs: this.positionMs(),
      localState: !this.allowed
        ? 'autoplayBlocked'
        : !this.buffer || this.context?.state !== 'running'
          ? 'buffering'
          : this.currentVoice()
            ? 'playing'
            : 'paused',
    }
  }

  private currentVoice() {
    const now = this.context?.currentTime ?? 0
    return this.voices.findLast((voice) => voice.at <= now && voice.stopAt > now)
  }

  private positionMs() {
    const voice = this.currentVoice()
    return voice && this.context && this.buffer
      ? Math.min(this.buffer.duration, voice.offset + this.context.currentTime - voice.at) * 1000
      : this.heldPosition
  }

  private stop(positionMs = this.heldPosition) {
    for (const voice of this.voices) {
      voice.source.onended = null
      voice.source.stop()
      voice.source.disconnect()
      voice.gain.disconnect()
    }
    this.voices = []
    this.heldPosition = positionMs
  }

  private readiness(state: Parameters<AudioObserver['ready']>[0]) {
    const ahead = this.buffer ? Math.max(0, this.buffer.duration * 1000 - this.positionMs()) : 0
    const key = `${this.activeVersion}:${state}:${Math.min(3000, Math.floor(ahead / 500) * 500)}`
    if (key === this.lastReadiness) return
    this.lastReadiness = key
    this.observer?.ready(state, ahead)
  }

  private segment(status: Playback['status'], positionMs: number, at: number): Segment {
    return {
      key: `${this.playback!.epoch}:${this.activeVersion}:${status}:${positionMs}:${at}`,
      status,
      positionMs,
      at,
    }
  }

  private apply(segment: Segment, serverNow: number) {
    const context = this.context!
    const when = context.currentTime + Math.max(0, segment.at - serverNow) / 1000
    if (segment.status !== 'playing') {
      if (when <= context.currentTime) this.stop(segment.positionMs)
      else {
        for (const voice of this.voices) {
          if (voice.stopAt <= when) continue
          voice.stopAt = when
          voice.gain.gain.setValueAtTime(1, Math.max(context.currentTime, when - 0.005))
          voice.gain.gain.linearRampToValueAtTime(0, when)
          voice.source.stop(when)
        }
      }
      return
    }
    if (this.endedKeys.has(segment.key)) return
    const existing = this.voices.find((voice) => voice.key === segment.key)
    if (existing) {
      const expected = segment.positionMs + Math.max(0, serverNow - segment.at)
      const actual = (existing.offset + Math.max(0, context.currentTime - existing.at)) * 1000
      if (existing.at > context.currentTime || Math.abs(expected - actual) <= 400) return
    }
    const offset = Math.min(
      this.buffer!.duration,
      (segment.positionMs + Math.max(0, serverNow - segment.at)) / 1000,
    )
    if (offset >= this.buffer!.duration) return
    // Each transition has a stable key. Presence snapshots cannot restart it.
    const source = context.createBufferSource()
    const gain = context.createGain()
    source.buffer = this.buffer
    source.connect(gain)
    gain.connect(this.output!)
    gain.gain.setValueAtTime(0, when)
    gain.gain.linearRampToValueAtTime(1, when + 0.005)
    const voice: Voice = {
      key: segment.key,
      source,
      gain,
      at: when,
      offset,
      stopAt: when + this.buffer!.duration - offset,
    }
    for (const old of this.voices) {
      if (old.stopAt <= when) continue
      old.stopAt = when + 0.005
      old.gain.gain.setValueAtTime(1, when)
      old.gain.gain.linearRampToValueAtTime(0, when + 0.005)
      old.source.stop(when + 0.005)
    }
    this.voices.push(voice)
    source.onended = () => {
      if (this.buffer && voice.offset + voice.stopAt - voice.at >= this.buffer.duration - 0.001)
        this.endedKeys.add(voice.key)
      if (this.currentVoice() === voice || this.voices.at(-1) === voice)
        this.heldPosition =
          Math.min(this.buffer?.duration ?? 0, voice.offset + voice.stopAt - voice.at) * 1000
      this.voices = this.voices.filter((item) => item !== voice)
      source.disconnect()
      gain.disconnect()
      this.sync()
    }
    source.start(when, offset)
  }

  private sync() {
    if (this.suspended || !this.playback?.trackId || !this.buffer || !this.context) return
    if (!this.allowed || this.context.state !== 'running') {
      this.observer?.state(this.allowed ? 'buffering' : 'locked')
      this.readiness(this.allowed ? 'buffering' : 'autoplayBlocked')
      return
    }
    const now = this.now()
    const p = this.playback
    const pending = p.pendingTransition
    const committed = this.segment(p.status, p.positionMs, p.anchorServerTimeMs)
    const next = pending
      ? this.segment(pending.nextStatus, pending.positionMs, pending.effectiveAtServerTimeMs)
      : null
    if (next && next.at <= now) this.apply(next, now)
    else {
      // A paused committed state must not cancel an already scheduled play.
      if (next && committed.status !== 'playing') {
        if (this.currentVoice()) this.stop(committed.positionMs)
        this.heldPosition = committed.positionMs
      } else this.apply(committed, now)
      if (next) this.apply(next, now)
    }
    this.observer?.state(this.currentVoice() ? 'playing' : 'paused')
    this.observer?.position(this.positionMs())
    this.readiness('ready')
  }
}
