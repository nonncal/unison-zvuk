import { expect, type Page, type Browser } from '@playwright/test'
import { observePreparedAudio } from './audio-observation'
export interface InstrumentedWindow extends Window {
  __audio?: Pick<
    HTMLMediaElement,
    'currentTime' | 'paused' | 'readyState' | 'src' | 'playbackRate' | 'seeking'
  >
  __sockets?: WebSocket[]
  __clock?: unknown[]
}
export async function instrument(page: Page) {
  await page.addInitScript(observePreparedAudio)
  await page.addInitScript(() => {
    const w = window as InstrumentedWindow
    const play = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function () {
      w.__audio = this
      return play.call(this)
    }
    const NativeSocket = window.WebSocket
    w.__sockets = []
    window.WebSocket = class extends NativeSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols)
        w.__sockets!.push(this)
        w.__clock = []
        this.addEventListener('message', (event) => {
          const m = JSON.parse(event.data)
          if (m.type === 'clock.reply')
            w.__clock!.push({
              ...m.payload,
              received: Date.now(),
              perfEpoch: performance.timeOrigin + performance.now(),
            })
        })
      }
    }
  })
}
export async function create(page: Page) {
  await instrument(page)
  await page.goto('/')
  await expect(page.getByText('Локальная демоверсия', { exact: false })).toHaveCount(0)
  await page.getByRole('button', { name: 'Создать комнату', exact: true }).click()
  await page.getByLabel('Как вас зовут').fill('Кирилл')
  for (let attempt = 0; attempt < 2; attempt++) {
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => new URL(r.url()).pathname === '/api/v1/rooms' && r.request().method() === 'POST',
      ),
      page
        .getByRole('dialog')
        .getByRole('button', { name: 'Создать комнату', exact: true })
        .click(),
    ])
    if (response.status() === 429 && attempt === 0) {
      await page.waitForTimeout(
        Math.min(60, Number(response.headers()['retry-after']) || 60) * 1000,
      )
      continue
    }
    expect(response.status()).toBe(201)
    break
  }
  await expect(page.getByRole('button', { name: 'Сменить комнату' })).toBeVisible()
  await page.getByRole('button', { name: 'Пригласить друга' }).click()
  await expect(page.getByLabel('Ссылка-приглашение')).toHaveValue(/#invite=/)
  const invite = await page.getByLabel('Ссылка-приглашение').inputValue()
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  return invite
}
export async function guest(browser: Browser, invite: string, name = 'Аня', compact = false) {
  const ctx = await browser.newContext(compact ? { viewport: { width: 800, height: 600 } } : {})
  const page = await ctx.newPage()
  await instrument(page)
  await page.goto(invite)
  await page.getByLabel('Как вас зовут').fill(name)
  await page.getByRole('button', { name: 'Войти и включить звук' }).click()
  await expect(page).toHaveURL(/\/room\//)
  return { ctx, page }
}
export async function select(page: Page, title = 'К Элизе') {
  await page.getByRole('button', { name: 'Открыть подборку' }).click()
  await page.getByRole('button', { name: `Выбрать ${title}`, exact: true }).click()
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
  await waitReady(page)
}
export async function waitReady(page: Page) {
  const roomId = new URL(page.url()).pathname.split('/').at(-1)
  await expect
    .poll(async () => {
      const response = await page.request.get(`/api/v1/rooms/${roomId}`)
      const snapshot = await response.json()
      return snapshot.participants.every(
        (p: {
          connectionState: string
          readiness: { state: string; bufferedAheadMs: number; autoplayAllowed: boolean } | null
        }) =>
          p.connectionState === 'online' &&
          p.readiness?.state === 'ready' &&
          p.readiness.autoplayAllowed &&
          p.readiness.bufferedAheadMs >= 3000,
      )
    })
    .toBe(true)
}
export async function media(page: Page) {
  return page.evaluate(() => {
    const a = (window as InstrumentedWindow).__audio
    return {
      position: (a?.currentTime ?? 0) * 1000,
      paused: a?.paused,
      ready: a?.readyState ?? 0,
      source: a?.src ?? '',
    }
  })
}
export async function close(page: Page) {
  await page.getByRole('button', { name: 'Закрыть комнату для всех' }).first().click()
  await page.getByRole('button', { name: 'Закрыть для всех', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Комната закрыта.' })).toBeVisible()
}
