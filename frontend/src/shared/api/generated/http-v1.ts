/* Types from the versioned JSON Schema. */

export type HTTPMessage =
  | Bootstrap
  | CreateRoom
  | CreateRoomResult
  | PreviewInvite
  | PreviewResult
  | JoinRoom
  | JoinRoomResult
  | CloseRoom
  | Snapshot
  | InviteResult
  | ReserveUpload
  | ReserveUploadResult
  | CompleteUpload
  | CompleteUploadResult
  | Track
  | TrackList
  | PlaybackURL
  | HTTPError
  | RoomSettings
  | EditorPermission
  | PlayerAction
  | AdmissionStatus
  | EntryResult
  | WaitingList
  | AdmissionDecision
  | MyRooms
  | MemberAction;
export type Csrftoken = string;
export type Protocolversion = 1;
export type Displayname = string;
export type Title = string;
export type Capacity = number;
export type Moderated = boolean;
export type Roomid = string;
export type Participantid = string;
export type Inviteurl = string;
export type Expiresat = number;
export type Id = string;
export type Title1 = string;
export type Status = "active" | "closed" | "expired";
export type Capacity1 = number;
export type Expiresat1 = number;
export type Hostparticipantid = string | null;
export type Moderated1 = boolean;
export type Id1 = string;
export type Displayname1 = string;
export type Role = "host" | "listener";
export type Connectionstate = "online" | "offline" | "connecting";
export type Trackid = string;
export type Mediaversion = string;
export type State = "loading" | "ready" | "buffering" | "autoplayBlocked" | "error";
export type Bufferedaheadms = number;
export type Autoplayallowed = boolean;
export type Canedit = boolean;
export type Participants = Participant[];
export type Roomid1 = string;
export type Epoch = string;
export type Trackid1 = string | null;
export type Mediaversion1 = string | null;
export type Status1 = "empty" | "paused" | "playing" | "ended";
export type Positionms = number;
export type Anchorservertimems = number;
export type Durationms = number;
export type Type = "play" | "pause" | "seek";
export type Nextstatus = "paused" | "playing" | "ended";
export type Positionms1 = number;
export type Effectiveatservertimems = number;
export type Trackid2 = string | null;
export type Mediaversion2 = string | null;
export type Presenceseq = number;
export type Playbackrevision = number;
export type Nexttrackid = string | null;
/**
 * @maxItems 20
 */
export type Suggestions =
  | []
  | [TrackSuggestion]
  | [TrackSuggestion, TrackSuggestion]
  | [TrackSuggestion, TrackSuggestion, TrackSuggestion]
  | [TrackSuggestion, TrackSuggestion, TrackSuggestion, TrackSuggestion]
  | [TrackSuggestion, TrackSuggestion, TrackSuggestion, TrackSuggestion, TrackSuggestion]
  | [TrackSuggestion, TrackSuggestion, TrackSuggestion, TrackSuggestion, TrackSuggestion, TrackSuggestion]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ]
  | [
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion,
      TrackSuggestion
    ];
export type Id2 = string;
export type Trackid3 = string;
export type Participantid1 = string;
export type Displayname2 = string;
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
export type Invitetoken = string;
export type Moderated2 = boolean;
export type Roomid2 = string;
export type Title2 = string;
export type Status2 = "active" | "closed" | "expired";
export type Participantcount = number;
export type Capacity2 = number;
export type Expiresat2 = number;
export type Invitetoken1 = string;
export type Displayname3 = string;
export type Participantid2 = string;
export type Role1 = "host" | "listener";
export type Expectedplaybackrevision = number;
export type Inviteurl1 = string;
export type Expiresat3 = number;
export type Filename = string;
export type Contenttype = "audio/mpeg" | "audio/wav" | "audio/x-wav" | "audio/mp4" | "audio/x-m4a";
export type Sizebytes = number;
export type Uploadid = string;
export type Uploadurl = string;
export type Expiresat4 = number;
export type Checksum = string | null;
export type Trackid4 = string;
export type Status3 = "processing";
export type Id3 = string;
export type Title3 = string;
export type Artist = string;
export type Durationms1 = number | null;
export type Status4 = "uploading" | "processing" | "ready" | "failed";
export type Errorcode = string | null;
export type Mediaversion3 = string | null;
export type Coverurl = string | null;
export type Sourceuri = string | null;
export type Licenseid = string | null;
export type Licenseuri = string | null;
export type Items = Track[];
export type Nextcursor = string | null;
export type Url = string;
export type Expiresat5 = number;
export type Mediaversion4 = string;
export type Checksum1 = string;
export type Contenttype1 = string;
export type Code = string;
export type Message = string;
export type Requestid = string;
export type Details = ValidationDetail[] | ConflictDetail | null;
export type Field = string;
export type Code1 = string;
export type Capacity3 = number;
export type Moderated3 = boolean;
export type Canedit1 = boolean;
export type Expectedplaybackrevision1 = number;
export type Action = "next" | "previous" | "add" | "remove" | "move" | "options";
export type Trackid5 = string | null;
export type Toindex = number | null;
export type Repeat1 = ("off" | "all" | "one") | null;
export type Shuffle1 = boolean | null;
export type Status5 = "pending" | "approved" | "admitted" | "rejected" | "cancelled" | "expired" | "none";
export type Status6 = "pending" | "approved" | "admitted" | "rejected" | "cancelled" | "expired" | "none";
export type Id4 = string;
export type Displayname4 = string;
export type Requestedat = number;
export type Items1 = WaitingGuest[];
export type Admit = boolean;
export type Id5 = string;
export type Title4 = string;
export type Capacity4 = number;
export type Role2 = "host" | "listener";
export type Items2 = MyRoom[];
export type Action1 = "transfer" | "remove";

export interface Bootstrap {
  csrfToken: Csrftoken;
  protocolVersion?: Protocolversion;
  limits: Limits;
}
export interface Limits {
  [k: string]: number;
}
export interface CreateRoom {
  displayName: Displayname;
  title?: Title;
  capacity?: Capacity;
  moderated?: Moderated;
}
export interface CreateRoomResult {
  roomId: Roomid;
  participantId: Participantid;
  inviteUrl: Inviteurl;
  expiresAt: Expiresat;
  snapshot: Snapshot;
}
export interface Snapshot {
  room: Room;
  participants: Participants;
  playback: Playback;
  presenceSeq: Presenceseq;
  playbackRevision: Playbackrevision;
  playlist?: Playlist;
}
export interface Room {
  id: Id;
  title: Title1;
  status: Status;
  capacity: Capacity1;
  expiresAt: Expiresat1;
  hostParticipantId: Hostparticipantid;
  moderated?: Moderated1;
}
export interface Participant {
  id: Id1;
  displayName: Displayname1;
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
  roomId: Roomid1;
  epoch: Epoch;
  trackId: Trackid1;
  mediaVersion: Mediaversion1;
  status: Status1;
  positionMs: Positionms;
  anchorServerTimeMs: Anchorservertimems;
  durationMs: Durationms;
  pendingTransition: PendingTransition | null;
}
export interface PendingTransition {
  type: Type;
  nextStatus: Nextstatus;
  positionMs: Positionms1;
  effectiveAtServerTimeMs: Effectiveatservertimems;
  trackId?: Trackid2;
  mediaVersion?: Mediaversion2;
}
export interface Playlist {
  nextTrackId?: Nexttrackid;
  suggestions?: Suggestions;
  trackIds?: Trackids;
  skippedTrackIds?: Skippedtrackids;
  repeat?: Repeat;
  shuffle?: Shuffle;
}
export interface TrackSuggestion {
  id: Id2;
  trackId: Trackid3;
  participantId: Participantid1;
  displayName: Displayname2;
}
export interface PreviewInvite {
  inviteToken: Invitetoken;
}
export interface PreviewResult {
  moderated?: Moderated2;
  roomId: Roomid2;
  title: Title2;
  status: Status2;
  participantCount: Participantcount;
  capacity: Capacity2;
  expiresAt: Expiresat2;
}
export interface JoinRoom {
  inviteToken: Invitetoken1;
  displayName: Displayname3;
}
export interface JoinRoomResult {
  participantId: Participantid2;
  role: Role1;
  snapshot: Snapshot;
}
export interface CloseRoom {
  expectedPlaybackRevision: Expectedplaybackrevision;
}
export interface InviteResult {
  inviteUrl: Inviteurl1;
  expiresAt: Expiresat3;
}
export interface ReserveUpload {
  fileName: Filename;
  contentType: Contenttype;
  sizeBytes: Sizebytes;
}
export interface ReserveUploadResult {
  uploadId: Uploadid;
  uploadUrl: Uploadurl;
  requiredHeaders: Requiredheaders;
  expiresAt: Expiresat4;
}
export interface Requiredheaders {
  [k: string]: string;
}
export interface CompleteUpload {
  checksum?: Checksum;
}
export interface CompleteUploadResult {
  trackId: Trackid4;
  status?: Status3;
}
export interface Track {
  id: Id3;
  title: Title3;
  artist: Artist;
  durationMs: Durationms1;
  status: Status4;
  errorCode?: Errorcode;
  mediaVersion?: Mediaversion3;
  coverUrl?: Coverurl;
  sourceUri?: Sourceuri;
  licenseId?: Licenseid;
  licenseUri?: Licenseuri;
}
export interface TrackList {
  items: Items;
  nextCursor?: Nextcursor;
}
export interface PlaybackURL {
  url: Url;
  expiresAt: Expiresat5;
  mediaVersion: Mediaversion4;
  checksum: Checksum1;
  contentType: Contenttype1;
}
export interface HTTPError {
  error: ErrorBody;
}
export interface ErrorBody {
  code: Code;
  message: Message;
  requestId: Requestid;
  details?: Details;
}
export interface ValidationDetail {
  field: Field;
  code: Code1;
}
export interface ConflictDetail {
  snapshot: Snapshot;
}
export interface RoomSettings {
  capacity: Capacity3;
  moderated: Moderated3;
}
export interface EditorPermission {
  canEdit: Canedit1;
}
export interface PlayerAction {
  expectedPlaybackRevision: Expectedplaybackrevision1;
  action: Action;
  trackId?: Trackid5;
  toIndex?: Toindex;
  repeat?: Repeat1;
  shuffle?: Shuffle1;
}
export interface AdmissionStatus {
  status: Status5;
}
export interface EntryResult {
  status: Status6;
  membership?: JoinRoomResult | null;
}
export interface WaitingList {
  items: Items1;
}
export interface WaitingGuest {
  id: Id4;
  displayName: Displayname4;
  requestedAt: Requestedat;
}
export interface AdmissionDecision {
  admit: Admit;
}
export interface MyRooms {
  items: Items2;
}
export interface MyRoom {
  id: Id5;
  title: Title4;
  capacity: Capacity4;
  role: Role2;
}
export interface MemberAction {
  action: Action1;
}
