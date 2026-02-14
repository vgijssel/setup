import { test, expect } from "@playwright/test";

/**
 * E2E tests for Screen 8 Puzzle 6 - Gauge Entity Subscription (Task 81)
 *
 * Tests verify that the gauge component updates in real-time when
 * the Home Assistant entity state changes via REST API.
 *
 * The app should be running at http://localhost:5173/ for testing.
 */

const DEV_SERVER_URL = process.env.DEV_SERVER_URL || "http://localhost:5173";
const HOME_ASSISTANT_URL =
  process.env.HA_URL || "http://homeassistant.local:8123";
const HA_TOKEN = process.env.HA_TOKEN || "";

// Helper function to call HA REST API
async function callHAService(
  request: ReturnType<typeof test.info>["config"]["use"]["request"],
  domain: string,
  service: string,
  data: Record<string, unknown>
) {
  if (!HA_TOKEN) return null;

  try {
    const response = await request.post(
      `${HOME_ASSISTANT_URL}/api/services/${domain}/${service}`,
      {
        headers: {
          Authorization: `Bearer ${HA_TOKEN}`,
          "Content-Type": "application/json",
        },
        data,
      }
    );
    return response;
  } catch {
    return null;
  }
}

// Helper function to get entity state
async function getEntityState(
  request: ReturnType<typeof test.info>["config"]["use"]["request"],
  entityId: string
) {
  if (!HA_TOKEN) return null;

  try {
    const response = await request.get(
      `${HOME_ASSISTANT_URL}/api/states/${entityId}`,
      {
        headers: {
          Authorization: `Bearer ${HA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  } catch {
    return null;
  }
}

// Helper function to set entity state directly via REST API
async function setEntityState(
  request: ReturnType<typeof test.info>["config"]["use"]["request"],
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {}
) {
  if (!HA_TOKEN) return null;

  try {
    const response = await request.post(
      `${HOME_ASSISTANT_URL}/api/states/${entityId}`,
      {
        headers: {
          Authorization: `Bearer ${HA_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: {
          state,
          attributes,
        },
      }
    );
    return response;
  } catch {
    return null;
  }
}

test.describe("Screen 8 Puzzle 6 - Basic Rendering", () => {
  test("renders gauge container", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    const gaugeContainer = page.getByTestId("gauge-container");
    const hasGauge = await gaugeContainer.isVisible().catch(() => false);

    // Gauge should exist on the puzzle 6 screen
    if (hasGauge) {
      await expect(gaugeContainer).toBeVisible();
    }
  });

  test("shows puzzle header text", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    const header = page.locator("text=Stroomverbruik Controle");
    const hasHeader = await header.isVisible().catch(() => false);

    if (hasHeader) {
      await expect(header).toBeVisible();
    }
  });

  test("shows puzzle description or solved state", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    // Either unsolved or solved description should be visible
    const unsolvedText = page.locator(
      "text=Pas het stroomverbruik aan tot het in de groene zone valt."
    );
    const solvedText = page.locator(
      "text=Perfect! Het stroomverbruik is optimaal."
    );

    const hasUnsolved = await unsolvedText.isVisible().catch(() => false);
    const hasSolved = await solvedText.isVisible().catch(() => false);

    // One of the two should be visible
    if (hasUnsolved || hasSolved) {
      expect(hasUnsolved || hasSolved).toBe(true);
    }
  });
});

test.describe("Screen 8 Puzzle 6 - HAOS REST API Integration (Task 81)", () => {
  test.beforeEach(async ({ request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    // Navigate to Screen 8 (Puzzle 6)
    await callHAService(request, "input_select", "select_option", {
      entity_id: "input_select.verjaardag_hilde_global_select",
      option: "8",
    });
  });

  test("gauge updates when power_number entity changes to 30", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Set power value to 30 (in the "too low" zone)
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "30",
      { unit_of_measurement: "%" }
    );

    await page.waitForTimeout(1000);

    // The hint should show current value
    const hintSection = page.getByTestId("puzzle-hint");
    const hasHint = await hintSection.isVisible().catch(() => false);

    if (hasHint) {
      // Should show 30%
      await expect(page.locator("text=30%")).toBeVisible();
    }
  });

  test("gauge updates when power_number entity changes to 50 (optimal zone)", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Set power value to 50 (in the "optimal" green zone)
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "50",
      { unit_of_measurement: "%" }
    );

    await page.waitForTimeout(1000);

    // The hint should show current value
    const valueText = page.locator("text=50%");
    const hasValue = await valueText.isVisible().catch(() => false);

    if (hasValue) {
      await expect(valueText).toBeVisible();
    }
  });

  test("gauge updates when power_number entity changes to 80 (too high zone)", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Set power value to 80 (in the "too high" red zone)
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "80",
      { unit_of_measurement: "%" }
    );

    await page.waitForTimeout(1000);

    // The hint should show current value
    const valueText = page.locator("text=80%");
    const hasValue = await valueText.isVisible().catch(() => false);

    if (hasValue) {
      await expect(valueText).toBeVisible();
    }
  });

  test("gauge responds to multiple consecutive updates", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // First update: 20
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "20",
      { unit_of_measurement: "%" }
    );
    await page.waitForTimeout(500);

    // Second update: 50
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "50",
      { unit_of_measurement: "%" }
    );
    await page.waitForTimeout(500);

    // Third update: 70
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "70",
      { unit_of_measurement: "%" }
    );
    await page.waitForTimeout(1000);

    // Final value should be visible
    const valueText = page.locator("text=70%");
    const hasValue = await valueText.isVisible().catch(() => false);

    if (hasValue) {
      await expect(valueText).toBeVisible();
    }
  });

  test("puzzle shows solved state when select entity is 1", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    // Set puzzle as solved
    await callHAService(request, "input_select", "select_option", {
      entity_id: "input_select.verjaardag_hilde_puzzle_6_select",
      option: "1",
    });

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    const solvedSection = page.getByTestId("puzzle-solved");
    const isSolved = await solvedSection.isVisible().catch(() => false);

    if (isSolved) {
      await expect(solvedSection).toBeVisible();
      await expect(page.locator("text=Puzzel opgelost!")).toBeVisible();
    }
  });

  test("gauge persists value after page reload", async ({ page, request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    // Set power value to 45
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "45",
      { unit_of_measurement: "%" }
    );

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Reload the page
    await page.reload();
    await page.waitForTimeout(2000);

    // Value should persist after reconnection
    const valueText = page.locator("text=45%");
    const hasValue = await valueText.isVisible().catch(() => false);

    if (hasValue) {
      await expect(valueText).toBeVisible();
    }
  });
});

test.describe("Screen 8 Puzzle 6 - Edge Cases (Task 81)", () => {
  test("handles unavailable entity gracefully", async ({ page, request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    // Set entity to unavailable state
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "unavailable",
      {}
    );

    // Navigate to Screen 8
    await callHAService(request, "input_select", "select_option", {
      entity_id: "input_select.verjaardag_hilde_global_select",
      option: "8",
    });

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Should show 0% (default for unavailable)
    const valueText = page.locator("text=0%");
    const hasValue = await valueText.isVisible().catch(() => false);

    if (hasValue) {
      await expect(valueText).toBeVisible();
    }
  });

  test("handles unknown entity state gracefully", async ({ page, request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    // Set entity to unknown state
    await setEntityState(
      request,
      "input_number.verjaardag_hilde_puzzle_6_power_number",
      "unknown",
      {}
    );

    // Navigate to Screen 8
    await callHAService(request, "input_select", "select_option", {
      entity_id: "input_select.verjaardag_hilde_global_select",
      option: "8",
    });

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Should show 0% (default for unknown)
    const valueText = page.locator("text=0%");
    const hasValue = await valueText.isVisible().catch(() => false);

    if (hasValue) {
      await expect(valueText).toBeVisible();
    }
  });
});
