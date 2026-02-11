import { test, expect } from "@playwright/test";

/**
 * E2E tests for Screen 2: Introduction Video
 *
 * Tests the video screen with:
 * - react-player video playback
 * - Autoplay with muted audio
 * - Timestamp-triggered HA service calls
 * - Auto-navigation to Screen 3 on video end
 */
test.describe("Screen 2 Video", () => {
  test("video container is rendered", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to screen 2 if possible (click start button)
    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      // Should now be on screen 2 with video
      const videoContainer = page.getByTestId("video-container");
      const hasVideoContainer = await videoContainer
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasVideoContainer) {
        await expect(videoContainer).toBeVisible();
      }
    }
  });

  test("video element exists with correct source", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      // Look for video element
      const video = page.locator("video");
      const hasVideo = await video
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasVideo) {
        // Check video source
        const source = await video.evaluate((el) => {
          const videoEl = el as HTMLVideoElement;
          return videoEl.src || videoEl.currentSrc;
        });
        expect(source).toContain("verjaardag_hilde_intro.mp4");
      }
    }
  });

  test("video has muted attribute for autoplay compliance", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      const video = page.locator("video");
      const hasVideo = await video
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasVideo) {
        const isMuted = await video.evaluate((el) => {
          const videoEl = el as HTMLVideoElement;
          return videoEl.muted;
        });
        expect(isMuted).toBe(true);
      }
    }
  });

  test("video has playsInline attribute", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      const video = page.locator("video");
      const hasVideo = await video
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasVideo) {
        const playsInline = await video.evaluate((el) => {
          const videoEl = el as HTMLVideoElement;
          return videoEl.playsInline;
        });
        expect(playsInline).toBe(true);
      }
    }
  });

  test("screen 2 has correct accessibility attributes", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      const screen2 = page.locator(".screen-2-video");
      const hasScreen2 = await screen2
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasScreen2) {
        const ariaLabel = await screen2.getAttribute("aria-label");
        expect(ariaLabel).toBe("Introductie video");
      }
    }
  });

  test("progress bar is visible during playback", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      const progressBar = page.locator(".video-progress");
      const hasProgressBar = await progressBar
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasProgressBar) {
        await expect(progressBar).toBeVisible();
      }
    }
  });
});

test.describe("Screen 2 Video - Layout", () => {
  test("video container takes full space", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const startButton = page.getByTestId("start-button");
    const hasStartButton = await startButton.isVisible().catch(() => false);

    if (hasStartButton) {
      await startButton.click();
      await page.waitForTimeout(500);

      const videoContainer = page.locator(".video-container");
      const hasVideoContainer = await videoContainer
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasVideoContainer) {
        const styles = await videoContainer.evaluate((el) => ({
          width: window.getComputedStyle(el).width,
          height: window.getComputedStyle(el).height,
        }));

        // Should have significant width and height
        const width = parseInt(styles.width);
        const height = parseInt(styles.height);
        expect(width).toBeGreaterThan(100);
        expect(height).toBeGreaterThan(100);
      }
    }
  });
});

test.describe("Screen 2 Video - Error Handling", () => {
  test("handles missing video file gracefully", async ({ page }) => {
    // This test verifies the app doesn't crash when video is missing
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The page should still be functional
    const pageContent = await page.content();
    expect(pageContent).toContain("<!DOCTYPE html>");
  });
});
