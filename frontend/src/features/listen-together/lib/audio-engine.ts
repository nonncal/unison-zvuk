import type { AudioState, Playback } from '@/entities/room'
import type { Track } from '@/entities/track'
import { timelineAt } from '@/entities/room'
import { correction } from './correction'
interface Observer {
  state: (state: AudioState) => void
  position: (ms: number) => void
  ready: (
    state: 'ready' | 'loading' | 'buffering' | 'autoplayBlocked' | 'error',
    bufferedMs: number,
  ) => void
}
export class AudioEngine {
  private audio = new Audio('/audio/unlock.wav')
  private allowed = false
  private playback: Playback | null = null
  private observer: Observer | null = null
  private generation = 0
  private activeVersion: string | null = null
  private activeUrl: string | null = null
  private now = () => Date.now()
  private timer = 0
  private schedule = 0
  private correctionStart = 0
  private starting = false
  private volume = 0.65
  private suspended = false
  private lastReadiness = ''
  constructor() {
    this.audio.preload = 'auto'
    this.audio.preservesPitch = true
    this.audio.addEventListener('loadedmetadata', () => this.sync(true))
    this.audio.addEventListener('canplay', () => {
      if (this.activeVersion) {
        this.readiness(this.allowed ? 'ready' : 'autoplayBlocked')
        this.sync(true)
      }
    })
    const reportBuffer = () => {
      if (this.activeVersion && this.audio.readyState >= 2) {
        this.readiness(this.allowed ? 'ready' : 'autoplayBlocked')
      }
    }
    this.audio.addEventListener('progress', reportBuffer)
    this.audio.addEventListener('canplaythrough', reportBuffer)
    this.audio.addEventListener('waiting', () => {
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
  listen(observer: Observer, now: () => number) {
    this.observer = observer
    this.lastReadiness = ''
    this.suspended = false
    this.now = now
    this.observer.state(this.allowed ? 'ready' : 'locked')
    clearInterval(this.timer)
    this.timer = window.setInterval(() => this.sync(), 1000)
    return () => {
      clearInterval(this.timer)
      clearTimeout(this.schedule)
      this.observer = null
      this.audio.pause()
      this.generation++
      this.activeVersion = null
      this.playback = null
      this.releaseUrl()
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
  async update(playback: Playback, track: Track | undefined, url: () => Promise<string>) {
    const epochChanged = this.playback?.epoch !== playback.epoch
    this.playback = playback
    clearTimeout(this.schedule)
    if (!track) {
      this.audio.pause()
      this.generation++
      this.activeVersion = null
      this.observer?.state(this.allowed ? 'ready' : 'locked')
      this.observer?.position(0)
      return
    }
    const version = `${track.id}:${track.mediaVersion}`
    if (this.activeVersion !== version) {
      const generation = ++this.generation
      this.activeVersion = version
      this.audio.pause()
      this.audio.playbackRate = 1
      this.observer?.state('loading')
      this.readiness('loading')
      try {
        const source = await url()
        if (generation !== this.generation) {
          if (source.startsWith('blob:')) URL.revokeObjectURL(source)
          return
        }
        this.releaseUrl()
        this.activeUrl = source
        this.audio.src = source
        this.audio.volume = this.volume
        this.audio.load()
      } catch {
        if (generation === this.generation) {
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
        !this.allowed ? 'autoplayBlocked' : this.audio.readyState >= 2 ? 'ready' : 'loading',
      )
    }
    this.sync(true)
  }
  retrySource() {
    this.activeVersion = null
    this.lastReadiness = ''
    this.audio.pause()
  }
  pauseForConnection() {
    this.suspended = true
    this.audio.pause()
    this.audio.playbackRate = 1
    this.observer?.state('paused')
  }
  private readiness(state: Parameters<Observer['ready']>[0]) {
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
    this.lastReadiness = key
    this.observer.ready(state, ahead)
  }
  private sync(force = false) {
    if (
      this.suspended ||
      !this.playback?.trackId ||
      !this.activeVersion ||
      this.audio.readyState < 2
    )
      return
    const target = timelineAt(this.playback, this.now()),
      drift = target.positionMs - this.audio.currentTime * 1000
    if (!this.allowed) {
      this.observer?.state('locked')
      this.readiness('autoplayBlocked')
      return
    }
    if (target.status !== 'playing') {
      this.audio.pause()
      this.audio.playbackRate = 1
      this.correctionStart = 0
      if (Math.abs(drift) > 80 && !this.audio.seeking)
        this.audio.currentTime = target.positionMs / 1000
      this.observer?.state('paused')
      this.readiness('ready')
      this.observer?.position(target.positionMs)
      return
    }
    if (!this.audio.seeking) {
      const action = correction(drift)
      if (
        force ||
        action.seek ||
        (this.correctionStart && this.now() - this.correctionStart > 3000)
      ) {
        if (Math.abs(drift) > 40) this.audio.currentTime = target.positionMs / 1000
        this.audio.playbackRate = 1
        this.correctionStart = 0
      } else {
        this.audio.playbackRate = action.rate
        if (action.rate !== 1) this.correctionStart ||= this.now()
        else this.correctionStart = 0
      }
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
export const audioEngine = new AudioEngine()
