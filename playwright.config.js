import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.STUDENT_URL,
    // trace: 'on-first-retry',
    // screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          ignoreHTTPSErrors: true,
          storageState: undefined,
        },
      },
    },
  ],
  timeout: 70000,
  expect: {
    timeout: 7500,
  },
});
