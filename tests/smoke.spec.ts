import { expect, test } from '@playwright/test'

test('home page renders key sections', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'Just Love Tour' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Tour Planner' })).toBeVisible()
  await expect(page.locator('#tour-planner')).toBeVisible()
  await expect(page.locator('#activities')).toBeVisible()
  await expect(page.locator('#gallery')).toBeVisible()
  await expect(page.locator('#airport-transfer')).toBeVisible()
  await expect(page.locator('#contact')).toBeVisible()
})

test('activity detail flow works', async ({ page }) => {
  await page.goto('/')
  await page.locator('#activities').scrollIntoViewIfNeeded()

  await page.getByRole('button', { name: 'Learn More' }).first().click()
  await expect(page.getByRole('button', { name: 'Back to Activities' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(0)

  await page.getByRole('button', { name: 'Back to Activities' }).click()
  await expect(page.locator('#activities')).toBeInViewport()
})

test('gallery still renders without backend data', async ({ page }) => {
  await page.goto('/')

  const gallery = page.locator('#gallery')
  await expect(gallery).toBeVisible()

  const images = gallery.locator('img')
  await expect(images.first()).toBeVisible()
  await expect(images).toHaveCount(8)

  await gallery.getByRole('button', { name: /Open gallery image 1/i }).click()
  await expect(page.getByRole('dialog', { name: 'Gallery image preview' })).toBeVisible()
  await page.getByRole('button', { name: 'Close gallery image' }).click()
  await expect(page.getByRole('dialog', { name: 'Gallery image preview' })).toHaveCount(0)
})

test('airport transfer request requires passenger count', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('#airport-transfer')
  const requestButton = section.getByRole('button', { name: 'Request Transfer on WhatsApp' })
  await expect(requestButton).toBeDisabled()

  await section.getByLabel(/Number of pax/i).fill('2')
  await expect(requestButton).toBeEnabled()
})
