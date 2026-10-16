/** Observe actual browser audio nodes; support native and prepared playback. */
export function observePreparedAudio() {
  if (typeof AudioContext !== 'function') return
  const w = window as Window & {
    __audio?: Pick<
      HTMLMediaElement,
      'currentTime' | 'paused' | 'readyState' | 'src' | 'playbackRate' | 'seeking'
    >
  }
  const encodedUrls = new WeakMap<ArrayBuffer, string>()
  const bufferUrls = new WeakMap<AudioBuffer, string>()
  let prepared: AudioBuffer | undefined
  const fetchResource = window.fetch
  window.fetch = async (...args) => {
    const response = await fetchResource(...args)
    const arrayBuffer = response.arrayBuffer.bind(response)
    response.arrayBuffer = async () => {
      const bytes = await arrayBuffer()
      encodedUrls.set(bytes, response.url)
      return bytes
    }
    return response
  }
  const decode = AudioContext.prototype.decodeAudioData
  AudioContext.prototype.decodeAudioData = function (bytes, success, failure) {
    const result = decode.call(this, bytes, success, failure)
    void result.then(
      (buffer) => {
        bufferUrls.set(buffer, encodedUrls.get(bytes) ?? '')
        prepared = buffer
      },
      () => {},
    )
    return result
  }
  interface Voice {
    context: AudioContext
    source: AudioBufferSourceNode
    at: number
    offset: number
    stopAt: number
  }
  const voices: Voice[] = []
  let native: typeof w.__audio
  Object.defineProperty(w, '__audio', {
    configurable: true,
    get() {
      const voice =
        voices.findLast((v) => v.at <= v.context.currentTime && v.stopAt > v.context.currentTime) ??
        voices.at(-1)
      if (
        !voice ||
        (voice.stopAt <= voice.context.currentTime && voice.source.buffer !== prepared)
      ) {
        if (!prepared) return native
        return {
          currentTime: 0,
          paused: true,
          readyState: 4,
          src: bufferUrls.get(prepared) ?? '',
          playbackRate: 1,
          seeking: false,
        }
      }
      return {
        get currentTime() {
          return Math.min(
            voice.source.buffer?.duration ?? 0,
            voice.offset +
              Math.max(0, Math.min(voice.context.currentTime, voice.stopAt) - voice.at),
          )
        },
        get paused() {
          return (
            voice.context.state !== 'running' ||
            voice.context.currentTime < voice.at ||
            voice.context.currentTime >= voice.stopAt
          )
        },
        readyState: 4,
        src: bufferUrls.get(voice.source.buffer!) ?? '',
        get playbackRate() {
          return voice.source.playbackRate.value
        },
        seeking: false,
      }
    },
    set(value: typeof w.__audio) {
      native = value
    },
  })
  const create = AudioContext.prototype.createBufferSource
  AudioContext.prototype.createBufferSource = function () {
    const source = create.call(this)
    const start = source.start.bind(source)
    const stop = source.stop.bind(source)
    let voice: Voice | undefined
    source.start = (when = 0, offset = 0, duration?: number) => {
      const at = Math.max(this.currentTime, when)
      voice = {
        context: this,
        source,
        at,
        offset,
        stopAt: at + (duration ?? (source.buffer?.duration ?? 0) - offset),
      }
      voices.push(voice)
      if (duration === undefined) start(when, offset)
      else start(when, offset, duration)
    }
    source.stop = (when = 0) => {
      if (voice) voice.stopAt = Math.max(this.currentTime, when)
      stop(when)
    }
    return source
  }
}
