import { expect, test, type Page } from '@playwright/test'

// Keep external requests (fonts, Google reviews, YouTube) out of the tests.
test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)|ytimg|youtube/, (route) => route.abort())
})

async function captureWhatsApp(page: Page) {
  await page.evaluate(() => {
    ;(window as unknown as { opened: string[] }).opened = []
    window.open = ((url: string) => {
      ;(window as unknown as { opened: string[] }).opened.push(url)
      return null
    }) as typeof window.open
  })
  return async () => {
    const urls = await page.evaluate(() => (window as unknown as { opened: string[] }).opened)
    return decodeURIComponent(new URL(urls[0]).searchParams.get('text') ?? '')
  }
}

test('pages arrive with their text and Google tags before the app runs', async ({ request }) => {
  const html = await (await request.get('/fr/tours/fauna-flora')).text()
  expect(html).toContain('<html lang="fr"')
  expect(html).toContain('<link rel="canonical" href="https://www.justlovetour.com/fr/tours/fauna-flora">')
  expect(html).toContain('hreflang="x-default"')
  expect(html).toContain('"@type":"TouristTrip"')
  expect(html).toContain('Trou aux Cerfs')

  expect((await request.get('/tours/does-not-exist')).status()).toBe(404)
  const redirect = await request.get('/about/', { maxRedirects: 0 })
  expect(redirect.status()).toBe(301)
  expect(redirect.headers().location).toMatch(/\/about$/)
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/ru/tours/fauna-flora')
})

test('home shows the tours and opens one with its price', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.locator('#activities').getByRole('link', { name: /Fauna & Flora/ }).click()
  await expect(page).toHaveURL(/\/tours\/fauna-flora$/)
  const sheet = page.getByRole('dialog')
  await expect(sheet.getByRole('heading', { name: 'Fauna & Flora' })).toBeVisible()
  await expect(sheet.getByText('€150')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/$/)
})

test('booking needs the required fields and sends the estimate to WhatsApp', async ({ page }) => {
  await page.goto('/tours/fauna-flora#book')
  const form = page.getByRole('dialog')
  const read = await captureWhatsApp(page)
  await form.getByRole('button', { name: 'Send on WhatsApp' }).click()
  await expect(form.getByRole('alert')).toContainText('fields marked *')

  await form.getByLabel('Full name').fill('Test Traveller')
  // Past days are blocked; pick the first day that can be chosen.
  await form.locator('.rdp-day button:not([disabled])').first().click()
  await form.getByRole('button', { name: 'More children' }).click()
  await form.getByLabel('Email').fill('test@example.com')
  await form.getByLabel('Phone (WhatsApp)').fill('+33 6 12 34 56 78')
  await expect(form.getByText('€380')).toBeVisible()
  await form.getByRole('button', { name: 'Send on WhatsApp' }).click()

  const message = await read()
  expect(message).toContain('Fauna & Flora')
  expect(message).toContain('Estimated total: €380')
  expect(message).toContain('Test Traveller')
})

test('language switch keeps the page and translates the interface', async ({ page }) => {
  await page.goto('/transfers')
  await page.getByRole('combobox', { name: 'Language' }).selectOption('fr')
  await expect(page).toHaveURL(/\/fr\/transfers$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Transferts aéroport et hôtel')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
})

test('gallery pages through the photos', async ({ page }) => {
  await page.goto('/gallery')
  await expect(page.locator('main ul').first().locator('img')).toHaveCount(10)
  await page.getByRole('link', { name: 'Page 2' }).click()
  await expect(page).toHaveURL(/\/gallery\?page=2$/)
  await expect(page.locator('main ul').first().locator('img').first()).toBeVisible()
})
