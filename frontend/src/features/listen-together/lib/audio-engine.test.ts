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
  expect(ready).toHaveBeenLastCalledWith('ready', 500)
  audio.ahead = 6000
  audio.dispatchEvent(new Event('progress'))
  expect(ready).toHaveBeenLastCalledWith('ready', 6000)
  dispose()
})
