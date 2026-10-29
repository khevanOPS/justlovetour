import { defineConfig, devices } from '@playwright/test'

// Runs against the real Pages setup (functions + local D1/R2). Seed it once first:
//   npx wrangler d1 migrations apply justlovetour-db --local && node scripts/upload-seed-media.mjs --local
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:8788',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npx wrangler pages dev dist --port 8788',
    url: 'http://127.0.0.1:8788/api/content',
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'phone', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
})
