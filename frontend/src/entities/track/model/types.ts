export interface Track {
  id: string
  title: string
  artist: string
  durationMs: number
  status: 'ready' | 'processing' | 'failed'
  mediaVersion: string
  coverUrl?: string
  lyricsUrl?: string
  cover?: string
  source?: 'catalog' | 'upload'
}
export interface LyricLine {
  t: number
  text: string
}
export interface Lyrics {
  kind: 'synced' | 'plain'
  source: 'lrc' | 'text' | 'embedded'
  lines?: LyricLine[]
  text?: string
}
