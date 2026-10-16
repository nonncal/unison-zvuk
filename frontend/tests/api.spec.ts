import { test, expect } from '@playwright/test'
import {
  create,
  guest,
  select,
  media,
  close,
  instrument,
  type InstrumentedWindow,
} from './api-support'
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
    expect(new URL((await media(g.page)).source).pathname).toMatch(/^\/unison-audio\//)
    await expect.poll(async () => (await media(page)).paused).toBe(false)
    await expect(g.page.getByRole('button', { name: 'Пауза для всех' })).toBeDisabled()
    await page.getByRole('button', { name: 'Пауза для всех' }).click()
    await expect.poll(async () => (await media(g.page)).paused).toBe(true)
    await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
    const slider = page.getByRole('slider', { name: 'Общая позиция композиции' })
    await slider.focus()
    await slider.press('Home')
    await slider.press('ArrowRight')
    await expect.poll(async () => (await media(g.page)).position).toBeLessThanOrEqual(1000)
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
    await expect(page.getByRole('dialog').getByRole('status')).toContainText(
      'Композиция добавлена',
      { timeout: 90000 },
    )
    await page.getByRole('button', { name: 'Закрыть окно' }).click()
    await select(page, 'demo-1')
    await expect(g.page.getByRole('heading', { name: 'demo-1', exact: true })).toBeVisible()
    await page.getByLabel('Файл обложки').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64',
      ),
    })
    for (const listener of [page, g.page]) {
      const cover = listener.getByRole('img', { name: 'Обложка: demo-1' })
      await expect(cover).toHaveAttribute('src', /cover\?v=1$/)
      await expect
        .poll(() => cover.evaluate((e) => (e as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0)
    }
    await expect.poll(async () => (await media(g.page)).ready).toBeGreaterThanOrEqual(2)
    await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
    await expect.poll(async () => (await media(g.page)).position).toBeGreaterThan(1000)
    const startingPosition = (await media(g.page)).position
    await expect
      .poll(async () => (await media(g.page)).position)
      .toBeGreaterThan(startingPosition + 5000)
    expect((await media(g.page)).paused).toBe(false)
    await close(page)
  } finally {
    await g.ctx.close()
  }
})

for (const format of ['mp3', 'm4a'])
  test(`embedded ${format} artwork reaches both listeners without a manual cover upload`, async ({
    page,
    browser,
  }) => {
    const invite = await create(page)
    const g = await guest(browser, invite)
    try {
      await page.getByRole('button', { name: 'Загрузить файл' }).click()
      await page
        .getByLabel('Выберите аудиофайл')
        .setInputFiles(`tests/fixtures/embedded-cover.${format}`)
      await expect(page.getByRole('dialog').getByRole('status')).toContainText(
        'Композиция добавлена',
        { timeout: 90000 },
      )
      await page.getByRole('button', { name: 'Закрыть окно' }).click()
      await select(page, 'Embedded cover test')
      for (const listener of [page, g.page]) {
        const cover = listener.getByRole('img', { name: 'Обложка: Embedded cover test' })
        await expect(cover).toHaveAttribute('src', /cover\?v=1$/)
        await expect
          .poll(() => cover.evaluate((e) => (e as HTMLImageElement).naturalWidth))
          .toBe(512)
        const src = await cover.getAttribute('src')
        expect((await listener.request.get(src!)).headers()['content-type']).toContain('image/webp')
      }
      await close(page)
    } finally {
      await g.ctx.close()
    }
  })
