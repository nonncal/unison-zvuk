// Original, programmatically composed 24-second instrumental clips. No third-party music.
import { mkdirSync, writeFileSync } from 'node:fs'
const sr = 16000,
  duration = 24,
  samples = sr * duration
mkdirSync('public/audio', { recursive: true })
for (let track = 1; track <= 6; track++) {
  const bytes = Buffer.alloc(44 + samples * 2)
  bytes.write('RIFF', 0)
  bytes.writeUInt32LE(bytes.length - 8, 4)
  bytes.write('WAVEfmt ', 8)
  bytes.writeUInt32LE(16, 16)
  bytes.writeUInt16LE(1, 20)
  bytes.writeUInt16LE(1, 22)
  bytes.writeUInt32LE(sr, 24)
  bytes.writeUInt32LE(sr * 2, 28)
  bytes.writeUInt16LE(2, 32)
  bytes.writeUInt16LE(16, 34)
  bytes.write('data', 36)
  bytes.writeUInt32LE(samples * 2, 40)
  const roots = [130.81, 146.83, 174.61, 196, 164.81, 110]
  const chords = [1, 0.7937, 1.12246, 0.8909]
  for (let i = 0; i < samples; i++) {
    const t = i / sr,
      beat = t % 0.75,
      root = roots[track - 1] * chords[Math.floor(t / 6)]
    const fade = Math.min(1, t / 0.3, (duration - t) / 1.5)
    const pad = [1, 1.2599, 1.4983].reduce(
      (sum, ratio) => sum + Math.sin(2 * Math.PI * root * ratio * t) * 0.07,
      0,
    )
    const note = [1, 1.2599, 1.4983, 2, 1.4983, 1.2599, 1.12246, 1.4983][Math.floor(t / 0.75) % 8]
    const bell = Math.sin(2 * Math.PI * root * 2 * note * t) * Math.exp(-beat * 7) * 0.16
    bytes.writeInt16LE(Math.round((pad + bell) * fade * 22000), 44 + i * 2)
  }
  writeFileSync(`public/audio/demo-${track}.wav`, bytes)
}
