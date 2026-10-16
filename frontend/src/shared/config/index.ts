export const appMode = import.meta.env.VITE_APP_MODE === 'demo' ? 'demo' : 'api'
export const apiOrigin = (import.meta.env.VITE_API_ORIGIN ?? '').replace(/\/$/, '')
