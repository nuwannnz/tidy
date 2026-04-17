import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

export default defineConfig({
  testDir: './src/api',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../../playwright-report' }],
    ['list'],
    ...(process.env.CI
      ? [['junit', { outputFile: '../../test-results/e2e-api/junit.xml' }] as const]
      : []),
  ],
  use: {
    baseURL: process.env.API_URL || 'http://localhost:4000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'api',
      use: {},
    },
  ],
  webServer: {
    command: 'npm run dev:api',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: '../../',
  },
});
