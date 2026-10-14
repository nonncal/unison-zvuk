import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AudioState } from '@/entities/room'
function savedVolume() {
  try {
    const value = Number(localStorage.getItem('unison:volume') ?? '0.65')
    return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.65
  } catch {
    return 0.65
  }
}
const audio = createSlice({
  name: 'audio',
  initialState: {
    state: 'locked' as AudioState,
    positionMs: 0,
    volume: savedVolume(),
    muted: false,
  },
  reducers: {
    state(state, action: PayloadAction<AudioState>) {
      state.state = action.payload
    },
    position(state, action: PayloadAction<number>) {
      state.positionMs = action.payload
    },
    volume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(1, action.payload))
      state.muted = false
    },
    mute(state) {
      state.muted = !state.muted
    },
  },
})

export const audioActions = audio.actions
export const audioReducer = audio.reducer
export const selectAudioState = (state: { audio: ReturnType<typeof audioReducer> }) => state.audio
