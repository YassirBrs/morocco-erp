import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.e2e\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: isCi ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_APP_URL ?? 'http://127.0.0.1:8000',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'npm run backend:build && PORT=3100 node backend/dist/main.js',
      url: 'http://127.0.0.1:3100/tenant/current',
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
    {
      command: 'python3 -m http.server 8000 --directory frontend',
      url: 'http://127.0.0.1:8000/index.html',
      reuseExistingServer: !isCi,
      timeout: 30_000,
    },
  ],
});
