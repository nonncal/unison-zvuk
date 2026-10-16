import { request, requestModel, type HTTPModels } from '@/shared/api'
import { normalizeSnapshot } from './normalize-snapshot'
export const roomApi = {
  async suggest(roomId: string, trackId: string) {
    return normalizeSnapshot(
      await requestModel('Snapshot', `/rooms/${roomId}/suggestions`, {
        method: 'POST',
        body: JSON.stringify({ trackId }),
      }),
    )
  },
  async decideSuggestion(roomId: string, id: string, accept: boolean) {
    return normalizeSnapshot(
      await requestModel('Snapshot', `/rooms/${roomId}/suggestions/${id}`, {
        method: 'POST',
        body: JSON.stringify({ accept }),
      }),
    )
  },
  async memberAction(roomId: string, id: string, action: 'transfer' | 'remove') {
    return normalizeSnapshot(
      await requestModel('Snapshot', `/rooms/${roomId}/participants/${id}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),
    )
  },
  rotate: (roomId: string) =>
    requestModel('InviteResult', `/rooms/${roomId}/invite/rotate`, { method: 'POST', body: '{}' }),
  async player(roomId: string, payload: HTTPModels['PlayerAction']) {
    return normalizeSnapshot(
      await requestModel('Snapshot', `/rooms/${roomId}/player`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    )
  },
  async settings(roomId: string, payload: HTTPModels['RoomSettings']) {
    return normalizeSnapshot(
      await requestModel('Snapshot', `/rooms/${roomId}/settings`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    )
  },
  async permission(roomId: string, participantId: string, canEdit: boolean) {
    return normalizeSnapshot(
      await requestModel('Snapshot', `/rooms/${roomId}/participants/${participantId}/permission`, {
        method: 'PATCH',
        body: JSON.stringify({ canEdit }),
      }),
    )
  },
  mine: () => requestModel('MyRooms', '/rooms'),
  waiting: (roomId: string) => requestModel('WaitingList', `/rooms/${roomId}/waiting`),
  decide: (roomId: string, id: string, admit: boolean) =>
    requestModel('WaitingList', `/rooms/${roomId}/waiting/${id}`, {
      method: 'POST',
      body: JSON.stringify({ admit }),
    }),
  admission: (roomId: string) => requestModel('AdmissionStatus', `/rooms/${roomId}/admission`),
  cancelAdmission: (roomId: string) => request(`/rooms/${roomId}/admission`, { method: 'DELETE' }),
  cover: (roomId: string, trackId: string, file: File) =>
    request(`/rooms/${roomId}/tracks/${trackId}/cover`, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    }),
}
export type PlayerAction = HTTPModels['PlayerAction']
