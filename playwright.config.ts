import { defineConfig } from '@playwright/test'

export default defineConfig({
  timeout: 60_000,
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:5174', viewport: { width: 1280, height: 800 } },
  webServer: { command: 'pnpm dev --host 127.0.0.1 --port 5174', url: 'http://127.0.0.1:5174', reuseExistingServer: true, timeout: 30_000 },
})
