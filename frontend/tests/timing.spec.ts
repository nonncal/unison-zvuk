import { test, expect } from '@playwright/test'
import { create, guest, select, media, close, type InstrumentedWindow } from './api-support'
test.use({ trace: 'off' })
test.describe('group timing', () => {
  test('ten independent sessions play together and share pause', async ({
    page,
    browser,
  }, info) => {
    test.setTimeout(180000)
    const invite = await create(page)
    await page.getByRole('button', { name: 'Настройки комнаты' }).click()
    await page.getByLabel('Максимум участников').selectOption('10')
    await page.getByRole('button', { name: 'Сохранить настройки', exact: true }).click()
    const guests: Awaited<ReturnType<typeof guest>>[] = []
    try {
      for (let i = 0; i < 9; i++)
        guests.push(await guest(browser, invite, `Слушатель ${i + 1}`, true))
      await select(page)
      await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
      const pages = [page, ...guests.map((g) => g.page)]
      await expect
        .poll(async () =>
          (await Promise.all(pages.map(media))).every((m) => !m.paused && m.position > 1500),
        )
        .toBe(true)
      const spreads: number[] = []
      const diagnostics: unknown[] = []
      for (let i = 0; i < 20; i++) {
        const anchors = await Promise.all(
          pages.map((p) =>
            p.evaluate(() => {
              const a = (window as InstrumentedWindow).__audio!
              return {
                anchor: performance.timeOrigin + performance.now() - a.currentTime * 1000,
                wall: Date.now(),
                perf: performance.timeOrigin + performance.now(),
                clock: (window as InstrumentedWindow).__clock,
                position: a.currentTime * 1000,
                target: Number(
                  document.querySelector<HTMLInputElement>(
                    'input[aria-label="Общая позиция композиции"]',
                  )?.value,
                ),
                rate: a.playbackRate,
                seeking: a.seeking,
                ready: a.readyState,
              }
            }),
          ),
        )
        spreads.push(
          Math.max(...anchors.map((a) => a.anchor)) - Math.min(...anchors.map((a) => a.anchor)),
        )
        diagnostics.push(anchors)
        await page.waitForTimeout(250)
      }
      const sorted = [...spreads].sort((a, b) => a - b)
      const report = {
        clients: 10,
        samples: spreads.length,
        p95PositionSpreadMs: sorted[Math.ceil(sorted.length * 0.95) - 1],
        maxPositionSpreadMs: Math.max(...spreads),
        note: 'Browser media positions on one computer; not acoustic device latency.',
      }
      console.log('SYNC_REPORT', JSON.stringify(report))
      console.log('SYNC_EDGES', JSON.stringify([diagnostics[0], diagnostics.at(-1)]))
      await info.attach('sync-samples', {
        body: JSON.stringify(diagnostics),
        contentType: 'application/json',
      })
      await info.attach('sync-position-report', {
        body: JSON.stringify(report, null, 2),
        contentType: 'application/json',
      })
      expect(report.p95PositionSpreadMs).toBeLessThan(300)
      await page.getByRole('button', { name: 'Пауза для всех' }).click()
      await expect
        .poll(async () => (await Promise.all(pages.map(media))).every((m) => m.paused))
        .toBe(true)
      await close(page)
    } finally {
      await Promise.all(guests.map((g) => g.ctx.close()))
    }
  })
})
