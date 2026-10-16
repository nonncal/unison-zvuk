import { useSyncExternalStore } from 'react'
export type ThemeChoice = 'system' | 'light' | 'dark'
const KEY = 'unison-theme'
const listeners = new Set<() => void>()
function read(): ThemeChoice {
  try {
    const value = localStorage.getItem(KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* storage can be blocked */
  }
  return 'system'
}
let choice = read()
function paint() {
  const dark =
    choice === 'dark' || (choice === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  const root = document.documentElement
  if (choice === 'system') root.removeAttribute('data-theme')
  else root.dataset.theme = choice
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#14191c' : '#eef1ef')
}
export function setTheme(next: ThemeChoice) {
  choice = next
  try {
    if (next === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, next)
  } catch {
    /* ignore */
  }
  paint()
  listeners.forEach((listener) => listener())
}
export function initTheme() {
  paint()
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (choice === 'system') paint()
  })
}
export const useTheme = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => choice,
    () => 'system' as ThemeChoice,
  )
