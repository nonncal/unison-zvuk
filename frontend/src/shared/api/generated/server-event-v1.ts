/* Types from the versioned JSON Schema. */

export type ServerEvent =
  | Hello
  | RoomSnapshot
  | PlaybackState
  | ClockReply
  | HeartbeatPing
  | PresenceChanged
  | HostChanged
  | TrackUpdated
  | RoomClosed
  | CommandAck
  | CommandError
  | ReactionCreated;
export type V = 1;
export type Eventid = string;
export type Servertimems = number;
export type Playbackrevision = number;
export type Type = "hello";
export type Connectionid = string;
export type Epoch = string;
export type Protocolversion = 1;
export type Id = string;
export type Title = string;
export type Status = "active" | "closed" | "expired";
export type Capacity = number;
export type Expiresat = number;
export type Hostparticipantid = string | null;
export type Moderated = boolean;
export type Id1 = string;
export type Displayname = string;
export type Role = "host" | "listener";
export type Connectionstate = "online" | "offline" | "connecting";
export type Trackid = string;
export type Mediaversion = string;
export type State = "loading" | "ready" | "buffering" | "autoplayBlocked" | "error";
export type Bufferedaheadms = number;
export type Autoplayallowed = boolean;
export type Canedit = boolean;
export type Participants = Participant[];
export type Roomid = string;
export type Epoch1 = string;
export type Trackid1 = string | null;
export type Mediaversion1 = string | null;
export type Status1 = "empty" | "paused" | "playing" | "ended";
export type Positionms = number;
export type Anchorservertimems = number;
export type Durationms = number;
export type Type1 = "play" | "pause" | "seek";
export type Nextstatus = "paused" | "playing" | "ended";
export type Positionms1 = number;
export type Effectiveatservertimems = number;
export type Trackid2 = string | null;
export type Mediaversion2 = string | null;
export type Presenceseq = number;
export type Playbackrevision1 = number;
/**
 * @maxItems 100
 */
export type Trackids = string[];
/**
 * @maxItems 100
 */
export type Skippedtrackids = string[];
export type Repeat = "off" | "all" | "one";
export type Shuffle = boolean;
export type V1 = 1;
export type Eventid1 = string;
export type Servertimems1 = number;
export type Playbackrevision2 = number;
export type Type2 = "room.snapshot";
export type V2 = 1;
export type Eventid2 = string;
export type Servertimems2 = number;
export type Playbackrevision3 = number;
export type Type3 = "playback.state";
export type V3 = 1;
export type Eventid3 = string;
export type Servertimems3 = number;
export type Playbackrevision4 = number;
export type Type4 = "clock.reply";
export type Clientsentatms = number;
export type Probeid = string;
export type Serverreceivedatms = number;
export type Serversentatms = number;
export type V4 = 1;
export type Eventid4 = string;
export type Servertimems4 = number;
export type Playbackrevision5 = number;
export type Type5 = "heartbeat.ping";
export type Pingid = string;
export type V5 = 1;
export type Eventid5 = string;
export type Servertimems5 = number;
export type Playbackrevision6 = number;
export type Type6 = "presence.changed";
export type Presenceseq1 = number;
export type Participants1 = Participant[];
export type V6 = 1;
export type Eventid6 = string;
export type Servertimems6 = number;
export type Playbackrevision7 = number;
export type Type7 = "host.changed";
export type Participantid = string | null;
export type V7 = 1;
export type Eventid7 = string;
export type Servertimems7 = number;
export type Playbackrevision8 = number;
export type Type8 = "track.updated";
export type Id2 = string;
export type Title1 = string;
export type Artist = string;
export type Durationms1 = number | null;
export type Status2 = "uploading" | "processing" | "ready" | "failed";
export type Errorcode = string | null;
export type Mediaversion3 = string | null;
export type Coverurl = string | null;
export type Sourceuri = string | null;
export type Licenseid = string | null;
export type Licenseuri = string | null;
export type V8 = 1;
export type Eventid8 = string;
export type Servertimems8 = number;
export type Playbackrevision9 = number;
export type Type9 = "room.closed";
export type Reason = "closedByHost" | "expired" | "emptyTimeout";
export type V9 = 1;
export type Eventid9 = string;
export type Servertimems9 = number;
export type Playbackrevision10 = number;
export type Type10 = "command.ack";
export type Requestid = string;
export type Acceptedplaybackrevision = number;
export type Effectiveatservertimems1 = number | null;
export type V10 = 1;
export type Eventid10 = string;
export type Servertimems10 = number;
export type Playbackrevision11 = number;
export type Type11 = "command.error";
export type Requestid1 = string | null;
export type Code = string;
export type Message = string;
export type V11 = 1;
export type Eventid11 = string;
export type Servertimems11 = number;
export type Playbackrevision12 = number;
export type Type12 = "reaction.created";
export type Emoji = "❤️" | "🔥" | "👏" | "✨" | "🎶" | "😂";
export type Participantid1 = string;

export interface Hello {
  v: V;
  eventId: Eventid;
  serverTimeMs: Servertimems;
  playbackRevision: Playbackrevision;
  type: Type;
  payload: HelloPayload;
}
export interface HelloPayload {
  connectionId: Connectionid;
  epoch: Epoch;
  protocolVersion?: Protocolversion;
  snapshot: Snapshot;
}
export interface Snapshot {
  room: Room;
  participants: Participants;
  playback: Playback;
  presenceSeq: Presenceseq;
  playbackRevision: Playbackrevision1;
  playlist?: Playlist;
}
export interface Room {
  id: Id;
  title: Title;
  status: Status;
  capacity: Capacity;
  expiresAt: Expiresat;
  hostParticipantId: Hostparticipantid;
  moderated?: Moderated;
}
export interface Participant {
  id: Id1;
  displayName: Displayname;
  role: Role;
  connectionState: Connectionstate;
  readiness: Readiness | null;
  canEdit?: Canedit;
}
export interface Readiness {
  trackId: Trackid;
  mediaVersion: Mediaversion;
  state: State;
  bufferedAheadMs: Bufferedaheadms;
  autoplayAllowed: Autoplayallowed;
}
export interface Playback {
  roomId: Roomid;
  epoch: Epoch1;
  trackId: Trackid1;
  mediaVersion: Mediaversion1;
  status: Status1;
  positionMs: Positionms;
  anchorServerTimeMs: Anchorservertimems;
  durationMs: Durationms;
  pendingTransition: PendingTransition | null;
}
export interface PendingTransition {
  type: Type1;
  nextStatus: Nextstatus;
  positionMs: Positionms1;
  effectiveAtServerTimeMs: Effectiveatservertimems;
  trackId?: Trackid2;
  mediaVersion?: Mediaversion2;
}
export interface Playlist {
  trackIds?: Trackids;
  skippedTrackIds?: Skippedtrackids;
  repeat?: Repeat;
  shuffle?: Shuffle;
}
export interface RoomSnapshot {
  v: V1;
  eventId: Eventid1;
  serverTimeMs: Servertimems1;
  playbackRevision: Playbackrevision2;
  type: Type2;
  payload: Snapshot;
}
export interface PlaybackState {
  v: V2;
  eventId: Eventid2;
  serverTimeMs: Servertimems2;
  playbackRevision: Playbackrevision3;
  type: Type3;
  payload: Playback;
}
export interface ClockReply {
  v: V3;
  eventId: Eventid3;
  serverTimeMs: Servertimems3;
  playbackRevision: Playbackrevision4;
  type: Type4;
  payload: ClockReplyPayload;
}
export interface ClockReplyPayload {
  clientSentAtMs: Clientsentatms;
  probeId: Probeid;
  serverReceivedAtMs: Serverreceivedatms;
  serverSentAtMs: Serversentatms;
}
export interface HeartbeatPing {
  v: V4;
  eventId: Eventid4;
  serverTimeMs: Servertimems4;
  playbackRevision: Playbackrevision5;
  type: Type5;
  payload: PingPayload;
}
export interface PingPayload {
  pingId: Pingid;
}
export interface PresenceChanged {
  v: V5;
  eventId: Eventid5;
  serverTimeMs: Servertimems5;
  playbackRevision: Playbackrevision6;
  type: Type6;
  payload: PresencePayload;
}
export interface PresencePayload {
  presenceSeq: Presenceseq1;
  participants: Participants1;
}
export interface HostChanged {
  v: V6;
  eventId: Eventid6;
  serverTimeMs: Servertimems6;
  playbackRevision: Playbackrevision7;
  type: Type7;
  payload: HostPayload;
}
export interface HostPayload {
  participantId: Participantid;
}
export interface TrackUpdated {
  v: V7;
  eventId: Eventid7;
  serverTimeMs: Servertimems7;
  playbackRevision: Playbackrevision8;
  type: Type8;
  payload: TrackPayload;
}
export interface TrackPayload {
  track: Track;
}
export interface Track {
  id: Id2;
  title: Title1;
  artist: Artist;
  durationMs: Durationms1;
  status: Status2;
  errorCode?: Errorcode;
  mediaVersion?: Mediaversion3;
  coverUrl?: Coverurl;
  sourceUri?: Sourceuri;
  licenseId?: Licenseid;
  licenseUri?: Licenseuri;
}
export interface RoomClosed {
  v: V8;
  eventId: Eventid8;
  serverTimeMs: Servertimems8;
  playbackRevision: Playbackrevision9;
  type: Type9;
  payload: ClosedPayload;
}
export interface ClosedPayload {
  reason: Reason;
}
export interface CommandAck {
  v: V9;
  eventId: Eventid9;
  serverTimeMs: Servertimems9;
  playbackRevision: Playbackrevision10;
  type: Type10;
  payload: AckPayload;
}
export interface AckPayload {
  requestId: Requestid;
  acceptedPlaybackRevision: Acceptedplaybackrevision;
  effectiveAtServerTimeMs?: Effectiveatservertimems1;
}
export interface CommandError {
  v: V10;
  eventId: Eventid10;
  serverTimeMs: Servertimems10;
  playbackRevision: Playbackrevision11;
  type: Type11;
  payload: ErrorPayload;
}
export interface ErrorPayload {
  requestId: Requestid1;
  code: Code;
  message: Message;
  snapshot?: Snapshot | null;
}
export interface ReactionCreated {
  v: V11;
  eventId: Eventid11;
  serverTimeMs: Servertimems11;
  playbackRevision: Playbackrevision12;
  type: Type12;
  payload: ReactionCreatedPayload;
}
export interface ReactionCreatedPayload {
  emoji: Emoji;
  participantId: Participantid1;
}
