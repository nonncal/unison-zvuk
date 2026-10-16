import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// Measure PCM on the audio rendering thread, including the opening five seconds.
const processor = `class Capture extends AudioWorkletProcessor {
  constructor() { super(); this.first = -1; this.silence = 0; this.maxGap = 0; this.earlyGap = 0;
    this.port.onmessage = () => this.port.postMessage({ firstSampleSeconds: this.first / sampleRate, maxGapMs: this.maxGap * 1000 / sampleRate, firstFiveSecondsMaxGapMs: this.earlyGap * 1000 / sampleRate }); }
  process(inputs, outputs) {
    const input = inputs[0]; const output = outputs[0];
    for(let c=0;c<output.length;c++) output[c].set(input[c] || input[0] || new Float32Array(128));
    const channel = input[0]; let sum=0; if(channel) for(const v of channel) sum+=v*v;
    const sounding=channel && Math.sqrt(sum/channel.length) > 0.00001;
    if(sounding) { if(this.first < 0) this.first=currentFrame; this.silence=0; }
    else if(this.first >= 0) { this.silence+=128; this.maxGap=Math.max(this.maxGap,this.silence);
      if(currentFrame-this.first < sampleRate*5) this.earlyGap=Math.max(this.earlyGap,this.silence); }
    return true;
  }
} registerProcessor('capture-startup',Capture);`

interface CaptureReport {
  firstSampleSeconds: number
  maxGapMs: number
  firstFiveSecondsMaxGapMs: number
}
interface StartupWindow extends Window {
  startup: {
    ready: boolean
    started: boolean
    report: () => Promise<CaptureReport & { starts: number; startTimingErrorMs: number }>
  }
}

for (const delay of [0, 2500]) {
  test(`prepared MP3 has no opening gaps with ${delay}ms download delay`, async ({
    page,
  }, info) => {
    const bytes = await readFile('tests/fixtures/startup-tone.mp3')
    await page.route('**/startup-tone.mp3', async (route) => {
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
      await route.fulfill({ contentType: 'audio/mpeg', body: bytes })
    })
    await page.goto('/')
    await page.evaluate(async (processor) => {
      const moduleUrl = '/src/features/listen-together/lib/audio-engine.ts'
      const { AudioEngine } = await import(moduleUrl)
      const engine = new AudioEngine()
      const w = window as StartupWindow
      const now = () => performance.timeOrigin + performance.now()
      let context: AudioContext, output: GainNode, capture: AudioWorkletNode
      let starts = 0,
        expectedContextTime = 0
      const createGain = AudioContext.prototype.createGain
      AudioContext.prototype.createGain = function () {
        const gain = createGain.call(this)
        context ??= gain.context as AudioContext
        output ??= gain
        return gain
      }
      const createSource = AudioContext.prototype.createBufferSource
      AudioContext.prototype.createBufferSource = function () {
        const source = createSource.call(this)
        const start = source.start.bind(source)
        source.start = (...args) => {
          starts++
          start(...args)
        }
        return source
      }
      const dispose = engine.listen({ state() {}, position() {}, ready() {} }, now)
      const track = {
        id: 'tone',
        mediaVersion: 'v1',
        title: 'Original tone',
        artist: '',
        durationMs: 12000,
        status: 'ready',
      }
      const paused = {
        roomId: 'qa',
        epoch: 'qa',
        playbackRevision: 1,
        trackId: 'tone',
        mediaVersion: 'v1',
        status: 'paused',
        positionMs: 0,
        anchorServerTimeMs: now(),
        durationMs: 12000,
        pendingTransition: null,
      }
      w.startup = {
        ready: false,
        started: false,
        report: async () => {
          const result = await new Promise<CaptureReport>((resolve) => {
            capture.port.onmessage = (e) => resolve(e.data)
            capture.port.postMessage('report')
          })
          dispose()
          return {
            ...result,
            starts,
            startTimingErrorMs: Math.abs(result.firstSampleSeconds - expectedContextTime) * 1000,
          }
        },
      }
      const prepare = document.createElement('button')
      prepare.textContent = 'Prepare startup test'
      prepare.onclick = async () => {
        await engine.unlock()
        const url = URL.createObjectURL(new Blob([processor], { type: 'text/javascript' }))
        await context.audioWorklet.addModule(url)
        URL.revokeObjectURL(url)
        capture = new AudioWorkletNode(context, 'capture-startup')
        output.disconnect()
        output.connect(capture)
        capture.connect(context.destination)
        await engine.update(paused, track, async () => '/startup-tone.mp3')
        w.startup.ready = true
      }
      const play = document.createElement('button')
      play.textContent = 'Play startup test'
      play.onclick = async () => {
        expectedContextTime = context.currentTime + 0.75
        await engine.update(
          {
            ...paused,
            playbackRevision: 2,
            pendingTransition: {
              type: 'play',
              nextStatus: 'playing',
              positionMs: 0,
              effectiveAtServerTimeMs: now() + 750,
            },
          },
          track,
          async () => '/startup-tone.mp3',
        )
        w.startup.started = true
      }
      document.body.append(prepare, play)
    }, processor)
    await page.getByRole('button', { name: 'Prepare startup test' }).click()
    await page.waitForFunction(() => (window as StartupWindow).startup.ready)
    await page.getByRole('button', { name: 'Play startup test' }).click()
    await page.waitForFunction(() => (window as StartupWindow).startup.started)
    await page.waitForTimeout(10750)
    const report = await page.evaluate(() => (window as StartupWindow).startup.report())
    await info.attach('rendered-audio-startup', {
      body: JSON.stringify(report),
      contentType: 'application/json',
    })
    expect(report.starts).toBe(1)
    expect(report.firstFiveSecondsMaxGapMs).toBeLessThan(10)
    expect(report.maxGapMs).toBeLessThan(10)
    expect(report.startTimingErrorMs).toBeLessThan(30)
  })
}
