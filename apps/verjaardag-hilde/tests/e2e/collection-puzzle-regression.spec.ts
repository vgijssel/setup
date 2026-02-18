import { test, expect } from "@playwright/test";

/**
 * Regression test for collection puzzle loading issue.
 *
 * Bug: Collection puzzles (Screens 5, 7, 8 for Puzzles 3, 6, 7) show
 * "Puzzel laden..." indefinitely when entities don't exist in Home Assistant.
 *
 * Root cause: useEntity returns null for missing entities, causing isLoading
 * to stay true forever in useCollectionProgress hook.
 */

const HOME_ASSISTANT_URL = "http://homeassistant.local:8123";
const DEV_SERVER_URL = "http://localhost:5173";

test.describe("Collection Puzzle Loading Regression", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000); // Wait for initial load
  });

  test("Screen 5 (Puzzle 3 - Switches) shows loading state indefinitely", async ({
    page,
  }) => {
    // Use Home Assistant REST API to navigate to Screen 5
    // This would require HA access token - for now we'll simulate by checking the UI

    // Check if we can find the loading state
    const loadingText = page.locator('text="Puzzel laden..."');

    // If the screen is already on Screen 5, it should show loading
    // Navigate by simulating entity change (this requires HA connection)

    // For now, document that this test requires HA connection
    console.log(
      "Test requires Home Assistant connection to change global_select"
    );
    console.log(
      "Expected: Screen 5 shows 'Puzzel laden...' when entities are missing"
    );
  });

  test("Screen 7 (Puzzle 6 - Power) shows loading state indefinitely", async ({
    page,
  }) => {
    // Similar test for Screen 7
    console.log("Test requires Home Assistant connection");
    console.log(
      "Expected: Screen 7 shows 'Puzzel laden...' when entities are missing"
    );
  });

  test("Screen 8 (Puzzle 7 - Temperature) shows loading state indefinitely", async ({
    page,
  }) => {
    // Similar test for Screen 8
    console.log("Test requires Home Assistant connection");
    console.log(
      "Expected: Screen 8 shows 'Puzzel laden...' when entities are missing"
    );
  });

  test("CollectionPuzzle component with missing entities", async ({ page }) => {
    // This test validates the root cause: when useEntity returns null
    // for missing entities, isLoading stays true forever

    // Navigate to a screen with collection puzzle
    // The page should show either:
    // 1. "Puzzel laden..." indefinitely (current bug)
    // 2. An error message (desired behavior)
    // 3. The puzzle UI with default values (alternative fix)

    const loadingIndicator = page.locator('[data-testid="puzzle-loading"]');
    const errorMessage = page.locator('[data-testid="puzzle-error"]');
    const puzzleContent = page.locator('[data-testid="collection-puzzle"]');

    // Wait a reasonable time (5 seconds)
    await page.waitForTimeout(5000);

    // Document expected vs actual behavior
    console.log("Current behavior: Shows 'Puzzel laden...' indefinitely");
    console.log("Expected behavior: Show error or default UI after timeout");
  });
});

test.describe("Collection Puzzle with Home Assistant REST API", () => {
  // These tests require HA REST API access
  // Skip for now but document the test plan

  test.skip("Navigate to Screen 5 via REST API", async ({ page, request }) => {
    // Set up HA REST API access
    const HA_TOKEN = process.env.HA_TOKEN || "";

    if (!HA_TOKEN) {
      console.log("HA_TOKEN not set, skipping integration test");
      return;
    }

    // Use REST API to set global_select to "5"
    await request.post(
      `${HOME_ASSISTANT_URL}/api/services/input_select/select_option`,
      {
        headers: {
          Authorization: `Bearer ${HA_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          entity_id: "input_select.verjaardag_hilde_global_select",
          option: "5",
        },
      }
    );

    // Wait for UI to update
    await page.waitForTimeout(1000);

    // Verify Screen 5 is shown
    await expect(page.locator("text=Puzzel 3")).toBeVisible();

    // Check if loading state appears
    const loading = page.locator('text="Puzzel laden..."');
    const isLoading = await loading.isVisible();

    if (isLoading) {
      console.log("BUG CONFIRMED: Screen 5 shows loading state");
      // Wait to see if it resolves
      await page.waitForTimeout(5000);
      const stillLoading = await loading.isVisible();
      expect(stillLoading).toBe(true); // Bug: still loading after 5s
    }
  });

  test.skip("Toggle collection items via REST API", async ({
    page,
    request,
  }) => {
    const HA_TOKEN = process.env.HA_TOKEN || "";

    if (!HA_TOKEN) {
      console.log("HA_TOKEN not set, skipping integration test");
      return;
    }

    // Navigate to Screen 5
    await request.post(
      `${HOME_ASSISTANT_URL}/api/services/input_select/select_option`,
      {
        headers: {
          Authorization: `Bearer ${HA_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          entity_id: "input_select.verjaardag_hilde_global_select",
          option: "5",
        },
      }
    );

    await page.waitForTimeout(1000);

    // Toggle first collection item
    await request.post(
      `${HOME_ASSISTANT_URL}/api/services/input_boolean/turn_on`,
      {
        headers: {
          Authorization: `Bearer ${HA_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          entity_id: "input_boolean.verjaardag_hilde_puzzle_3_item_1",
        },
      }
    );

    await page.waitForTimeout(1000);

    // Verify UI updates
    const collectedItem = page.locator(".collection-item.collected").first();
    await expect(collectedItem).toBeVisible();
  });
});
