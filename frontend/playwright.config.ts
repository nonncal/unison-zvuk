import { defineConfig } from '@playwright/test'
const api = process.env.UNISON_E2E_MODE === 'api'
const origin = api
  ? (process.env.UNISON_E2E_ORIGIN ?? 'http://127.0.0.1:5173')
  : 'http://127.0.0.1:5174'
export default defineConfig({
  testDir: './tests',
  outputDir: api ? 'test-results/api' : 'test-results/demo',
  testMatch: api ? 'api.spec.ts' : 'rooms.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: api ? 120000 : 30000,
  expect: { timeout: 15000 },
  use: { baseURL: origin, viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer:
    process.env.UNISON_E2E_EXTERNAL === '1'
      ? undefined
      : {
          command: `VITE_APP_MODE=${api ? 'api' : 'demo'} npm run dev -- --host 127.0.0.1 --port ${new URL(origin).port} --strictPort`,
          url: origin,
          reuseExistingServer: api && !process.env.CI,
        },
})
