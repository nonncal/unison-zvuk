import { afterEach, beforeAll, expect, it, vi } from 'vitest'
class BrowserAudio extends EventTarget {
  static latest: BrowserAudio
  currentTime = 0
  readyState = 0
  duration = 60
  paused = true
  volume = 1
  muted = false
  preload = 'auto'
  preservesPitch = true
  playbackRate = 1
  src = ''
  ahead = 0
  buffered = { length: 1, start: () => 0, end: () => this.ahead / 1000 }
  constructor(src = '') {
    super()
    this.src = src
    BrowserAudio.latest = this
  }
  play() {
    this.paused = false
    return Promise.resolve()
  }
  pause() {
    this.paused = true
  }
  load() {}
  removeAttribute() {}
}
beforeAll(() => {
  vi.stubGlobal('Audio', BrowserAudio)
  vi.stubGlobal('window', globalThis)
})
afterEach(() => vi.useRealTimers())
it('reports newly buffered audio even when readiness state stays ready', async () => {
  vi.useFakeTimers()
  const { AudioEngine } = await import('./audio-engine')
  const engine = new AudioEngine(),
    ready = vi.fn()
  const dispose = engine.listen({ state: vi.fn(), position: vi.fn(), ready }, () => 1000)
  await engine.unlock()
  await engine.update(
    {
      roomId: 'room',
      epoch: 'epoch',
      playbackRevision: 1,
      trackId: 'track',
      mediaVersion: 'v1',
      status: 'paused',
      positionMs: 0,
      anchorServerTimeMs: 1000,
      durationMs: 60000,
      pendingTransition: null,
    },
    {
      id: 'track',
      title: 'Test',
      artist: 'Test',
      durationMs: 60000,
      status: 'ready',
      mediaVersion: 'v1',
    },
    async () => '/track.mp3',
  )
  const audio = BrowserAudio.latest
  audio.readyState = 3
  audio.ahead = 500
  audio.dispatchEvent(new Event('canplay'))
  await vi.advanceTimersByTimeAsync(600)
  expect(ready).toHaveBeenLastCalledWith('ready', 500)
  audio.ahead = 6000
  audio.dispatchEvent(new Event('progress'))
  await vi.advanceTimersByTimeAsync(600)
  expect(ready).toHaveBeenLastCalledWith('ready', 6000)
  dispose()
})

it('does not repeatedly seek stalled uploads and catches up after buffering', async () => {
  vi.useFakeTimers()
  const { AudioEngine } = await import('./audio-engine')
  const engine = new AudioEngine()
  let now = 1000
  const dispose = engine.listen({ state: vi.fn(), position: vi.fn(), ready: vi.fn() }, () => now)
  await engine.unlock()
  await engine.update(
    {
      roomId: 'room',
      epoch: 'epoch',
      playbackRevision: 1,
      trackId: 'track',
      mediaVersion: 'v1',
      status: 'playing',
      positionMs: 0,
      anchorServerTimeMs: 1000,
      durationMs: 60000,
      pendingTransition: null,
    },
    {
      id: 'track',
      title: 'Upload',
      artist: '',
      durationMs: 60000,
      status: 'ready',
      mediaVersion: 'v1',
    },
    async () => '/uploaded.mp3',
  )
  const audio = BrowserAudio.latest
  audio.readyState = 3
  audio.ahead = 60000
  audio.dispatchEvent(new Event('canplay'))
  audio.currentTime = 1
  audio.readyState = 2
  audio.dispatchEvent(new Event('waiting'))
  now = 10000
  await vi.advanceTimersByTimeAsync(3000)
  expect(audio.currentTime).toBe(1)
  audio.readyState = 3
  audio.dispatchEvent(new Event('canplay'))
  expect(audio.currentTime).toBe(9)
  await Promise.resolve()
  expect(audio.paused).toBe(false)
  dispose()
})

it('waits for the shared next-track anchor before starting playback', async () => {
  vi.useFakeTimers()
  const { AudioEngine } = await import('./audio-engine')
  const engine = new AudioEngine()
  let now = 1000
  const dispose = engine.listen({ state: vi.fn(), position: vi.fn(), ready: vi.fn() }, () => now)
  await engine.unlock()
  await engine.update(
    {
      roomId: 'room',
      epoch: 'epoch',
      playbackRevision: 2,
      trackId: 'next',
      mediaVersion: 'v1',
      status: 'playing',
      positionMs: 0,
      anchorServerTimeMs: 2000,
      durationMs: 60000,
      pendingTransition: null,
    },
    {
      id: 'next',
      title: 'Next',
      artist: '',
      durationMs: 60000,
      status: 'ready',
      mediaVersion: 'v1',
    },
    async () => '/next.mp3',
  )
  const audio = BrowserAudio.latest
  audio.readyState = 3
  audio.ahead = 60000
  audio.dispatchEvent(new Event('canplay'))
  expect(audio.paused).toBe(true)
  now = 2000
  await vi.advanceTimersByTimeAsync(1000)
  expect(audio.paused).toBe(false)
  expect(audio.currentTime).toBe(0)
  dispose()
})
