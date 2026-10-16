import { NativeAudioEngine } from './native-audio-engine'
import { DecodedAudioEngine } from './decoded-audio-engine'

// Keep the native path for browsers without Web Audio.
export const AudioEngine =
  typeof globalThis.AudioContext === 'function' ? DecodedAudioEngine : NativeAudioEngine
export const audioEngine = new AudioEngine()
