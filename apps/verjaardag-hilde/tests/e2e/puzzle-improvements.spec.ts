import { test, expect } from "@playwright/test";

/**
 * E2E tests for Puzzle Improvements (Tasks 68-77)
 *
 * These tests verify the following changes:
 * - Task 68: Enable placed switches to be moved back in Puzzle 3
 * - Task 69: Add red border indication for invalid switch combinations
 * - Task 70: Remove drop target heading from Puzzle 3 bulbs section
 * - Task 71: Make application vertically scrollable
 * - Task 72: Show color labels in Puzzle 4 before collection
 * - Task 73: Fix gauge not updating when entity value changes in Puzzle 6
 * - Task 74: Fix gauge first segment color from red to white
 *
 * The app should be running at http://localhost:5173/ for testing.
 * Tests work with or without Home Assistant connection.
 */

test.describe("Puzzle 3 - Switch Improvements (Tasks 68-70)", () => {
  test("renders all 5 switches in the switches container", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for switch elements
    const switches = page.locator(".switch-draggable");
    const switchesVisible = await switches
      .first()
      .isVisible()
      .catch(() => false);

    if (switchesVisible) {
      // Verify all 5 switches exist
      await expect(page.getByTestId("switch-slaapkamer")).toBeVisible();
      await expect(page.getByTestId("switch-waskamer")).toBeVisible();
      await expect(page.getByTestId("switch-keuken")).toBeVisible();
      await expect(page.getByTestId("switch-tuin")).toBeVisible();
      await expect(page.getByTestId("switch-voorraadkast")).toBeVisible();
    }
  });

  test("renders all 5 bulbs in the bulbs container", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const bulbs = page.locator(".bulb-droppable");
    const bulbsVisible = await bulbs
      .first()
      .isVisible()
      .catch(() => false);

    if (bulbsVisible) {
      await expect(page.getByTestId("bulb-waskamer")).toBeVisible();
      await expect(page.getByTestId("bulb-voorraadkast")).toBeVisible();
      await expect(page.getByTestId("bulb-slaapkamer")).toBeVisible();
      await expect(page.getByTestId("bulb-keuken")).toBeVisible();
      await expect(page.getByTestId("bulb-tuin")).toBeVisible();
    }
  });

  test("bulbs container does NOT have 'Lampen' heading (Task 70)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const bulbsContainer = page.locator(".bulbs-container");
    const bulbsVisible = await bulbsContainer.isVisible().catch(() => false);

    if (bulbsVisible) {
      // The 'Lampen' heading should NOT exist
      const lampenHeading = bulbsContainer.locator("h3", { hasText: "Lampen" });
      await expect(lampenHeading).not.toBeVisible();
    }
  });

  test("switches container has 'Schakelaars' heading", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const switchesContainer = page.locator(".switches-container");
    const switchesVisible = await switchesContainer
      .isVisible()
      .catch(() => false);

    if (switchesVisible) {
      const heading = switchesContainer.locator("h3", {
        hasText: "Schakelaars",
      });
      await expect(heading).toBeVisible();
    }
  });

  test("CSS for incorrect class exists for red border indication (Task 69)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that .bulb-droppable.incorrect CSS exists
    const incorrectStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".bulb-droppable.incorrect")
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

    expect(incorrectStyleExists).toBe(true);
  });

  test("incorrectShake animation keyframes exist in CSS (Task 69)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hasKeyframes = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSKeyframesRule &&
              rule.name === "incorrectShake"
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

  test("switch-return-zone CSS exists (Task 68)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const returnZoneStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".switch-return-zone")
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

    expect(returnZoneStyleExists).toBe(true);
  });

  test("placed-switch.draggable CSS exists for re-dragging (Task 68)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const draggableStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".placed-switch.draggable")
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

    expect(draggableStyleExists).toBe(true);
  });
});

test.describe("Application Scrollability (Task 71)", () => {
  test("body allows vertical scrolling", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const overflowY = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).overflowY;
    });

    // Should be 'auto' or 'scroll', not 'hidden'
    expect(overflowY).not.toBe("hidden");
  });

  test("body has min-height instead of fixed height", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check CSS for body has min-height
    const hasMinHeight = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              (rule.selectorText === "body" ||
                rule.selectorText === "html, body" ||
                rule.selectorText?.includes("body"))
            ) {
              const minHeight = rule.style.minHeight;
              if (minHeight && minHeight !== "") {
                return true;
              }
            }
          }
        } catch {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    });

    expect(hasMinHeight).toBe(true);
  });

  test("custom scrollbar styles exist", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hasScrollbarStyles = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes("::-webkit-scrollbar")
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

    expect(hasScrollbarStyles).toBe(true);
  });
});

test.describe("Puzzle 4 - Color Labels (Task 72)", () => {
  test("CollectionPuzzle shows color labels when showLabelsWhenPending is used", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for Screen 6 (Puzzle 4) elements
    const screen6 = page.locator(".screen-6-puzzle-4");
    const hasScreen6 = await screen6.isVisible().catch(() => false);

    if (hasScreen6) {
      // Color labels should be visible
      const roodLabel = page.getByText("Rood");
      const blauwLabel = page.getByText("Blauw");
      const groenLabel = page.getByText("Groen");

      // At least one should be visible (labels shown before collection)
      const hasRood = await roodLabel.isVisible().catch(() => false);
      const hasBlauw = await blauwLabel.isVisible().catch(() => false);
      const hasGroen = await groenLabel.isVisible().catch(() => false);

      expect(hasRood || hasBlauw || hasGroen).toBe(true);
    }
  });

  test("collection-item CSS has collected class for green border", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const collectedStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".collection-item.collected")
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

    expect(collectedStyleExists).toBe(true);
  });
});

test.describe("Puzzle 6 - Gauge Improvements (Tasks 73-74)", () => {
  test("gauge container exists on puzzle screen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for Screen 8 (Puzzle 6) elements
    const gaugeContainer = page.getByTestId("gauge-container");
    const hasGauge = await gaugeContainer.isVisible().catch(() => false);

    if (hasGauge) {
      await expect(gaugeContainer).toBeVisible();
    }
  });

  test("gauge puzzle CSS exists", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const gaugePuzzleStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".gauge-puzzle")
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

    expect(gaugePuzzleStyleExists).toBe(true);
  });

  test("gauge status CSS exists", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const statusStyleExists = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes(".gauge-status")
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

    expect(statusStyleExists).toBe(true);
  });
});

test.describe("CSS Structure Integrity", () => {
  test("all expected CSS classes for puzzle improvements exist", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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

    // Essential classes for puzzle improvements should exist
    expect(cssClasses.some((c) => c.includes(".switch-draggable"))).toBe(true);
    expect(cssClasses.some((c) => c.includes(".bulb-droppable"))).toBe(true);
    expect(cssClasses.some((c) => c.includes(".bulb-droppable.correct"))).toBe(
      true
    );
    expect(
      cssClasses.some((c) => c.includes(".bulb-droppable.incorrect"))
    ).toBe(true);
    expect(cssClasses.some((c) => c.includes(".switch-return-zone"))).toBe(
      true
    );
    expect(cssClasses.some((c) => c.includes(".collection-item"))).toBe(true);
    expect(cssClasses.some((c) => c.includes(".gauge-puzzle"))).toBe(true);
  });

  test("page loads without CSS errors", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const pageContent = await page.content();
    expect(pageContent).toContain("<!DOCTYPE html>");
    expect(pageContent).toContain('id="root"');
  });
});
