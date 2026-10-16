import type { AudioState, Playback, SyncMeasurement } from '@/entities/room'
import type { Track } from '@/entities/track'
import { timelineAt } from '@/entities/room'
import { correction } from './correction'
export interface AudioObserver {
  state: (state: AudioState) => void
  position: (ms: number) => void
  ready: (
    state: 'ready' | 'loading' | 'buffering' | 'autoplayBlocked' | 'error',
    bufferedMs: number,
  ) => void
}
export class NativeAudioEngine {
  private audio = new Audio('/audio/unlock.wav')
  private allowed = false
  private playback: Playback | null = null
  private observer: AudioObserver | null = null
  private generation = 0
  private activeVersion: string | null = null
  private activeUrl: string | null = null
  private now = () => Date.now()
  private timer = 0
  private schedule = 0
  private correctionStart = 0
  private starting = false
  private prefetched: { key: string; url: string; expires: number } | null = null
  private prefetchAudio: HTMLAudioElement | null = null
  private prefetchKey = ''
  private sourcePending = false
  private buffering = false
  private retryTimer = 0
  private retryCount = 0
  private lastTrack: Track | undefined
  private resolveSource: (() => Promise<string>) | null = null
  private volume = 0.65
  private suspended = false
  private lastReadinessAt = 0
  private readinessTimer = 0
  private alignOnReady = false
  private seekLatencyMs = 0
  private alignment: { at: number; positionMs: number } | null = null
  private lastReadiness = ''
  constructor() {
    this.audio.preload = 'auto'
    this.audio.preservesPitch = true
    this.audio.addEventListener('loadedmetadata', () => this.sync())
    this.audio.addEventListener('canplay', () => {
      this.buffering = false
      if (this.activeVersion) {
        this.readiness(this.allowed ? 'ready' : 'autoplayBlocked')
        // A seek can itself emit canplay. Only align for a source change or
        // a real underrun, otherwise seek latency starts another seek.
        if (this.alignOnReady) this.sync()
      }
    })
    const reportBuffer = () => {
      if (
        this.activeVersion &&
        this.audio.readyState >= 3 &&
        !this.buffering &&
        !this.audio.seeking
      ) {
        this.readiness(this.allowed ? 'ready' : 'autoplayBlocked')
      }
    }
    this.audio.addEventListener('progress', reportBuffer)
    this.audio.addEventListener('canplaythrough', reportBuffer)
    this.audio.addEventListener('waiting', () => {
      // waiting during our own seek is not a new buffer underrun.
      if (!this.activeVersion || this.audio.seeking) return
      this.buffering = true
      this.alignOnReady = true
      this.alignment = null
      this.correctionStart = 0
      if (this.audio.playbackRate !== 1) this.audio.playbackRate = 1
      this.observer?.state('buffering')
      this.readiness('buffering')
    })
    this.audio.addEventListener('playing', () => {
      this.observer?.state('playing')
      this.readiness('ready')
    })
    this.audio.addEventListener('error', () => {
      if (this.activeVersion) {
        this.observer?.state('error')
        this.readiness('error')
        if (this.retryCount < 2 && this.playback && this.lastTrack && this.resolveSource) {
          const version = this.activeVersion,
            track = this.lastTrack,
            resolve = this.resolveSource
          clearTimeout(this.retryTimer)
          clearTimeout(this.readinessTimer)
          this.retryTimer = window.setTimeout(() => {
            if (this.activeVersion !== version || !this.playback || !this.observer) return
            this.activeVersion = null
            this.prefetched = null
            void this.update(this.playback, track, resolve)
          }, 1000 * ++this.retryCount)
        }
      }
    })
    this.audio.addEventListener('timeupdate', () =>
      this.observer?.position(this.audio.currentTime * 1000),
    )
    this.audio.addEventListener('ended', () => {
      this.observer?.state('paused')
      this.audio.playbackRate = 1
    })
  }
  async unlock() {
    if (this.allowed) return
    const previousVolume = this.audio.volume
    this.audio.volume = 0
    try {
      await this.audio.play()
      this.allowed = true
      this.audio.pause()
      this.observer?.state('ready')
      this.readiness('ready')
      this.sync(true)
    } catch {
      this.observer?.state('locked')
      this.readiness('autoplayBlocked')
      throw new Error('Браузер не разрешил звук. Нажмите «Включить звук» ещё раз.')
    } finally {
      this.audio.volume = previousVolume
    }
  }
  listen(observer: AudioObserver, now: () => number) {
    this.observer = observer
    this.lastReadiness = ''
    this.suspended = false
    this.now = now
    this.observer.state(this.allowed ? 'ready' : 'locked')
    clearInterval(this.timer)
    // Scheduled commands use their own deadline; sample decoder drift once
    // per second so transient media-clock readings do not trigger seeks.
    this.timer = window.setInterval(() => this.sync(), 1000)
    return () => {
      clearInterval(this.timer)
      clearTimeout(this.retryTimer)
      clearTimeout(this.schedule)
      clearTimeout(this.readinessTimer)
      this.prefetchKey = ''
      this.prefetched = null
      this.prefetchAudio?.removeAttribute('src')
      this.prefetchAudio?.load()
      this.prefetchAudio = null
      this.observer = null
      this.audio.pause()
      this.generation++
      this.activeVersion = null
      this.playback = null
      this.buffering = false
      this.alignOnReady = false
      this.alignment = null
      this.seekLatencyMs = 0
      this.releaseUrl()
    }
  }
  measurement(): SyncMeasurement | null {
    const track = this.lastTrack
    if (
      !track ||
      this.sourcePending ||
      this.suspended ||
      this.activeVersion !== `${track.id}:${track.mediaVersion}`
    )
      return null
    return {
      trackId: track.id,
      mediaVersion: track.mediaVersion,
      positionMs: this.audio.currentTime * 1000,
      localState: this.audio.error
        ? 'error'
        : !this.allowed
          ? 'autoplayBlocked'
          : this.buffering || this.audio.readyState < 3
            ? 'buffering'
            : this.audio.paused
              ? 'paused'
              : 'playing',
    }
  }
  setVolume(volume: number, muted: boolean) {
    this.volume = volume
    this.audio.volume = volume
    this.audio.muted = muted
  }
  private releaseUrl() {
    if (this.activeUrl?.startsWith('blob:')) URL.revokeObjectURL(this.activeUrl)
    this.activeUrl = null
  }
  async preload(track: Track, resolve: () => Promise<string>) {
    const key = `${track.id}:${track.mediaVersion}`
    if (
      (this.prefetchKey === key && (this.prefetched?.expires ?? 0) > Date.now()) ||
      this.sourcePending ||
      this.buffering ||
      this.audio.readyState < 3
    )
      return
    this.prefetchKey = key
    try {
      const url = await resolve()
      if (this.prefetchKey !== key || !this.observer) return
      this.prefetched = { key, url, expires: Date.now() + 120000 }
      this.prefetchAudio?.removeAttribute('src')
      this.prefetchAudio?.load()
      this.prefetchAudio = new Audio(url)
      this.prefetchAudio.preload = 'auto'
      this.prefetchAudio.load()
    } catch {
      if (this.prefetchKey === key) this.prefetchKey = ''
    }
  }
  async update(playback: Playback, track: Track | undefined, url: () => Promise<string>) {
    const epochChanged = this.playback?.epoch !== playback.epoch
    this.playback = playback
    if (this.lastTrack?.id !== track?.id || this.lastTrack?.mediaVersion !== track?.mediaVersion) {
      this.retryCount = 0
      clearTimeout(this.retryTimer)
    }
    this.lastTrack = track
    this.resolveSource = url
    clearTimeout(this.schedule)
    if (!track) {
      this.audio.pause()
      this.generation++
      this.activeVersion = null
      this.buffering = false
      this.alignOnReady = false
      this.alignment = null
      this.seekLatencyMs = 0
      this.observer?.state(this.allowed ? 'ready' : 'locked')
      this.observer?.position(0)
      return
    }
    const version = `${track.id}:${track.mediaVersion}`
    if (this.activeVersion !== version) {
      const generation = ++this.generation
      this.sourcePending = true
      this.buffering = false
      this.activeVersion = version
      this.alignOnReady = true
      this.alignment = null
      this.seekLatencyMs = 0
      this.correctionStart = 0
      this.audio.pause()
      this.audio.playbackRate = 1
      this.observer?.state('loading')
      this.readiness('loading')
      try {
        const source =
          this.prefetched?.key === version && this.prefetched.expires > Date.now()
            ? this.prefetched.url
            : await url()
        if (generation !== this.generation) {
          if (source.startsWith('blob:')) URL.revokeObjectURL(source)
          return
        }
        this.releaseUrl()
        this.activeUrl = source
        this.audio.src = source
        this.audio.volume = this.volume
        this.audio.load()
        this.sourcePending = false
      } catch {
        if (generation === this.generation) {
          this.sourcePending = false
          this.observer?.state('error')
          this.readiness('error')
          this.activeVersion = null
        }
      }
    }
    this.sync(epochChanged)
    if (playback.pendingTransition) {
      const wait = playback.pendingTransition.effectiveAtServerTimeMs - this.now()
      if (wait > 0) this.schedule = window.setTimeout(() => this.sync(true), wait)
    }
  }
  resumeForConnection() {
    this.suspended = false
    this.lastReadiness = ''
    if (this.activeVersion) {
      this.readiness(
        !this.allowed ? 'autoplayBlocked' : this.audio.readyState >= 3 ? 'ready' : 'loading',
      )
    }
    this.sync(true)
  }
  retrySource() {
    this.prefetched = null
    this.activeVersion = null
    this.lastReadiness = ''
    this.audio.pause()
  }
  pauseForConnection() {
    this.suspended = true
    this.audio.pause()
    this.audio.playbackRate = 1
    this.alignment = null
    this.observer?.state('paused')
  }
  private readiness(state: Parameters<AudioObserver['ready']>[0]) {
    if (!this.observer) return
    let ahead = 0
    for (let i = 0; i < this.audio.buffered.length; i++)
      if (
        this.audio.buffered.start(i) <= this.audio.currentTime &&
        this.audio.buffered.end(i) >= this.audio.currentTime
      )
        ahead = (this.audio.buffered.end(i) - this.audio.currentTime) * 1000
    const key = `${this.activeVersion}:${state}:${Math.min(3000, Math.floor(ahead / 500) * 500)}`
    if (this.lastReadiness === key) return
    if (state === 'ready' && Date.now() - this.lastReadinessAt < 600) {
      clearTimeout(this.readinessTimer)
      this.readinessTimer = window.setTimeout(
        () => this.readiness(state),
        Math.max(1, 600 - (Date.now() - this.lastReadinessAt)),
      )
      return
    }
    this.lastReadiness = key
    this.lastReadinessAt = Date.now()
    this.observer.ready(state, ahead)
  }
  private sync(force = false) {
    if (force) this.alignOnReady = true
    if (this.suspended || this.sourcePending || !this.playback?.trackId || !this.activeVersion)
      return
    const now = this.now()
    // Preserve the shared preload window for a newly selected track.
    if (
      this.playback.status === 'playing' &&
      !this.playback.pendingTransition &&
      this.playback.anchorServerTimeMs > now
    ) {
      this.audio.pause()
      clearTimeout(this.schedule)
      this.schedule = window.setTimeout(
        () => this.sync(true),
        this.playback.anchorServerTimeMs - now,
      )
      return
    }
    const target = timelineAt(this.playback, now),
      drift = target.positionMs - this.audio.currentTime * 1000
    if (!this.allowed) {
      this.observer?.state('locked')
      this.readiness('autoplayBlocked')
      return
    }
    if (target.status !== 'playing') {
      this.audio.pause()
      if (this.audio.playbackRate !== 1) this.audio.playbackRate = 1
      this.correctionStart = 0
      this.alignment = null
      if (this.audio.readyState >= 3 && !this.buffering && !this.audio.seeking) {
        this.alignOnReady = false
        if (Math.abs(drift) > 80) this.audio.currentTime = target.positionMs / 1000
        this.readiness('ready')
      }
      this.observer?.state('paused')
      this.observer?.position(target.positionMs)
      return
    }
    if (this.buffering && this.audio.readyState >= 3 && !this.audio.seeking) this.buffering = false
    if (this.audio.readyState < 3 || this.buffering || this.audio.seeking) return
    // Let the decoder resume before measuring or correcting another drift.
    if (this.alignment && now - this.alignment.at < 1000 && !this.alignOnReady) return
    // Consume before assigning currentTime: resulting media events must not
    // request another forced alignment.
    force = this.alignOnReady
    this.alignOnReady = false
    if (this.alignment && now - this.alignment.at >= 1000) {
      const elapsed = now - this.alignment.at,
        advanced = this.audio.currentTime * 1000 - this.alignment.positionMs
      // Native decoders can take time to resume after seeked. Measure that
      // lost playback time once data is flowing, without including underruns.
      if (advanced > 40 && elapsed <= 2000) {
        this.seekLatencyMs = Math.max(0, Math.min(500, elapsed - advanced))
        force ||= Math.abs(drift) > 80
      }
      this.alignment = null
    }
    const action = correction(drift)
    if (force || action.seek || (this.correctionStart && now - this.correctionStart > 12000)) {
      if (this.audio.playbackRate !== 1) this.audio.playbackRate = 1
      this.correctionStart = 0
      if (Math.abs(drift) > 40) {
        const lead = Math.min(
          this.seekLatencyMs,
          Math.max(0, this.playback.durationMs - target.positionMs - 1000),
        )
        const positionMs = target.positionMs + lead
        this.alignment = { at: now, positionMs }
        this.audio.currentTime = positionMs / 1000
      }
    } else {
      if (this.audio.playbackRate !== action.rate) this.audio.playbackRate = action.rate
      if (action.rate !== 1) this.correctionStart ||= now
      else this.correctionStart = 0
    }
    if (this.audio.paused && !this.starting) {
      this.starting = true
      void this.audio
        .play()
        .catch((error) => {
          if (error instanceof DOMException && error.name === 'AbortError') return
          this.allowed = false
          this.observer?.state('locked')
          this.readiness('autoplayBlocked')
        })
        .finally(() => {
          this.starting = false
        })
    }
    this.observer?.position(this.audio.currentTime * 1000)
  }
}
