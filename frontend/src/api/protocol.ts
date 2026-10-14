import { parse } from 'lossless-json'
import type { ClientCommand } from './generated/client-command-v1'
import type { ServerEvent } from './generated/server-event-v1'
import type { HTTPModels } from './generated/http-models'
import * as validators from './generated/validators.js'

export class ProtocolError extends Error {
  constructor() {
    super('Получено сообщение с неверным форматом')
    this.name = 'ProtocolError'
  }
}

function json(raw: string, maxBytes: number): unknown {
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new ProtocolError()
  try {
    return parse(raw, undefined, {
      parseNumber: (value) => {
        const number = Number(value)
        if (!/^-?(0|[1-9]\d*)$/.test(value) || !Number.isSafeInteger(number)) throw new ProtocolError()
        return number
      },
    })
  } catch {
    throw new ProtocolError()
  }
}

export function parseCommand(raw: string): ClientCommand {
  const data = json(raw, 16_384)
  if (!validators.validateCommand(data)) throw new ProtocolError()
  return data as ClientCommand
}

export function parseEvent(raw: string): ServerEvent {
  const data = json(raw, 16_384)
  if (!validators.validateEvent(data)) throw new ProtocolError()
  return data as ServerEvent
}

export function parseHTTP<K extends keyof HTTPModels>(name: K, raw: string): HTTPModels[K] {
  const inputs = ['CreateRoom', 'PreviewInvite', 'JoinRoom', 'CloseRoom', 'ReserveUpload', 'CompleteUpload']
  const data = json(raw, inputs.includes(name) ? 65_536 : 1_048_576)
  if (name === 'CreateRoom' || name === 'JoinRoom' || name === 'ReserveUpload') {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) throw new ProtocolError()
    const fields = data as Record<string, unknown>
    for (const field of ['displayName', 'title', 'fileName']) {
      const value = fields[field]
      if (typeof value === 'string') {
        if (/[\p{Cc}\p{Cf}\p{Cs}]/u.test(value) || value.trim().length === 0) throw new ProtocolError()
        fields[field] = value.trim()
      }
    }
    if (name === 'ReserveUpload') {
      const filename = String(fields.fileName)
      const types: Record<string, string[]> = { mp3: ['audio/mpeg'], wav: ['audio/wav', 'audio/x-wav'], m4a: ['audio/mp4', 'audio/x-m4a'] }
      const extension = filename.split('.').at(-1)?.toLowerCase() ?? ''
      if (/[\\/]/.test(filename) || !types[extension]?.includes(String(fields.contentType))) throw new ProtocolError()
    }
  }
  const validator = validators[`http${name}`]
  if (!validator(data)) throw new ProtocolError()
  return data as HTTPModels[K]
}
