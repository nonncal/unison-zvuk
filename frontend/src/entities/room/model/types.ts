import type { Track } from '@/entities/track/@x/room'
export type Role = 'host' | 'listener'
export type AudioState =
  'locked' | 'loading' | 'ready' | 'playing' | 'paused' | 'buffering' | 'error'
export type ConnectionState =
  'idle' | 'connecting' | 'connected' | 'reconnecting' | 'failed' | 'closed'
export interface Participant {
  id: string
  displayName: string
  role: Role
  connectionState: 'online' | 'offline' | 'connecting'
  readiness: 'loading' | 'ready' | 'buffering' | 'autoplayBlocked' | 'error'
}
export type PlaybackStatus = 'empty' | 'paused' | 'playing' | 'ended'
export interface Transition {
  type: 'play' | 'pause' | 'seek'
  nextStatus: PlaybackStatus
  positionMs: number
  effectiveAtServerTimeMs: number
}
export interface Playback {
  roomId: string
  epoch: string
  playbackRevision: number
  trackId: string | null
  mediaVersion: string | null
  status: PlaybackStatus
  positionMs: number
  anchorServerTimeMs: number
  durationMs: number
  pendingTransition: Transition | null
}
export interface Snapshot {
  room: {
    id: string
    title: string
    status: 'active' | 'closed' | 'expired'
    capacity: number
    expiresAt: number
    hostParticipantId: string | null
  }
  participants: Participant[]
  playback: Playback
  presenceSeq: number
}
export interface Membership {
  participantId: string
  role: Role
  snapshot: Snapshot
}
export interface CreatedRoom extends Membership {
  roomId: string
  inviteUrl: string
  expiresAt: number
}
export interface Preview {
  roomId: string
  title: string
  status: string
  participantCount: number
  capacity: number
  expiresAt: number
}
export type PlaybackCommand =
  | { type: 'playback.select'; payload: { trackId: string } }
  | { type: 'playback.play'; payload: { allowNotReady: boolean } }
  | { type: 'playback.pause'; payload: Record<string, never> }
  | { type: 'playback.seek'; payload: { positionMs: number } }
export interface Readiness {
  trackId: string
  mediaVersion: string
  state: Participant['readiness']
  bufferedAheadMs: number
  autoplayAllowed: boolean
}
export interface RoomConnection {
  send(command: PlaybackCommand, revision: number): Promise<void>
  readiness(value: Readiness): void
  snapshot(): void
  now(): number
  dispose(): void
}
export interface Gateway {
  mode: 'demo' | 'api'
  create(name: string, title: string): Promise<CreatedRoom>
  preview(roomId: string, token: string): Promise<Preview>
  join(roomId: string, token: string, name: string): Promise<Membership>
  restore(roomId: string): Promise<Membership>
  invite(roomId: string): Promise<string>
  tracks(roomId: string): Promise<Track[]>
  audioUrl(roomId: string, track: Track): Promise<string>
  upload(
    roomId: string,
    file: File,
    progress: (percent: number) => void,
    signal: AbortSignal,
  ): Promise<Track>
  leave(roomId: string): Promise<void>
  close(roomId: string, revision: number): Promise<void>
  connect(
    roomId: string,
    participantId: string,
    onSnapshot: (snapshot: Snapshot) => void,
    onConnection: (state: ConnectionState) => void,
    onError: (error: string) => void,
  ): RoomConnection
}
