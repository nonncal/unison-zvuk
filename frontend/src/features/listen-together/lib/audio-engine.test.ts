import { afterEach, beforeAll, expect, it, vi } from 'vitest'
import type { Playback } from '@/entities/room'
import type { Track } from '@/entities/track'
class BrowserAudio extends EventTarget {
  static latest: BrowserAudio
  currentTime = 0
  readyState = 0
  duration = 60
  paused = true
  seeking = false
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
const playback: Playback = {
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
}
const track: Track = {
  id: 'track',
  title: 'Test',
  artist: 'Test',
  durationMs: 60000,
  status: 'ready',
  mediaVersion: 'v1',
}
async function playingEngine() {
  vi.useFakeTimers()
  const { AudioEngine } = await import('./audio-engine')
  const engine = new AudioEngine()
  let now = 1000
  const dispose = engine.listen({ state: vi.fn(), position: vi.fn(), ready: vi.fn() }, () => now)
  await engine.unlock()
  await engine.update(playback, track, async () => '/track.mp3')
  const audio = BrowserAudio.latest
  audio.readyState = 3
  audio.ahead = 60000
  audio.dispatchEvent(new Event('canplay'))
  await Promise.resolve()
  return { engine, audio, dispose, setNow: (value: number) => (now = value) }
}

it('does not seek again when canplay follows a slow seek', async () => {
  const { engine, audio, dispose, setNow } = await playingEngine()
  try {
    setNow(11000)
    await engine.update(
      { ...playback, playbackRevision: 2, positionMs: 20000, anchorServerTimeMs: 11000 },
      track,
      async () => '/track.mp3',
    )
    expect(audio.currentTime).toBe(20)
    audio.seeking = true
    audio.dispatchEvent(new Event('waiting'))
    setNow(11400)
    audio.seeking = false
    audio.dispatchEvent(new Event('seeked'))
    audio.dispatchEvent(new Event('canplay'))
    expect(audio.currentTime).toBe(20)
  } finally {
    dispose()
  }
})

it('ignores repeated canplay events during otherwise continuous playback', async () => {
  const { audio, dispose, setNow } = await playingEngine()
  try {
    audio.currentTime = 1
    setNow(2100)
    for (let i = 0; i < 5; i++) audio.dispatchEvent(new Event('canplay'))
    expect(audio.currentTime).toBe(1)
    expect(audio.playbackRate).toBe(1)
  } finally {
    dispose()
  }
})

it('waits for future audio data before aligning after a buffer underrun', async () => {
  const { audio, dispose, setNow } = await playingEngine()
  try {
    audio.currentTime = 1
    audio.readyState = 2
    audio.dispatchEvent(new Event('waiting'))
    setNow(5000)
    await vi.advanceTimersByTimeAsync(2000)
    expect(audio.currentTime).toBe(1)
    expect(audio.playbackRate).toBe(1)
    audio.readyState = 3
    audio.dispatchEvent(new Event('canplay'))
    expect(audio.currentTime).toBe(4)
    setNow(5400)
    audio.dispatchEvent(new Event('canplay'))
    expect(audio.currentTime).toBe(4)
  } finally {
    dispose()
  }
})

it('compensates decoder resume latency instead of seeking every second', async () => {
  const { audio, dispose, setNow } = await playingEngine()
  try {
    setNow(2000)
    audio.currentTime = 0.5
    await vi.advanceTimersByTimeAsync(1000)
    expect(audio.currentTime).toBe(1)
    setNow(3000)
    audio.currentTime = 1.7
    await vi.advanceTimersByTimeAsync(1000)
    expect(audio.currentTime).toBe(2.3)
    for (let second = 4; second <= 8; second++) {
      setNow(second * 1000)
      audio.currentTime = second - 1
      await vi.advanceTimersByTimeAsync(1000)
      expect(audio.currentTime).toBe(second - 1)
      expect(audio.playbackRate).toBe(1)
    }
  } finally {
    dispose()
  }
})

it('pauses immediately when the room is paused during buffering', async () => {
  const { engine, audio, dispose } = await playingEngine()
  try {
    audio.readyState = 2
    audio.dispatchEvent(new Event('waiting'))
    await engine.update({ ...playback, status: 'paused' }, track, async () => '/track.mp3')
    expect(audio.paused).toBe(true)
  } finally {
    dispose()
  }
})

it('lets the decoder settle before correcting intermediate snapshot positions', async () => {
  const { engine, audio, dispose, setNow } = await playingEngine()
  const next = { ...playback, playbackRevision: 2, positionMs: 10000, anchorServerTimeMs: 2000 }
  try {
    setNow(2000)
    await engine.update(next, track, async () => '/track.mp3')
    expect(audio.currentTime).toBe(10)
    setNow(2500)
    audio.currentTime = 10.1
    await engine.update(next, track, async () => '/track.mp3')
    expect(audio.currentTime).toBe(10.1)
    expect(audio.playbackRate).toBe(1)
    setNow(3000)
    audio.currentTime = 10.7
    await engine.update(next, track, async () => '/track.mp3')
    expect(audio.currentTime).toBeCloseTo(11.3)
  } finally {
    dispose()
  }
})

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
