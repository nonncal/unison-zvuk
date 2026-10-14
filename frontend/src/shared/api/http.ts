import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { AppError } from '@/shared/lib/errors'
import { apiOrigin } from '@/shared/config'
import { parseHTTP } from './protocol'
import type { HTTPModels } from './generated/http-models'
let csrfToken: string | null = null
let bootstrapPromise: Promise<void> | null = null
export async function request<T>(
  path: string,
  init: RequestInit = {},
  schema?: keyof HTTPModels,
): Promise<T> {
  if (init.method && !['GET', 'HEAD'].includes(init.method) && !csrfToken) {
    bootstrapPromise ??= fetch(`${apiOrigin}/api/v1/bootstrap`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Сервер недоступен. Проверьте соединение.')
        const data = parseHTTP('Bootstrap', await response.text())
        csrfToken = data.csrfToken
      })
      .catch((error) => {
        bootstrapPromise = null
        throw error
      })
    await bootstrapPromise
  }
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken)
  let response: Response
  try {
    response = await fetch(`${apiOrigin}/api/v1${path}`, {
      ...init,
      headers,
      credentials: 'include',
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new Error('Не удалось связаться с сервером. Проверьте соединение и попробуйте снова.', {
      cause: error,
    })
  }
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: { code: string; message: string }
    }
    throw new AppError(
      data.error?.code ?? 'HTTP_ERROR',
      data.error?.message ?? 'Не удалось выполнить запрос. Попробуйте снова.',
    )
  }
  if (response.status === 204) return undefined as T
  const raw = await response.text()
  return (schema ? parseHTTP(schema, raw) : JSON.parse(raw)) as T
}

export async function requestModel<K extends keyof HTTPModels>(
  name: K,
  path: string,
  init: RequestInit = {},
): Promise<HTTPModels[K]> {
  return request<HTTPModels[K]>(path, init, name)
}
export const baseApi = createApi({
  reducerPath: 'httpApi',
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ['RoomTracks'],
  endpoints: () => ({}),
})
