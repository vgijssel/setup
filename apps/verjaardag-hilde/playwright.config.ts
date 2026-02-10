import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "iPad Air 11 Landscape",
      use: {
        viewport: { width: 1640, height: 1148 },
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
      },
    },
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run preview",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
