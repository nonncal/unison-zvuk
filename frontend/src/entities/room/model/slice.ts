import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ConnectionState, Snapshot } from './types'
export interface RoomState {
  snapshot: Snapshot | null
  participantId: string | null
  connection: ConnectionState
  error: string | null
}
const initialState: RoomState = {
  snapshot: null,
  participantId: null,
  connection: 'idle',
  error: null,
}
const room = createSlice({
  name: 'room',
  initialState,
  reducers: {
    received(state, action: PayloadAction<Snapshot>) {
      const incoming = action.payload
      if (
        state.snapshot?.room.id === incoming.room.id &&
        state.snapshot.playback.epoch === incoming.playback.epoch &&
        incoming.playback.playbackRevision < state.snapshot.playback.playbackRevision
      )
        return
      state.snapshot = incoming
    },
    membership(state, action: PayloadAction<string>) {
      state.participantId = action.payload
    },
    connection(state, action: PayloadAction<ConnectionState>) {
      state.connection = action.payload
    },
    error(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    reset() {
      return initialState
    },
  },
})

export const roomActions = room.actions
export const roomReducer = room.reducer
export const selectRoomState = (state: { room: RoomState }) => state.room
