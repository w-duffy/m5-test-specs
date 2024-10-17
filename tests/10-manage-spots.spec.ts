import { test, expect } from "@playwright/test";
import { createSpot, signUpUser } from "./utils";

test.describe("Feature: Manage Spots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL!);
  });

  test('When opening the user drop down menu and selecting "Manage Spots", it should navigate the user to the spot management page which shows the the list of all the spots created by the user.', async ({ page }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/`);
    await page.getByTestId('user-menu-button').click();
    await page.getByTestId('manage-spots-link').click()
    await page.mouse.click(0, 0);

    await expect(page).toHaveURL(`${process.env.STUDENT_URL!}/spots/current`);
    await expect(page.getByTestId('user-spots')).toBeVisible();
  });

  test('The spot management page should contain a heading with the text "Manage Spots".', async ({ page }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    const heading = page.getByRole('heading', { name: 'Manage Spots' });
    await expect(heading).toBeVisible();
  });

  test('If no spots have been posted yet by the user, show a "Create a New Spot" link, which links to the new spot form page, instead of the spot list.', async ({ page }) => {
    await signUpUser(page);
    await page.getByRole('link', { name: 'Create a New Spot' }).click();

    await page.getByTestId('user-menu-button').click();
    await page.getByTestId('manage-spots-link').click();
    await expect(page.getByRole('button', { name: 'Create a New Spot' }).getByRole('link')).toBeVisible();
    await page.getByRole('button', { name: 'Create a New Spot' }).getByRole('link').click()
    await expect(page).toHaveURL(`${process.env.STUDENT_URL}/spots/new`);
  });

  test('The spot management page should contain a spot tile list similar to the one in the landing page (thumbnail image, location, rating, price).', async ({ page }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    const spotTile = page.getByTestId("spot-tile").first();
    await expect(spotTile.getByTestId("spot-thumbnail-image")).toBeVisible();
    await expect(spotTile.getByTestId("spot-city")).toBeVisible();
    await expect(spotTile.getByTestId("spot-rating")).toBeVisible();
    await expect(spotTile.getByTestId("spot-price")).toBeVisible();
  });

  test('Each spot in the spot tile list on the spot management page should contain an additional two buttons, "Update" and "Delete" buttons, below the city and state.', async ({ page }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    const spotTile = page.getByTestId("spot-tile").first();
    const updateButton = spotTile.getByRole('button', { name: 'Update' });
    const deleteButton = spotTile.getByRole('button', { name: 'Delete' });

    await expect(updateButton).toBeVisible();
    await expect(deleteButton).toBeVisible();

    const locationBox = await spotTile.getByTestId("spot-city").boundingBox();
    const updateBox = await updateButton.boundingBox();

    expect(updateBox?.y).toBeGreaterThan(locationBox?.y! + locationBox?.height!);
  });

  test('Clicking any part of the spot tile should navigate to that spot\'s detail page.', async ({ page }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    const spotTile = page.getByTestId("spot-tile").first();
    const anchorTag = await spotTile.locator("a").first();
    const spotId = await anchorTag.getAttribute("href");
    // await page.getByTestId("spot-link").first().click();

    await spotTile.click();

    await expect(page).toHaveURL(`${process.env.STUDENT_URL}${spotId}`);
  });

  test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {
    await signUpUser(page);
    await createSpot(page);
    await page.goto(`${process.env.STUDENT_URL}/spots/current`);

    const heading = await page.getByRole('heading', { name: 'Manage Spots' }).boundingBox();
    const spotList = await page.getByTestId("user-spots").boundingBox();
    const firstSpotTile = await page.getByTestId("spot-tile").first().boundingBox();

    expect(heading?.y).toBeLessThan(spotList?.y!);
    expect(spotList?.y).toBeLessThan(firstSpotTile?.y!);
  });
});
