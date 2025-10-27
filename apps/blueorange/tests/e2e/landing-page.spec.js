import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("Scenario 1: Landing page display", async ({ page }) => {
    await page.goto("/");

    // Assert logo visible
    const logo = page.locator("img.logo");
    await expect(logo).toBeVisible();

    // Assert input field visible and focused
    const input = page.locator("#secret-input");
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    // Assert submit button visible and disabled
    const button = page.locator("#submit-btn");
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("Scenario 2: Submit button state", async ({ page }) => {
    await page.goto("/");

    const input = page.locator("#secret-input");
    const button = page.locator("#submit-btn");

    // Type 1 character → button disabled
    await input.fill("s");
    await expect(button).toBeDisabled();

    // Type 4 more characters (total 5) → button enabled
    await input.fill("sorry");
    await expect(button).toBeEnabled();

    // Delete 1 character (total 4) → button disabled
    await input.fill("sorr");
    await expect(button).toBeDisabled();
  });

  test("Scenario 3: Valid secret entry", async ({ page }) => {
    await page.goto("/");

    const input = page.locator("#secret-input");
    const button = page.locator("#submit-btn");

    // Type "sorry" → button enabled
    await input.fill("sorry");
    await expect(button).toBeEnabled();

    // Click button → redirects to countdown page
    await button.click();
    await expect(page).toHaveURL(/countdown\.html$/);
  });

  test("Scenario 4: Invalid secret entry", async ({ page }) => {
    await page.goto("/");

    const input = page.locator("#secret-input");
    const button = page.locator("#submit-btn");
    const errorMsg = page.locator("#error-msg");

    // Type "Sorry" → button enabled
    await input.fill("Sorry");
    await expect(button).toBeEnabled();

    // Click button → error message visible
    await button.click();
    await expect(errorMsg).toBeVisible();

    // Assert still on landing page (no redirect)
    await expect(page).toHaveURL(/landing\.html$/);
  });
});
