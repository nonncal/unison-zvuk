import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { Playback } from '@/entities/room'
import { DecodedAudioEngine } from './decoded-audio-engine'

function gain() {
  return {
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }
}
function sourceNode() {
  return {
    buffer: null as AudioBuffer | null,
    onended: null as (() => void) | null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }
}
class Context extends EventTarget {
  static latest: Context
  currentTime = 0
  state = 'suspended'
  destination = {}
  sources: ReturnType<typeof sourceNode>[] = []
  gains: ReturnType<typeof gain>[] = []
  decodeAudioData = vi.fn(async (): Promise<AudioBuffer> => ({ duration: 60 }) as AudioBuffer)
  constructor() {
    super()
    Context.latest = this
  }
  resume = vi.fn(async () => {
    this.state = 'running'
  })
  createGain() {
    const node = gain()
    this.gains.push(node)
    return node
  }
  createBufferSource() {
    const source = sourceNode()
    this.sources.push(source)
    return source
  }
}
const track = {
  id: 'track',
  mediaVersion: 'v1',
  title: 'Original tone',
  artist: '',
  durationMs: 60000,
  status: 'ready',
} as const
const paused: Playback = {
  roomId: 'room',
  epoch: 'epoch',
  playbackRevision: 1,
  trackId: track.id,
  mediaVersion: track.mediaVersion,
  status: 'paused',
  positionMs: 0,
  anchorServerTimeMs: 10000,
  durationMs: 60000,
  pendingTransition: null,
}
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('window', globalThis)
  vi.stubGlobal('AudioContext', Context)
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) })),
  )
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
async function prepared() {
  const engine = new DecodedAudioEngine()
  const observer = { state: vi.fn(), position: vi.fn(), ready: vi.fn() }
  const dispose = engine.listen(observer, () => 10000 + Context.latest.currentTime * 1000)
  await engine.unlock()
  await engine.update(paused, track, async () => '/tone.mp3')
  return { engine, observer, dispose, context: Context.latest }
}

it('reports readiness only after the complete MP3 has decoded', async () => {
  let complete!: (buffer: AudioBuffer) => void
  const engine = new DecodedAudioEngine()
  const ready = vi.fn()
  const dispose = engine.listen({ state: vi.fn(), position: vi.fn(), ready }, () => 10000)
  await engine.unlock()
  const context = Context.latest
  context.decodeAudioData.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        complete = resolve
      }),
  )
  const loading = engine.update(paused, track, async () => '/tone.mp3')
  await vi.waitFor(() => expect(context.decodeAudioData).toHaveBeenCalled())
  expect(ready).toHaveBeenLastCalledWith('loading', 0)
  complete({ duration: 60 } as AudioBuffer)
  await loading
  expect(ready).toHaveBeenLastCalledWith('ready', 60000)
  expect(context.sources).toHaveLength(0)
  dispose()
})

it('schedules the first sample in advance and never recalibrates the audible opening', async () => {
  const { engine, context, dispose } = await prepared()
  const pending: Playback = {
    ...paused,
    playbackRevision: 2,
    pendingTransition: {
      type: 'play',
      nextStatus: 'playing',
      positionMs: 0,
      effectiveAtServerTimeMs: 10750,
    },
  }
  await engine.update(pending, track, async () => '/tone.mp3')
  expect(context.sources).toHaveLength(1)
  expect(context.sources[0].start).toHaveBeenCalledWith(0.75, 0)
  for (let i = 1; i <= 40; i++) {
    context.currentTime = i / 4
    await vi.advanceTimersByTimeAsync(250)
  }
  expect(context.sources).toHaveLength(1)
  expect(context.sources[0].stop).not.toHaveBeenCalled()
  expect(engine.measurement()?.positionMs).toBe(9250)
  await engine.update(
    { ...pending, pendingTransition: null, status: 'playing', anchorServerTimeMs: 10750 },
    track,
    async () => '/tone.mp3',
  )
  expect(context.sources).toHaveLength(1)
  dispose()
})

it('starts a late join at the current target with no decoder catch-up seeks', async () => {
  const { engine, context, dispose } = await prepared()
  await engine.update(
    { ...paused, status: 'playing', anchorServerTimeMs: 5000 },
    track,
    async () => '/tone.mp3',
  )
  expect(context.sources[0].start).toHaveBeenCalledWith(0, 5)
  context.currentTime = 3
  await vi.advanceTimersByTimeAsync(3000)
  expect(context.sources).toHaveLength(1)
  expect(engine.measurement()?.positionMs).toBe(8000)
  dispose()
})

it('schedules a shared seek once and keeps the new voice when the snapshot commits', async () => {
  const { engine, context, dispose } = await prepared()
  const playing: Playback = { ...paused, status: 'playing' }
  await engine.update(playing, track, async () => '/tone.mp3')
  context.currentTime = 1
  const pending: Playback = {
    ...playing,
    playbackRevision: 2,
    pendingTransition: {
      type: 'seek',
      nextStatus: 'playing',
      positionMs: 20000,
      effectiveAtServerTimeMs: 11750,
    },
  }
  await engine.update(pending, track, async () => '/tone.mp3')
  expect(context.sources[1].start).toHaveBeenCalledWith(1.75, 20)
  expect(context.sources[0].stop).toHaveBeenCalledWith(1.755)
  context.currentTime = 2
  await engine.update(
    { ...pending, positionMs: 20000, anchorServerTimeMs: 11750, pendingTransition: null },
    track,
    async () => '/tone.mp3',
  )
  expect(context.sources).toHaveLength(2)
  expect(engine.measurement()?.positionMs).toBe(20250)
  dispose()
})

it('schedules pause on the audio clock and cancels future sound on connection loss', async () => {
  const { engine, context, dispose } = await prepared()
  await engine.update({ ...paused, status: 'playing' }, track, async () => '/tone.mp3')
  await engine.update(
    {
      ...paused,
      status: 'playing',
      pendingTransition: {
        type: 'pause',
        nextStatus: 'paused',
        positionMs: 750,
        effectiveAtServerTimeMs: 10750,
      },
    },
    track,
    async () => '/tone.mp3',
  )
  expect(context.sources[0].stop).toHaveBeenCalledWith(0.75)
  engine.pauseForConnection()
  expect(context.sources[0].onended).toBeNull()
  expect(engine.measurement()).toBeNull()
  dispose()
})

it('ignores a decode that finishes after another track has been selected', async () => {
  const { engine, context, dispose } = await prepared()
  let complete!: (buffer: AudioBuffer) => void
  context.decodeAudioData.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        complete = resolve
      }),
  )
  const first = engine.update(
    { ...paused, trackId: 'old' },
    { ...track, id: 'old' },
    async () => '/old.mp3',
  )
  await vi.waitFor(() => expect(complete).toBeTypeOf('function'))
  await engine.update({ ...paused, status: 'playing' }, track, async () => '/tone.mp3')
  const currentBuffer = context.sources[0].buffer
  complete({ duration: 20 } as AudioBuffer)
  await first
  expect(context.sources[0].buffer).toBe(currentBuffer)
  expect(engine.measurement()?.trackId).toBe(track.id)
  dispose()
})

it('refreshes a failed download and does not report a failed decode as ready', async () => {
  const { engine, observer, context, dispose } = await prepared()
  const resolve = vi.fn(async () => '/fresh.mp3')
  vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 403 } as Response)
  context.decodeAudioData.mockRejectedValueOnce(new Error('Invalid MP3'))
  await engine.update({ ...paused, trackId: 'invalid' }, { ...track, id: 'invalid' }, resolve)
  expect(resolve).toHaveBeenCalledTimes(2)
  expect(observer.ready).toHaveBeenLastCalledWith('error', 0)
  dispose()
})

it('changes local volume without replacing the playing buffer', async () => {
  const { engine, context, dispose } = await prepared()
  await engine.update({ ...paused, status: 'playing' }, track, async () => '/tone.mp3')
  engine.setVolume(0.3, true)
  expect(context.gains[0].gain.setTargetAtTime).toHaveBeenLastCalledWith(0, 0, 0.005)
  expect(context.sources).toHaveLength(1)
  dispose()
})
