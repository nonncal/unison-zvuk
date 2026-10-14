import { test, expect, type Page, type Browser } from '@playwright/test'
interface InstrumentedWindow extends Window {
  __audio?: HTMLMediaElement
  __sockets?: WebSocket[]
}
async function instrument(page: Page) {
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
      }
    }
  })
}
async function create(page: Page) {
  await instrument(page)
  await page.goto('/')
  await expect(page.getByText('Локальная демоверсия', { exact: false })).toHaveCount(0)
  await page.getByRole('button', { name: 'Создать комнату', exact: true }).click()
  await page.getByLabel('Как вас зовут').fill('Кирилл')
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Создать комнату', exact: true })
    .click()
  await expect(page.getByRole('heading', { name: 'Хорошо, когда вместе.' })).toBeVisible()
  await page.getByRole('button', { name: 'Пригласить друга' }).click()
  await expect(page.getByLabel('Ссылка-приглашение')).toHaveValue(/#invite=/)
  const invite = await page.getByLabel('Ссылка-приглашение').inputValue()
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  return invite
}
async function guest(browser: Browser, invite: string) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await instrument(page)
  await page.goto(invite)
  await page.getByLabel('Как вас зовут').fill('Аня')
  await page.getByRole('button', { name: 'Войти и включить звук' }).click()
  await expect(page).toHaveURL(/\/room\//)
  return { ctx, page }
}
async function select(page: Page, title = 'После дождя') {
  await page.getByRole('button', { name: 'Открыть подборку' }).click()
  await page.getByRole('button', { name: `Выбрать ${title}`, exact: true }).click()
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
  await waitReady(page)
}
async function waitReady(page: Page) {
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
async function media(page: Page) {
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
async function close(page: Page) {
  await page.getByRole('button', { name: 'Закрыть комнату для всех' }).first().click()
  await page.getByRole('button', { name: 'Закрыть для всех', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Этот момент завершён.' })).toBeVisible()
}
test.beforeEach(async ({ request }) => {
  const ready = await request.get('/health/ready')
  expect(ready.status(), 'Real backend dependencies must be ready').toBe(200)
})
test('independent sessions play actual S3 audio, pause, seek and transfer host', async ({
  page,
  browser,
}) => {
  const invite = await create(page)
  const g = await guest(browser, invite)
  try {
    await expect(page.getByText('Аня', { exact: true })).toBeVisible()
    await select(page)
    await expect(g.page.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
    await expect.poll(async () => (await media(g.page)).ready).toBeGreaterThanOrEqual(2)
    await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
    await expect.poll(async () => (await media(g.page)).position).toBeGreaterThan(1500)
    expect((await media(g.page)).source).toMatch(/9000.*unison-audio/)
    expect((await media(page)).paused).toBe(false)
    await expect(g.page.getByRole('button', { name: 'Пауза для всех' })).toBeDisabled()
    await page.getByRole('button', { name: 'Пауза для всех' }).click()
    await expect.poll(async () => (await media(g.page)).paused).toBe(true)
    await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
    const slider = page.getByRole('slider', { name: 'Общая позиция композиции' })
    await slider.focus()
    await slider.press('Home')
    await slider.press('ArrowRight')
    await expect.poll(async () => (await media(g.page)).position).toBeLessThan(1000)
    await g.page.getByRole('button', { name: 'Выключить звук у меня' }).click()
    await expect(page.getByRole('button', { name: 'Выключить звук у меня' })).toBeVisible()
    await page.getByRole('button', { name: 'Выйти из комнаты' }).click()
    await expect(g.page.getByRole('button', { name: 'Открыть подборку' })).toBeVisible()
    await close(g.page)
  } finally {
    await g.ctx.close()
  }
})
test('late join, capacity and refresh preserve server membership', async ({ page, browser }) => {
  const invite = await create(page)
  await select(page)
  await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
  await expect.poll(async () => (await media(page)).position).toBeGreaterThan(2200)
  const g = await guest(browser, invite)
  const third = await browser.newContext()
  try {
    await expect.poll(async () => (await media(g.page)).position).toBeGreaterThan(1500)
    const p = await third.newPage()
    await p.goto(invite)
    await expect(p.getByText('Комната уже заполнена. Здесь могут слушать двое.')).toBeVisible()
    await g.page.reload()
    await expect(g.page.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
    await expect(page.getByText('Аня', { exact: true })).toHaveCount(1)
    await close(page)
  } finally {
    await g.ctx.close()
    await third.close()
  }
})
test('new tab replaces same cookie session and stops the old player', async ({ page, context }) => {
  await create(page)
  await select(page)
  const replacement = await context.newPage()
  await instrument(replacement)
  await replacement.goto(page.url())
  await expect(replacement.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
  await expect(page.getByText('Комната открыта в другой вкладке.', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeDisabled()
  await expect.poll(async () => (await media(page)).paused).toBe(true)
  await close(replacement)
})
test('websocket reconnect restores snapshot without replaying old commands', async ({ page }) => {
  await create(page)
  await select(page)
  await page.evaluate(() => (window as InstrumentedWindow).__sockets?.at(-1)?.close())
  await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
  await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
  await expect.poll(async () => (await media(page)).position).toBeGreaterThan(1000)
  await close(page)
})
test('upload passes signed PUT and worker processing before both can listen', async ({
  page,
  browser,
}) => {
  const invite = await create(page)
  const g = await guest(browser, invite)
  try {
    await page.getByRole('button', { name: 'Загрузить файл' }).click()
    await page.getByLabel('Выберите аудиофайл').setInputFiles('public/audio/demo-1.wav')
    await expect(page.getByRole('status')).toContainText('Композиция добавлена', { timeout: 90000 })
    await page.getByRole('button', { name: 'Закрыть окно' }).click()
    await select(page, 'demo-1')
    await expect(g.page.getByRole('heading', { name: 'demo-1', exact: true })).toBeVisible()
    await expect.poll(async () => (await media(g.page)).ready).toBeGreaterThanOrEqual(2)
    await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
    await expect.poll(async () => (await media(g.page)).position).toBeGreaterThan(1000)
    await close(page)
  } finally {
    await g.ctx.close()
  }
})
