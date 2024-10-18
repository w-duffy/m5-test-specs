import { test, expect } from "@playwright/test";
import { createSpot, signUpUser } from "./utils";
import { SPOT_TILE_LOCATOR, SPOT_NAME_LOCATOR, SPOT_PRICE_LOCATOR, SPOT_DESCRIPTION_LOCATOR } from './contants';
function generateUniqueSpotName() {
  const letters = Array.from({ length: 6 }, () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  ).join("");
  const numbers = Math.floor(Math.random() * 9000) + 1000;
  const timestamp = Date.now();
  return `${letters}${numbers}${timestamp}`;
}
test.describe("Feature: Update a Spot", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL);
  });

  test('Clicking "Update" on one of the spot tiles on the spot management page navigates the user to the update spot form which looks like the same as the create a new spot form, but pre-populated with the values stored in the database for the spot that was clicked, the title changed to "Update your Spot", and with a submit button text of "Update your Spot". Image URL inputs on the update spot form are optional for MVP.', async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    await page
      .getByTestId(SPOT_TILE_LOCATOR)
      .first()
      .getByRole("button", { name: "Update" })
      .click();

    await expect(page).toHaveURL(/\/spots\/\d+\/edit$/);

    await expect(
      page.getByRole("heading", { name: "Update your Spot" })
    ).toBeVisible();

    await expect(page.getByPlaceholder(/Name of your spot/i)).toHaveValue(/./);
    await expect(page.getByPlaceholder(/Price per night \(USD\)/i)).toHaveValue(
      /./
    );
    await expect(
      page.getByPlaceholder(/Please write at least 30 characters/i)
    ).toHaveValue(/./);

    await expect(
      page.getByRole("button", { name: "Update your Spot" })
    ).toBeVisible();
  });

  test("When the update form submission is successful, the user is navigated to the updated spot's details page.", async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);
    const name = generateUniqueSpotName();

    await page
      .getByTestId(SPOT_TILE_LOCATOR)
      .first()
      .getByRole("button", { name: "Update" })
      .click();

    await page
      .getByPlaceholder(/Name of your spot/i)
      .fill(`Updated Name ${name}`);

    await page.getByRole("button", { name: "Update your Spot" }).click();

    await expect(page).toHaveURL(/\/spots\/\d+$/);

    await expect(page.getByTestId(SPOT_NAME_LOCATOR)).toContainText(
      `Updated Name ${name}`
    );
  });

  test("The updated spot's detail page should display the updated information. No refresh should be necessary.", async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    await page
      .getByTestId(SPOT_TILE_LOCATOR)
      .first()
      .getByRole("button", { name: "Update" })
      .click();
    const name = generateUniqueSpotName();

    await page
      .getByPlaceholder(/Name of your spot/i)
      .fill(`Updated Spot ${name}`);
    await page.getByPlaceholder(/Price per night \(USD\)/i).fill("150");
    await page
      .getByPlaceholder(/Please write at least 30 characters/i)
      .fill("This is an updated description.");

    await page.getByRole("button", { name: "Update your Spot" }).click();

    await expect(page.getByTestId(SPOT_NAME_LOCATOR)).toContainText(
      `Updated Spot ${name}`
    );
    await expect(page.getByTestId(SPOT_PRICE_LOCATOR)).toContainText("$150");
    await expect(page.getByTestId(SPOT_DESCRIPTION_LOCATOR)).toContainText(
      "This is an updated description."
    );
  });

  test("The layout and element positioning is equivalent to the wireframes.", async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);
    await page
      .getByTestId(SPOT_TILE_LOCATOR)
      .first()
      .getByRole("button", { name: "Update" })
      .click();

    const title = await page
      .getByRole("heading", { name: "Update your Spot" })
      .boundingBox();
    const countryInput = await page.getByPlaceholder(/Country/i).boundingBox();
    const submitButton = await page
      .getByRole("button", { name: "Update your Spot" })
      .boundingBox();

    expect(title?.y).toBeLessThan(countryInput?.y);
    expect(countryInput?.y).toBeLessThan(submitButton?.y);
  });
});
