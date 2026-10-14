import { configureStore } from '@reduxjs/toolkit'
import { roomReducer } from '@/entities/room'
import { audioReducer } from '@/features/listen-together'
import { baseApi } from '@/shared/api'
export const store = configureStore({
  reducer: { room: roomReducer, audio: audioReducer, [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
