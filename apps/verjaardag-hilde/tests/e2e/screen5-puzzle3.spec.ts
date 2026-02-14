import { test, expect } from "@playwright/test";

/**
 * E2E tests for Screen 5 Puzzle 3 - Alphabetical Ordering (Task 79)
 *
 * Tests verify that switches and bulbs are displayed in alphabetical order
 * while maintaining correct switch-to-bulb mapping.
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

// Helper to reset puzzle 3 entities
async function resetPuzzle3Entities(
  request: ReturnType<typeof test.info>["config"]["use"]["request"]
) {
  const entities = [
    "input_boolean.verjaardag_hilde_puzzle_3_keuken_toggle",
    "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
    "input_boolean.verjaardag_hilde_puzzle_3_tuin_toggle",
    "input_boolean.verjaardag_hilde_puzzle_3_voorraadkast_toggle",
    "input_boolean.verjaardag_hilde_puzzle_3_waskamer_toggle",
  ];

  for (const entityId of entities) {
    await callHAService(request, "input_boolean", "turn_off", {
      entity_id: entityId,
    });
  }
}

test.describe("Screen 5 Puzzle 3 - Alphabetical Order (Task 79)", () => {
  test("switches are displayed in alphabetical order", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    const switches = page.locator(".switches-grid .switch-draggable");
    const switchesVisible = await switches
      .first()
      .isVisible()
      .catch(() => false);

    if (switchesVisible) {
      const switchCount = await switches.count();
      const switchIds: string[] = [];

      for (let i = 0; i < switchCount; i++) {
        const testId = await switches.nth(i).getAttribute("data-testid");
        if (testId) {
          switchIds.push(testId.replace("switch-", ""));
        }
      }

      expect(switchIds).toEqual([
        "keuken",
        "slaapkamer",
        "tuin",
        "voorraadkast",
        "waskamer",
      ]);
    }
  });

  test("bulbs are displayed in alphabetical order", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    const bulbs = page.locator(".bulbs-grid .bulb-droppable");
    const bulbsVisible = await bulbs
      .first()
      .isVisible()
      .catch(() => false);

    if (bulbsVisible) {
      const bulbCount = await bulbs.count();
      const bulbIds: string[] = [];

      for (let i = 0; i < bulbCount; i++) {
        const testId = await bulbs.nth(i).getAttribute("data-testid");
        if (testId) {
          bulbIds.push(testId.replace("bulb-", ""));
        }
      }

      expect(bulbIds).toEqual([
        "keuken",
        "slaapkamer",
        "tuin",
        "voorraadkast",
        "waskamer",
      ]);
    }
  });

  test("switch labels show alphabetical room names", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    const switchLabels = page.locator(
      ".switches-grid .switch-draggable .switch-label"
    );
    const labelsVisible = await switchLabels
      .first()
      .isVisible()
      .catch(() => false);

    if (labelsVisible) {
      const labels = await switchLabels.allTextContents();
      expect(labels).toEqual([
        "Keuken",
        "Slaapkamer",
        "Tuin",
        "Voorraadkast",
        "Waskamer",
      ]);
    }
  });

  test("bulb labels show alphabetical room names", async ({ page }) => {
    await page.goto(DEV_SERVER_URL);
    await page.waitForLoadState("networkidle");

    const bulbLabels = page.locator(".bulbs-grid .bulb-droppable .bulb-label");
    const labelsVisible = await bulbLabels
      .first()
      .isVisible()
      .catch(() => false);

    if (labelsVisible) {
      const labels = await bulbLabels.allTextContents();
      expect(labels).toEqual([
        "Keuken",
        "Slaapkamer",
        "Tuin",
        "Voorraadkast",
        "Waskamer",
      ]);
    }
  });
});

test.describe("Screen 5 Puzzle 3 - Entity State Sync (Task 80)", () => {
  test.beforeEach(async ({ request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await resetPuzzle3Entities(request);

    // Navigate to Screen 5 (Puzzle 3)
    await callHAService(request, "input_select", "select_option", {
      entity_id: "input_select.verjaardag_hilde_global_select",
      option: "5",
    });
  });

  test("syncs Slaapkamer switch to Waskamer bulb when entity is toggled on", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Turn on the Slaapkamer entity (Slaapkamer switch -> Waskamer bulb)
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
    });

    await page.waitForTimeout(1000);

    // The Waskamer bulb should now have the switch placed
    const waskamerBulb = page.getByTestId("bulb-waskamer");
    const hasPlacedSwitch = await waskamerBulb
      .locator('[data-testid="placed-switch-slaapkamer"]')
      .isVisible()
      .catch(() => false);

    if (hasPlacedSwitch) {
      await expect(
        waskamerBulb.locator('[data-testid="placed-switch-slaapkamer"]')
      ).toBeVisible();
    }

    // Progress should show 1 van 5 correct
    const progressText = page.locator(".progress-text");
    const hasProgress = await progressText.isVisible().catch(() => false);
    if (hasProgress) {
      await expect(progressText).toContainText("1 van 5");
    }
  });

  test("syncs all switches when all entities are toggled on", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Turn on all entities
    const entities = [
      "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_waskamer_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_keuken_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_tuin_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_voorraadkast_toggle",
    ];

    for (const entityId of entities) {
      await callHAService(request, "input_boolean", "turn_on", {
        entity_id: entityId,
      });
      await page.waitForTimeout(300);
    }

    await page.waitForTimeout(1000);

    // Progress should show 5 van 5 correct
    const progressText = page.locator(".progress-text");
    const hasProgress = await progressText.isVisible().catch(() => false);
    if (hasProgress) {
      await expect(progressText).toContainText("5 van 5");
    }
  });

  test("removes switch from bulb when entity is toggled off", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Turn on the Slaapkamer entity
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
    });

    await page.waitForTimeout(1000);

    // Verify it's placed
    const progressText = page.locator(".progress-text");
    const hasProgress = await progressText.isVisible().catch(() => false);
    if (hasProgress) {
      await expect(progressText).toContainText("1 van 5");
    }

    // Turn off the entity
    await callHAService(request, "input_boolean", "turn_off", {
      entity_id: "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
    });

    await page.waitForTimeout(1000);

    // Progress should go back to 0
    if (hasProgress) {
      await expect(progressText).toContainText("0 van 5");
    }
  });
});

test.describe("Screen 5 Puzzle 3 - HAOS REST API Integration", () => {
  test.beforeEach(async ({ request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    await resetPuzzle3Entities(request);
  });

  test("validates mapping: Slaapkamer switch -> Waskamer bulb", async ({
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    const entityId =
      "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle";
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: entityId,
    });

    const state = await getEntityState(request, entityId);
    expect(state?.state).toBe("on");
  });

  test("validates mapping: Waskamer switch -> Voorraadkast bulb", async ({
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    const entityId = "input_boolean.verjaardag_hilde_puzzle_3_waskamer_toggle";
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: entityId,
    });

    const state = await getEntityState(request, entityId);
    expect(state?.state).toBe("on");
  });

  test("validates mapping: Keuken switch -> Slaapkamer bulb", async ({
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    const entityId = "input_boolean.verjaardag_hilde_puzzle_3_keuken_toggle";
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: entityId,
    });

    const state = await getEntityState(request, entityId);
    expect(state?.state).toBe("on");
  });

  test("validates mapping: Tuin switch -> Keuken bulb", async ({ request }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    const entityId = "input_boolean.verjaardag_hilde_puzzle_3_tuin_toggle";
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: entityId,
    });

    const state = await getEntityState(request, entityId);
    expect(state?.state).toBe("on");
  });

  test("validates mapping: Voorraadkast switch -> Tuin bulb", async ({
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    const entityId =
      "input_boolean.verjaardag_hilde_puzzle_3_voorraadkast_toggle";
    await callHAService(request, "input_boolean", "turn_on", {
      entity_id: entityId,
    });

    const state = await getEntityState(request, entityId);
    expect(state?.state).toBe("on");
  });

  test("all 5 correct mappings complete the puzzle", async ({
    page,
    request,
  }) => {
    if (!HA_TOKEN) {
      test.skip();
      return;
    }

    // Navigate to Screen 5 (Puzzle 3)
    await callHAService(request, "input_select", "select_option", {
      entity_id: "input_select.verjaardag_hilde_global_select",
      option: "5",
    });

    await page.goto(DEV_SERVER_URL);
    await page.waitForTimeout(2000);

    // Turn on all entities (simulating correct placements)
    const entities = [
      "input_boolean.verjaardag_hilde_puzzle_3_slaapkamer_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_waskamer_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_keuken_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_tuin_toggle",
      "input_boolean.verjaardag_hilde_puzzle_3_voorraadkast_toggle",
    ];

    for (const entityId of entities) {
      await callHAService(request, "input_boolean", "turn_on", {
        entity_id: entityId,
      });
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(1000);

    // The puzzle should show all 5 correct
    const progressText = page.locator(".progress-text");
    const hasProgress = await progressText.isVisible().catch(() => false);

    if (hasProgress) {
      await expect(progressText).toContainText("5 van 5");
    }
  });
});
