import { describe, it, expect } from 'vitest'
import { validateFile } from './index'
import { formatTime } from '@/shared/lib/time'
describe('file boundaries', () => {
  it('rejects unsupported, empty and oversized uploads', () => {
    expect(() => validateFile({ name: 'track.exe', size: 100 })).toThrow('MP3')
    expect(() => validateFile({ name: 'track.mp3', size: 0 })).toThrow('пустой')
    expect(() => validateFile({ name: 'track.wav', size: 50 * 1024 * 1024 + 1 })).toThrow('50 МБ')
  })
  it('accepts the exact file limit and case-insensitive extension', () => {
    expect(() => validateFile({ name: 'track.MP3', size: 50 * 1024 * 1024 })).not.toThrow()
  })
  it('formats elapsed time without negative values', () => {
    expect(formatTime(-100)).toBe('0:00')
    expect(formatTime(65000)).toBe('1:05')
  })
})
