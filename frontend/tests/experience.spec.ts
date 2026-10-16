import { test, expect } from '@playwright/test'
import { create, guest } from './api-support'
test.beforeEach(async ({ request }) =>
  expect((await request.get('/health/ready')).status()).toBe(200),
)
test('host is notified about a new listener and can return to the open room from home', async ({
  page,
  browser,
}) => {
  const invite = await create(page)
  const roomUrl = page.url()
  const g = await guest(browser, invite, 'Аня')
  try {
    await expect(page.getByText('Аня в комнате')).toBeVisible()
    await page.getByRole('link', { name: 'Unison — на главную' }).click()
    await expect(page.getByRole('heading', { name: 'Ваша комната уже открыта' })).toBeVisible()
    await page.getByRole('link', { name: /Вернуться/ }).click()
    await expect(page).toHaveURL(roomUrl)
  } finally {
    await g.ctx.close()
  }
})
test('theme choice is applied, remembered and can follow the system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  const root = page.locator('html')
  await expect(root).not.toHaveAttribute('data-theme', /.+/)
  await page.getByRole('button', { name: 'Тёмная тема' }).click()
  await expect(root).toHaveAttribute('data-theme', 'dark')
  const ground = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(await ground()).toBe('rgb(14, 16, 22)')
  await page.reload()
  await expect(root).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Как в системе' }).click()
  await expect(root).not.toHaveAttribute('data-theme', /.+/)
  expect(await ground()).toBe('rgb(238, 240, 244)')
})
test('a queue track is grabbed and dropped anywhere, by pointer and by keyboard', async ({
  page,
}) => {
  await create(page)
  const titles = () => page.locator('.queue-list .queue-track strong').allInnerTexts()
  await expect.poll(async () => (await titles()).length).toBeGreaterThan(3)
  // Rows settle once covers and titles have loaded.
  await expect(page.locator('.queue-list li')).toHaveCount(9)
  await page.waitForTimeout(1000)
  const before = await titles()
  const rows = page.locator('.queue-list li')
  const from = (await rows.nth(0).boundingBox())!,
    to = (await rows.nth(3).boundingBox())!
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2 + 30, { steps: 4 })
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2 + 8, { steps: 10 })
  await page.mouse.up()
  const expected = [...before.slice(1, 4), before[0], ...before.slice(4)]
  await expect.poll(titles).toEqual(expected)
  await page.reload()
  await expect.poll(titles).toEqual(expected)
  const grip = page.locator('.queue-grip').nth(3)
  await expect(grip).toBeEnabled()
  await grip.focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Space')
  const keyed = [...expected]
  keyed.splice(1, 0, keyed.splice(3, 1)[0])
  await expect.poll(titles).toEqual(keyed)
})
test('clicking a song in the queue starts it for the room', async ({ page }) => {
  await create(page)
  await expect(page.locator('.queue-list li')).toHaveCount(9)
  await page.waitForTimeout(800)
  await page.locator('.queue-track', { hasText: 'К Элизе' }).click()
  await expect(page.getByRole('heading', { name: 'К Элизе', exact: true })).toBeVisible()
  await expect(page.locator('.queue-list li.queue-current')).toContainText('К Элизе')
})
test('listener dots sit on the seek line next to the playhead', async ({ page }) => {
  await create(page)
  await page.getByRole('button', { name: 'Открыть подборку' }).click()
  await page.getByRole('button', { name: 'Выбрать К Элизе', exact: true }).click()
  const track = page.locator('input[type="range"][aria-label="Общая позиция композиции"]')
  const dot = page.locator('.sync-mark').first()
  await expect(dot).toBeVisible()
  const [t, d] = [(await track.boundingBox())!, (await dot.boundingBox())!]
  expect(Math.abs(d.y + d.height / 2 - (t.y + t.height / 2))).toBeLessThan(2)
})
