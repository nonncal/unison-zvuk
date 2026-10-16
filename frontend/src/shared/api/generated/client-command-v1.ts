/* Types from the versioned JSON Schema. */

export type ClientCommand =
  | ClockProbe
  | HeartbeatPong
  | SnapshotRequest
  | ParticipantReadiness
  | SelectTrack
  | Play
  | Pause
  | Seek
  | Telemetry
  | SendReaction;
export type V = 1;
export type Requestid = string;
export type Expectedplaybackrevision = null;
export type Type = "clock.probe";
export type Clientsentatms = number;
export type Probeid = string;
export type V1 = 1;
export type Requestid1 = string;
export type Expectedplaybackrevision1 = null;
export type Type1 = "heartbeat.pong";
export type Pingid = string;
export type V2 = 1;
export type Requestid2 = string;
export type Expectedplaybackrevision2 = null;
export type Type2 = "room.snapshot.request";
export type V3 = 1;
export type Requestid3 = string;
export type Expectedplaybackrevision3 = null;
export type Type3 = "participant.readiness";
export type Trackid = string;
export type Mediaversion = string;
export type State = "loading" | "ready" | "buffering" | "autoplayBlocked" | "error";
export type Bufferedaheadms = number;
export type Autoplayallowed = boolean;
export type V4 = 1;
export type Requestid4 = string;
export type Expectedplaybackrevision4 = number;
export type Type4 = "playback.select";
export type Trackid1 = string;
export type V5 = 1;
export type Requestid5 = string;
export type Expectedplaybackrevision5 = number;
export type Type5 = "playback.play";
export type Allownotready = boolean;
export type V6 = 1;
export type Requestid6 = string;
export type Expectedplaybackrevision6 = number;
export type Type6 = "playback.pause";
export type V7 = 1;
export type Requestid7 = string;
export type Expectedplaybackrevision7 = number;
export type Type7 = "playback.seek";
export type Positionms = number;
export type V8 = 1;
export type Requestid8 = string;
export type Expectedplaybackrevision8 = null;
export type Type8 = "sync.telemetry";
export type Trackid2 = string;
export type Mediaversion1 = string;
export type Driftms = number;
export type Rttms = number;
export type Localstate = "playing" | "paused" | "buffering" | "autoplayBlocked" | "error";
export type V9 = 1;
export type Requestid9 = string;
export type Expectedplaybackrevision9 = null;
export type Type9 = "reaction.send";
export type Emoji = "❤️" | "🔥" | "👏" | "✨" | "🎶" | "😂";

export interface ClockProbe {
  v: V;
  requestId: Requestid;
  expectedPlaybackRevision?: Expectedplaybackrevision;
  type: Type;
  payload: ProbePayload;
}
export interface ProbePayload {
  clientSentAtMs: Clientsentatms;
  probeId: Probeid;
}
export interface HeartbeatPong {
  v: V1;
  requestId: Requestid1;
  expectedPlaybackRevision?: Expectedplaybackrevision1;
  type: Type1;
  payload: PingPayload;
}
export interface PingPayload {
  pingId: Pingid;
}
export interface SnapshotRequest {
  v: V2;
  requestId: Requestid2;
  expectedPlaybackRevision?: Expectedplaybackrevision2;
  type: Type2;
  payload: EmptyPayload;
}
export interface EmptyPayload {}
export interface ParticipantReadiness {
  v: V3;
  requestId: Requestid3;
  expectedPlaybackRevision?: Expectedplaybackrevision3;
  type: Type3;
  payload: Readiness;
}
export interface Readiness {
  trackId: Trackid;
  mediaVersion: Mediaversion;
  state: State;
  bufferedAheadMs: Bufferedaheadms;
  autoplayAllowed: Autoplayallowed;
}
export interface SelectTrack {
  v: V4;
  requestId: Requestid4;
  expectedPlaybackRevision: Expectedplaybackrevision4;
  type: Type4;
  payload: SelectPayload;
}
export interface SelectPayload {
  trackId: Trackid1;
}
export interface Play {
  v: V5;
  requestId: Requestid5;
  expectedPlaybackRevision: Expectedplaybackrevision5;
  type: Type5;
  payload: PlayPayload;
}
export interface PlayPayload {
  allowNotReady?: Allownotready;
}
export interface Pause {
  v: V6;
  requestId: Requestid6;
  expectedPlaybackRevision: Expectedplaybackrevision6;
  type: Type6;
  payload: EmptyPayload;
}
export interface Seek {
  v: V7;
  requestId: Requestid7;
  expectedPlaybackRevision: Expectedplaybackrevision7;
  type: Type7;
  payload: SeekPayload;
}
export interface SeekPayload {
  positionMs: Positionms;
}
export interface Telemetry {
  v: V8;
  requestId: Requestid8;
  expectedPlaybackRevision?: Expectedplaybackrevision8;
  type: Type8;
  payload: TelemetryPayload;
}
export interface TelemetryPayload {
  trackId: Trackid2;
  mediaVersion: Mediaversion1;
  driftMs: Driftms;
  rttMs: Rttms;
  localState: Localstate;
}
export interface SendReaction {
  v: V9;
  requestId: Requestid9;
  expectedPlaybackRevision?: Expectedplaybackrevision9;
  type: Type9;
  payload: ReactionPayload;
}
export interface ReactionPayload {
  emoji: Emoji;
}
