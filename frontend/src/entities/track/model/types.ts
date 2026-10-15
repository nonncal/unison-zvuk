export interface Track {
  id: string
  title: string
  artist: string
  durationMs: number
  status: 'ready' | 'processing' | 'failed'
  mediaVersion: string
  coverUrl?: string
  cover?: string
  source?: 'catalog' | 'upload'
}
