import { test, expect, type Page } from '@playwright/test'
import { create, select } from './api-support'
test.beforeEach(async ({ request }) =>
  expect((await request.get('/health/ready')).status()).toBe(200),
)
const panel = (page: Page) => page.getByRole('region', { name: 'Текст песни' })
async function addToRoomAndSelect(page: Page, title: string) {
  await select(page, title)
}
test('timestamped lyrics from an .lrc file follow the shared playback position', async ({
  page,
}) => {
  await create(page)
  await addToRoomAndSelect(page, 'Тихая ночь (Silent Night)')
  await expect(panel(page)).toContainText('Текст из файла .lrc')
  await expect(panel(page).locator('li')).toHaveCount(18)
  await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
  await expect(panel(page).locator('li[aria-current="true"]')).toContainText('Silent night', {
    timeout: 15000,
  })
  await expect(panel(page).locator('li[aria-current="true"]')).toContainText('All is calm', {
    timeout: 15000,
  })
})
test('plain lyrics without timestamps are shown as a whole', async ({ page }) => {
  await create(page)
  await addToRoomAndSelect(page, 'Старое доброе время (Auld Lang Syne)')
  await expect(panel(page)).toContainText('Текст без таймкодов')
  await expect(panel(page)).toContainText("We'll take a cup of kindness yet")
  await expect(panel(page).locator('li')).toHaveCount(0)
})
test('lyrics embedded in the MP3 tag are read from the catalog file', async ({ page }) => {
  await create(page)
  await addToRoomAndSelect(page, 'Amazing Grace')
  await expect(panel(page)).toContainText('Текст из тегов файла')
  await expect(panel(page).locator('li')).toHaveCount(12)
})
test('an uploaded song takes an .lrc file, and lyrics can be replaced and removed', async ({
  page,
}) => {
  await create(page)
  await page.getByRole('button', { name: 'Загрузить файл' }).click()
  await page.getByLabel('Файл с текстом песни').setInputFiles({
    name: 'demo.lrc',
    mimeType: 'text/plain',
    buffer: Buffer.from('[00:01.00]Первая строка\n[00:03.00]Вторая строка\n', 'utf-8'),
  })
  await page.getByLabel('Выберите аудиофайл').setInputFiles('tests/fixtures/demo-1.wav')
  await expect(page.getByRole('dialog').getByRole('status').first()).toContainText(
    'Композиция добавлена',
    { timeout: 90000 },
  )
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  await select(page, 'demo-1')
  await expect(panel(page).locator('li')).toHaveCount(2)
  await expect(panel(page)).toContainText('Первая строка')
  await panel(page).getByRole('button', { name: 'Изменить текст' }).click()
  await page.getByLabel('Или вставьте текст').fill('Просто текст\nбез таймкодов')
  await page.getByRole('button', { name: 'Сохранить текст' }).click()
  await expect(panel(page)).toContainText('Текст без таймкодов')
  await expect(panel(page)).toContainText('Просто текст')
  await panel(page).getByRole('button', { name: 'Изменить текст' }).click()
  await page.getByRole('button', { name: 'Убрать текст' }).click()
  await expect(panel(page)).toContainText('У этой песни нет текста')
})
test('lyrics stored inside an uploaded file are picked up by the worker', async ({ page }) => {
  await create(page)
  await page.getByRole('button', { name: 'Загрузить файл' }).click()
  await page.getByLabel('Выберите аудиофайл').setInputFiles('tests/fixtures/tone-with-lyrics.mp3')
  await expect(page.getByRole('dialog').getByRole('status').first()).toContainText(
    'Композиция добавлена',
    { timeout: 90000 },
  )
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  await select(page, 'Tone with lyrics')
  await expect(panel(page)).toContainText('Текст из тегов файла')
  await expect(panel(page).locator('li')).toHaveCount(3)
})
