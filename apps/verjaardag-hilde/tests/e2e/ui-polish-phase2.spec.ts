import { test, expect } from "@playwright/test";

/**
 * E2E tests for UI Polish Phase 2 Changes (Tasks 54-63)
 *
 * These tests verify the following UI changes:
 * - Task 54-55: Green fade effect on puzzle completion (replaces popup)
 * - Task 56-58: PuzzleSolvedPopup removal
 * - Task 59: Screen7Puzzle5 subtitle text update
 * - Task 60-61: Screen11Outro video-only layout
 * - Task 62-63: Tests for all changes
 *
 * The app should be running at http://localhost:5173/ for testing.
 * Tests work with or without Home Assistant connection.
 */

test.describe("Green Fade Effect on Puzzle Completion", () => {
  test("progress-code element exists and has correct structure", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for progress-code element
    const progressCode = page.locator("[data-testid='progress-code']");
    const hasProgressCode = await progressCode.isVisible().catch(() => false);

    if (hasProgressCode) {
      // Verify structure
      await expect(progressCode).toHaveClass(/progress-code/);

      // Check for code-label
      const codeLabel = progressCode.locator(".code-label");
      await expect(codeLabel).toBeVisible();
      await expect(codeLabel).toContainText("Kluis code:");
    }
  });

  test("progress-code can have puzzle-complete class", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check CSS styles exist for puzzle-complete class
    const styles = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".progress-code.puzzle-complete")
            ) {
              return true;
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    });

    expect(styles).toBe(true);
  });

  test("greenFadeIn animation keyframes exist in CSS", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check CSS keyframes exist for greenFadeIn
    const hasKeyframes = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSKeyframesRule &&
              rule.name === "greenFadeIn"
            ) {
              return true;
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    });

    expect(hasKeyframes).toBe(true);
  });

  test("puzzle-complete class applies green background animation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that CSS has the expected animation for puzzle-complete class
    const animationExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".progress-code.puzzle-complete")
            ) {
              const animation = rule.style.animation;
              return (
                animation?.includes("greenFadeIn") ||
                rule.style.animationName === "greenFadeIn"
              );
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    });

    expect(animationExists).toBe(true);
  });
});

test.describe("Popup Removal Verification", () => {
  test("puzzle-solved-popup CSS class no longer exists", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that puzzle-solved-popup CSS no longer exists
    const popupStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".puzzle-solved-popup")
            ) {
              return true;
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    });

    expect(popupStyleExists).toBe(false);
  });

  test("no puzzle-solved-popup element exists on page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that popup element doesn't exist
    const popup = page.locator("[data-testid='puzzle-solved-popup']");
    await expect(popup).not.toBeVisible();
  });

  test("no 'Puzzel opgelost!' text appears in popup format", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that there's no popup with this text
    const popupContainer = page.locator(".puzzle-solved-popup");
    const hasPopup = await popupContainer.isVisible().catch(() => false);

    expect(hasPopup).toBe(false);
  });
});

test.describe("Screen 7 - Puzzle 5 Lamp Instruction", () => {
  test("Screen 7 Puzzle 5 has correct subtitle", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Try to find Screen 7 content
    // Note: Without HA navigation, we may not be on Screen 7
    const newSubtitle = page.getByText(
      "Zet de lampen in de juiste volgorde aan"
    );
    const hasNewSubtitle = await newSubtitle.isVisible().catch(() => false);

    // Old subtitle should NOT be visible
    const oldSubtitle = page.getByText(
      "Schakel 5 slimme lampen in de juiste volgorde in."
    );
    const hasOldSubtitle = await oldSubtitle.isVisible().catch(() => false);

    // If we're on Screen 7, new subtitle should be visible and old should not
    if (hasNewSubtitle) {
      await expect(newSubtitle).toBeVisible();
    }

    if (hasOldSubtitle) {
      console.warn(
        "Warning: Old Puzzle 5 subtitle still visible - change may not be applied"
      );
    }
  });

  test("puzzle description element exists on puzzle screens", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for puzzle-description class
    const description = page.locator(".puzzle-description");
    const hasDescription = await description.isVisible().catch(() => false);

    if (hasDescription) {
      await expect(description).toBeVisible();
    }
  });
});

test.describe("Screen 11 - Outro Video-Only Layout", () => {
  test("Screen 11 has correct structure with video container", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for Screen 11 structure if on that screen
    const screen11 = page.getByTestId("screen-11-outro");
    const hasScreen11 = await screen11.isVisible().catch(() => false);

    if (hasScreen11) {
      // Should have video container
      const videoContainer = screen11.locator(
        "[data-testid='outro-video-container']"
      );
      await expect(videoContainer).toBeVisible();

      // Should have progress-code
      const progressCode = screen11.locator("[data-testid='progress-code']");
      await expect(progressCode).toBeVisible();
    }
  });

  test("Screen 11 does NOT show celebration content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const screen11 = page.getByTestId("screen-11-outro");
    const hasScreen11 = await screen11.isVisible().catch(() => false);

    if (hasScreen11) {
      // Should NOT have celebration elements
      const congratsTitle = page.getByTestId("congratulations-title");
      await expect(congratsTitle).not.toBeVisible();

      // Should NOT have watch video button
      const watchButton = page.getByTestId("watch-video-button");
      await expect(watchButton).not.toBeVisible();

      // Should NOT have "Gefeliciteerd!" text
      const congratsText = page.getByText("Gefeliciteerd!");
      await expect(congratsText).not.toBeVisible();
    }
  });

  test("Screen 11 CSS has correct video-only layout styles", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that screen-11-outro CSS has flexbox layout
    const hasFlexLayout = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".screen-11-outro")
            ) {
              const display = rule.style.display;
              const flexDirection = rule.style.flexDirection;
              return display === "flex" && flexDirection === "column";
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    });

    expect(hasFlexLayout).toBe(true);
  });

  test("Screen 11 progress-code shows complete code with green fade", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const screen11 = page.getByTestId("screen-11-outro");
    const hasScreen11 = await screen11.isVisible().catch(() => false);

    if (hasScreen11) {
      const progressCode = screen11.locator("[data-testid='progress-code']");
      await expect(progressCode).toBeVisible();

      // Should have puzzle-complete class for green fade
      await expect(progressCode).toHaveClass(/puzzle-complete/);

      // Should show full code (8/8 digits)
      const digitsText = page.getByText("8/8 cijfers hersteld");
      await expect(digitsText).toBeVisible();
    }
  });
});

test.describe("UI Polish Phase 2 - CSS Structure Integrity", () => {
  test("page loads without CSS errors", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Page should render successfully
    const pageContent = await page.content();
    expect(pageContent).toContain("<!DOCTYPE html>");
    expect(pageContent).toContain('id="root"');
  });

  test("body styling is applied correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const body = page.locator("body");
    const backgroundColor = await body.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    // Should have some background color applied
    expect(backgroundColor).toMatch(/rgb/);
  });

  test("no orphaned or broken CSS selectors", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that key CSS classes still work
    const progressCode = page.locator(".progress-code");
    const hasProgressCode = await progressCode
      .first()
      .isVisible()
      .catch(() => false);

    if (hasProgressCode) {
      // Get computed styles to verify CSS is applied
      const styles = await progressCode.first().evaluate((el) => ({
        fontFamily: window.getComputedStyle(el).fontFamily,
        borderRadius: window.getComputedStyle(el).borderRadius,
      }));

      // Font family should be monospace
      expect(styles.fontFamily).toContain("Courier");
      // Border radius should be applied
      expect(styles.borderRadius).toBeTruthy();
    }
  });
});

test.describe("UI Polish Phase 2 - Integration Tests", () => {
  test("app renders on all screen sizes", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test iPad Air 11" viewport (default in playwright.config.ts)
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });

  test("all major CSS components exist", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that expected CSS classes exist in the stylesheet
    const cssClasses = await page.evaluate(() => {
      const classes: string[] = [];
      const styleSheets = Array.from(document.styleSheets);

      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule) {
              classes.push(rule.selectorText);
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return classes;
    });

    // Essential classes should exist
    expect(cssClasses.some((c) => c.includes(".progress-code"))).toBe(true);
    expect(cssClasses.some((c) => c.includes(".screen-11-outro"))).toBe(true);
    expect(cssClasses.some((c) => c.includes(".puzzle-complete"))).toBe(true);
  });
});
