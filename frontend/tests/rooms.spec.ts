import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
async function createRoom(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Создать комнату', exact: true }).click()
  await page.getByLabel('Как вас зовут').fill('Кирилл')
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Создать комнату', exact: true })
    .click()
  await expect(page.getByRole('button', { name: 'Сменить комнату' })).toBeVisible()
}
async function inviteLink(page: Page) {
  await page.getByRole('button', { name: 'Пригласить друга' }).click()
  const value = await page.getByLabel('Ссылка-приглашение').inputValue()
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  return value
}
async function selectTrack(page: Page) {
  await page.getByRole('button', { name: 'Открыть подборку' }).click()
  await page.getByRole('button', { name: 'Выбрать После дождя', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Открыть подборку' })).toBeFocused()
  await expect
    .poll(() =>
      page
        .locator('.participant-state')
        .evaluateAll(
          (nodes) =>
            nodes.length > 0 &&
            nodes.every((n) => n.getAttribute('title') === 'Готов к прослушиванию'),
        ),
    )
    .toBe(true)
}
test('two listeners share play, pause, seek and host transfer', async ({ page, context }) => {
  await createRoom(page)
  const invite = await inviteLink(page)
  const guest = await context.newPage()
  await guest.goto(invite)
  await guest.getByLabel('Как вас зовут').fill('Аня')
  await guest.getByRole('button', { name: 'Войти и включить звук' }).click()
  await expect(guest).toHaveURL(/\/room\//)
  await expect(page.getByText('Аня', { exact: true })).toBeVisible()
  await selectTrack(page)
  await expect(guest.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
  await expect(guest.getByRole('button', { name: 'Воспроизвести для всех' })).toBeDisabled()
  await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
  await expect(page.getByRole('button', { name: 'Пауза для всех' })).toBeEnabled()
  await expect(guest.getByRole('button', { name: 'Пауза для всех' })).toBeDisabled()
  await expect
    .poll(async () =>
      Number(await guest.getByRole('slider', { name: 'Общая позиция композиции' }).inputValue()),
    )
    .toBeGreaterThan(1500)
  await page.getByRole('button', { name: 'Пауза для всех' }).click()
  await expect(page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeEnabled()
  const slider = page.getByRole('slider', { name: 'Общая позиция композиции' })
  await slider.focus()
  await slider.press('Home')
  await slider.press('ArrowRight')
  await expect
    .poll(async () =>
      Number(await guest.getByRole('slider', { name: 'Общая позиция композиции' }).inputValue()),
    )
    .toBeLessThanOrEqual(1000)
  await guest.getByRole('button', { name: 'Выключить звук у меня' }).click()
  await expect(guest.getByRole('button', { name: 'Включить звук у меня' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Выключить звук у меня' })).toBeVisible()
  await page.getByRole('button', { name: 'Выйти из комнаты' }).click()
  await expect(guest.getByRole('button', { name: 'Открыть подборку' })).toBeVisible()
  await guest.getByRole('button', { name: 'Закрыть комнату для всех' }).click()
  await guest.getByRole('button', { name: 'Закрыть для всех', exact: true }).click()
  await expect(guest.getByRole('heading', { name: 'Комната закрыта.' })).toBeVisible()
})
test('late join follows the playing timeline and third guest is rejected', async ({
  page,
  context,
}) => {
  await createRoom(page)
  const invite = await inviteLink(page)
  await selectTrack(page)
  await page.getByRole('button', { name: 'Воспроизвести для всех' }).click()
  await expect
    .poll(async () =>
      Number(await page.getByRole('slider', { name: 'Общая позиция композиции' }).inputValue()),
    )
    .toBeGreaterThan(2200)
  const guest = await context.newPage()
  await guest.goto(invite)
  await guest.getByLabel('Как вас зовут').fill('Аня')
  await guest.getByRole('button', { name: 'Войти и включить звук' }).click()
  await expect
    .poll(async () =>
      Number(await guest.getByRole('slider', { name: 'Общая позиция композиции' }).inputValue()),
    )
    .toBeGreaterThan(2000)
  const third = await context.newPage()
  await third.goto(invite)
  await expect(third.getByText('Комната уже заполнена. Здесь могут слушать двое.')).toBeVisible()
})
test('invalid invitation and unknown route have recoverable screens', async ({ page }) => {
  await page.goto('/join/not-a-room#invite=wrong')
  await expect(page.getByRole('alert')).toContainText('Комната не найдена')
  await page.goto('/missing')
  await expect(page.getByRole('heading', { name: 'Здесь пока тихо.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'На главную', exact: true })).toBeVisible()
})
test('upload plays a real local file and survives room reload', async ({ page }) => {
  await createRoom(page)
  await page.getByRole('button', { name: 'Загрузить файл' }).click()
  await page.getByLabel('Выберите аудиофайл').setInputFiles('public/audio/demo-2.wav')
  await expect(page.getByText('Композиция добавлена в подборку')).toBeVisible()
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  await page.getByRole('button', { name: 'Открыть подборку' }).click()
  await page.getByRole('button', { name: 'Выбрать demo-2', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'demo-2', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'demo-2', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Включить звук', exact: true })).toBeVisible()
})
for (const width of [360, 390, 768, 1024, 1440])
  test(`responsive at ${width}px, keyboard dialog and no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: 'Создать комнату', exact: true }).click()
    await expect(page.getByLabel('Как вас зовут')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await createRoom(page)
    await selectTrack(page)
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    await page.screenshot({ path: `test-results/room-${width}.png`, fullPage: true })
  })

test('dialog restores focus to its trigger', async ({ page }) => {
  await createRoom(page)
  await page.getByRole('button', { name: 'Открыть подборку' }).click()
  await page.getByRole('button', { name: 'Закрыть окно' }).click()
  await expect(page.getByRole('button', { name: 'Открыть подборку' })).toBeFocused()
})

test('mobile host can close the room', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 })
  await createRoom(page)
  await page.getByRole('button', { name: 'Закрыть комнату для всех' }).click()
  await page.getByRole('button', { name: 'Закрыть для всех', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Комната закрыта.' })).toBeVisible()
})

test('clipboard refusal offers manual copying inside the dialog', async ({ page }) => {
  await createRoom(page)
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      value: () => Promise.reject(new Error('denied')),
    })
  })
  await page.getByRole('button', { name: 'Пригласить друга' }).click()
  await page.getByRole('button', { name: 'Копировать ссылку' }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('скопируйте её вручную')
  await expect(page.getByLabel('Ссылка-приглашение')).toHaveValue(/#invite=/)
})
