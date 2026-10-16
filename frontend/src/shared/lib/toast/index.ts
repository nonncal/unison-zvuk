import { useSyncExternalStore } from 'react'
export interface ToastAction {
  label: string
  run: () => void | Promise<void>
}
export interface Toast {
  key: string
  title: string
  text?: string
  tone?: number
  actions?: ToastAction[]
  /** Milliseconds before it leaves on its own; 0 keeps it until dismissed. */
  ttl: number
}
type Input = Omit<Toast, 'ttl' | 'key'> & { key?: string; ttl?: number }
let items: Toast[] = []
let seq = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())
export const toast = {
  show(input: Input) {
    const key = input.key ?? `t${++seq}`,
      next: Toast = { ...input, key, ttl: input.ttl ?? 6000 }
    items = [...items.filter((item) => item.key !== key), next].slice(-4)
    emit()
    return key
  },
  dismiss(key: string) {
    if (!items.some((item) => item.key === key)) return
    items = items.filter((item) => item.key !== key)
    emit()
  },
  clear() {
    items = []
    emit()
  },
}
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export const useToasts = () =>
  useSyncExternalStore(
    subscribe,
    () => items,
    () => items,
  )
