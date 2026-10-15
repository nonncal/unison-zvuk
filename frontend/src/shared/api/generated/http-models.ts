import type { Bootstrap, CreateRoom, CreateRoomResult, PreviewInvite, PreviewResult, JoinRoom, JoinRoomResult, CloseRoom, Snapshot, InviteResult, ReserveUpload, ReserveUploadResult, CompleteUpload, CompleteUploadResult, Track, TrackList, PlaybackURL, HTTPError, RoomSettings, EditorPermission, PlayerAction, AdmissionStatus, EntryResult, WaitingList, AdmissionDecision, MyRooms, MemberAction } from './http-v1'

export interface HTTPModels {
  Bootstrap: Bootstrap
  CreateRoom: CreateRoom
  CreateRoomResult: CreateRoomResult
  PreviewInvite: PreviewInvite
  PreviewResult: PreviewResult
  JoinRoom: JoinRoom
  JoinRoomResult: JoinRoomResult
  CloseRoom: CloseRoom
  Snapshot: Snapshot
  InviteResult: InviteResult
  ReserveUpload: ReserveUpload
  ReserveUploadResult: ReserveUploadResult
  CompleteUpload: CompleteUpload
  CompleteUploadResult: CompleteUploadResult
  Track: Track
  TrackList: TrackList
  PlaybackURL: PlaybackURL
  HTTPError: HTTPError
  RoomSettings: RoomSettings
  EditorPermission: EditorPermission
  PlayerAction: PlayerAction
  AdmissionStatus: AdmissionStatus
  EntryResult: EntryResult
  WaitingList: WaitingList
  AdmissionDecision: AdmissionDecision
  MyRooms: MyRooms
  MemberAction: MemberAction
}
