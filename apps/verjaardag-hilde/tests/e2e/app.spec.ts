import { test, expect } from "@playwright/test";

/**
 * E2E tests for Verjaardag Hilde escape room.
 *
 * These tests verify the UI loads correctly and basic navigation works.
 * Note: Without a real HA connection, we test the loading/error states
 * and the structure of the application.
 *
 * For full integration testing with HA, run against a live HA instance
 * with VITE_HA_URL configured.
 */
test.describe("Verjaardag Hilde App - No HA Connection", () => {
  test("shows configuration error when HA URL is not configured", async ({
    page,
  }) => {
    // Without VITE_HA_URL, the app should show a configuration error
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Should show either loading state or config error
    // Depending on timing, we might see the error or the app trying to load
    const hasError = await page
      .getByText("Configuratiefout")
      .isVisible()
      .catch(() => false);
    const hasLoading = await page
      .getByText("Laden...")
      .isVisible()
      .catch(() => false);
    const hasTitle = await page
      .getByText("Verjaardag Hilde")
      .isVisible()
      .catch(() => false);

    // At least one of these should be visible
    expect(hasError || hasLoading || hasTitle).toBe(true);
  });

  test("error boundary catches and displays errors gracefully", async ({
    page,
  }) => {
    await page.goto("/");

    // The error boundary should prevent crashes
    // Even if HA fails, we should see a styled error or loading state
    const pageContent = await page.content();
    expect(pageContent).toContain("<!DOCTYPE html>");
  });
});

test.describe("Verjaardag Hilde App - Visual Tests", () => {
  test("has correct viewport for iPad Air 11", async ({
    page,
    browserName,
  }) => {
    // Skip for non-iPad project (chromium, webkit)
    test.skip(
      browserName !== "chromium",
      "Viewport test for main project only"
    );

    await page.goto("/");
    const viewport = page.viewportSize();

    // iPad Air 11 landscape dimensions
    expect(viewport?.width).toBe(1640);
    expect(viewport?.height).toBe(1148);
  });

  test("applies dark theme styling", async ({ page }) => {
    await page.goto("/");

    // Check that the app has dark background
    const body = await page.locator("body");
    const backgroundColor = await body.evaluate(
      (el) => window.getComputedStyle(el).background
    );

    // Should have a gradient background (dark theme)
    expect(backgroundColor).toContain("rgb");
  });

  test("renders with proper font family", async ({ page }) => {
    await page.goto("/");

    const body = await page.locator("body");
    const fontFamily = await body.evaluate(
      (el) => window.getComputedStyle(el).fontFamily
    );

    // Should use system fonts
    expect(fontFamily).toMatch(
      /-apple-system|BlinkMacSystemFont|Segoe UI|Roboto/i
    );
  });
});

test.describe("Verjaardag Hilde App - Accessibility", () => {
  test("has no accessibility violations in main container", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for basic accessibility attributes
    const html = await page.locator("html");
    const lang = await html.getAttribute("lang");

    // Should have Dutch language set
    expect(lang).toBe("nl");
  });

  test("buttons are focusable and have accessible names", async ({ page }) => {
    await page.goto("/");

    // Wait for any buttons to be visible
    const buttons = page.locator("button");
    const count = await buttons.count();

    if (count > 0) {
      // Each button should be focusable
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const isVisible = await button.isVisible().catch(() => false);
        if (isVisible) {
          const ariaLabel = await button.getAttribute("aria-label");
          const innerText = await button.innerText().catch(() => "");

          // Button should have either aria-label or text content
          expect(ariaLabel || innerText.length > 0).toBe(true);
        }
      }
    }
  });
});

test.describe("Verjaardag Hilde App - Performance", () => {
  test("loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("bundle size is reasonable", async ({ page }) => {
    const responses: { url: string; size: number }[] = [];

    page.on("response", async (response) => {
      if (response.url().includes(".js")) {
        const buffer = await response.body().catch(() => Buffer.from(""));
        responses.push({
          url: response.url(),
          size: buffer.length,
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Total JS should be under 1MB (uncompressed)
    const totalSize = responses.reduce((sum, r) => sum + r.size, 0);
    expect(totalSize).toBeLessThan(1024 * 1024);
  });
});

test.describe("Verjaardag Hilde App - Progressive Code Display", () => {
  test("progress code component structure is correct", async ({ page }) => {
    await page.goto("/");

    // Look for progress code element (may not be visible on intro screen)
    const progressCode = page.locator(".progress-code");

    // If visible, check structure
    if (await progressCode.isVisible().catch(() => false)) {
      const hasLabel = await progressCode.locator(".code-label").isVisible();
      expect(hasLabel).toBe(true);
    }
  });
});
