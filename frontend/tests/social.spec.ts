import { test, expect, type Page, type Browser } from '@playwright/test'
async function create(page: Page, title: string, moderated = false) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Создать комнату', exact: true }).click()
  await page.getByLabel('Как вас зовут').fill('Кирилл')
  await page.getByLabel('Название комнаты').fill(title)
  await page.getByLabel('Участников в комнате').selectOption('10')
  if (moderated) await page.getByLabel('Впускать по одобрению ведущего').check()
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
async function guest(browser: Browser, invite: string, name: string) {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(invite)
  await page.getByLabel('Как вас зовут').fill(name)
  return { context, page }
}
async function close(page: Page) {
  await page.getByRole('button', { name: 'Закрыть комнату для всех' }).first().click()
  await page.getByRole('button', { name: 'Закрыть для всех', exact: true }).click()
}
test.beforeEach(async ({ request }) =>
  expect((await request.get('/health/ready')).status()).toBe(200),
)
test('moderated group admits members, synchronizes permissions queue and reactions', async ({
  page,
  browser,
}) => {
  const invite = await create(page, 'Комната компании', true)
  const g = await guest(browser, invite, 'Аня')
  try {
    await g.page.getByRole('button', { name: 'Попросить впустить' }).click()
    await expect(g.page.getByRole('status')).toContainText('зале ожидания')
    await g.page.reload()
    await expect(g.page.getByRole('status')).toContainText('зале ожидания')
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('button', { name: /Участники \(/ }).click()
    await page.getByRole('button', { name: 'Впустить Аня', exact: true }).click()
    await expect(g.page).toHaveURL(/\/room\//)
    await expect(page.getByText('2/10 в комнате')).toBeVisible()
    await expect(g.page.getByRole('button', { name: 'Следующая песня' })).toBeDisabled()
    await page.getByRole('button', { name: 'Выдать права: Аня' }).click()
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(page.getByRole('button', { name: 'Отозвать права: Аня' })).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
    }
    await expect(g.page.getByRole('button', { name: 'Открыть подборку' })).toBeVisible()
    await g.page.getByRole('button', { name: 'Открыть подборку' }).click()
    await g.page.getByRole('button', { name: 'Выбрать После дождя', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
    const cover = page.getByRole('img', { name: 'Обложка: После дождя' })
    await expect
      .poll(() => cover.evaluate((e) => (e as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    await g.page.getByRole('button', { name: 'Следующая песня' }).click()
    await expect(page.getByRole('heading', { name: 'Северный свет', exact: true })).toBeVisible()
    await g.page.getByRole('button', { name: 'Предыдущая песня' }).click()
    await expect(page.getByRole('heading', { name: 'После дождя', exact: true })).toBeVisible()
    await g.page.getByRole('button', { name: 'Повтор: выключен' }).click()
    await expect(page.getByRole('button', { name: 'Повтор: вся очередь' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await g.page.getByRole('button', { name: 'Перемешивание' }).click()
    await expect(page.getByRole('button', { name: 'Перемешивание' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await g.page.getByRole('button', { name: 'Реакция 🔥' }).click()
    await expect(page.getByRole('region', { name: 'Реакции' })).toContainText('Аня')
    await page.getByRole('button', { name: 'Отозвать права: Аня' }).click()
    await expect(g.page.getByRole('button', { name: 'Следующая песня' })).toBeDisabled()
    const rid = new URL(page.url()).pathname.split('/').at(-1),
      snap = await (await g.page.request.get(`/api/v1/rooms/${rid}`)).json()
    expect(
      (
        await g.page.request.post(`/api/v1/rooms/${rid}/player`, {
          headers: {
            Origin: new URL(page.url()).origin,
            'X-CSRF-Token': (await (await g.page.request.get('/api/v1/bootstrap')).json())
              .csrfToken,
          },
          data: { action: 'next', expectedPlaybackRevision: snap.playbackRevision },
        })
      ).status(),
    ).toBe(403)
    await close(page)
  } finally {
    await g.context.close()
  }
})
test('room switcher changes existing rooms and stays usable on mobile', async ({ page }) => {
  await create(page, 'Первая комната')
  const first = page.url()
  await page.getByRole('button', { name: 'Сменить комнату' }).click()
  await page.getByRole('button', { name: 'Создать ещё одну комнату' }).click()
  await page.getByLabel('Как вас зовут').fill('Кирилл')
  await page.getByLabel('Название комнаты').fill('Вторая комната')
  const [response] = await Promise.all([
    page.waitForResponse(
      (r) => new URL(r.url()).pathname === '/api/v1/rooms' && r.request().method() === 'POST',
    ),
    page.getByRole('dialog').getByRole('button', { name: 'Создать комнату', exact: true }).click(),
  ])
  expect(response.status()).toBe(201)
  await expect(page).not.toHaveURL(first)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('button', { name: 'Сменить комнату' })).toBeVisible()
  await page.getByRole('button', { name: 'Сменить комнату' }).click()
  await page.getByRole('button', { name: /Первая комната/ }).click()
  await expect(page).toHaveURL(first)
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true)
  await close(page)
})
test('host transfers ownership explicitly and removes an active member', async ({
  page,
  browser,
}) => {
  const invite = await create(page, 'Передача роли')
  const g = await guest(browser, invite, 'Аня')
  try {
    await g.page.getByRole('button', { name: 'Войти и включить звук' }).click()
    await expect(g.page).toHaveURL(/\/room\//)
    await page.getByRole('button', { name: 'Передать роль: Аня' }).click()
    await page.getByRole('button', { name: 'Передать роль', exact: true }).click()
    await expect(g.page.getByRole('button', { name: 'Пригласить друга' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Пригласить друга' })).toHaveCount(0)
    await g.page.getByRole('button', { name: 'Удалить участника: Кирилл' }).click()
    await g.page.getByRole('button', { name: 'Удалить из комнаты', exact: true }).click()
    await expect(page.getByText('Соединение завершено', { exact: true })).toBeVisible()
    await close(g.page)
  } finally {
    await g.context.close()
  }
})

test('listener proposes a song and only host can approve it', async ({ page, browser }) => {
  const invite = await create(page, 'Предложения друзей')
  const g = await guest(browser, invite, 'Аня')
  try {
    await g.page.getByRole('button', { name: 'Войти и включить звук' }).click()
    await expect(g.page).toHaveURL(/\/room\//)
    await page.getByRole('button', { name: 'Убрать После дождя', exact: true }).click()
    await g.page
      .getByLabel('Предложить композицию')
      .selectOption({ label: 'После дождя — Unison Studio' })
    await g.page.getByRole('button', { name: 'Предложить', exact: true }).click()
    await expect(page.getByText('Предлагает Аня')).toBeVisible()
    await expect(
      g.page.getByRole('button', { name: 'Принять предложение После дождя' }),
    ).toHaveCount(0)
    await page.getByRole('button', { name: 'Принять предложение После дождя' }).click()
    await expect(g.page.locator('.queue-track').filter({ hasText: 'После дождя' })).toHaveCount(1)
    await expect(page.getByText('Предлагает Аня')).toHaveCount(0)
    await expect(g.page.getByRole('button', { name: 'Воспроизвести для всех' })).toBeDisabled()
    await close(page)
  } finally {
    await g.context.close()
  }
})
