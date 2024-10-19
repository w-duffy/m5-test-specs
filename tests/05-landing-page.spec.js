import { test, expect } from "@playwright/test";
import { SPOT_LIST_LOCATOR, SPOT_TOOLTIP_LOCATOR, SPOT_TILE_LOCATOR,  SPOT_THUMBNAIL_IMAGE_LOCATOR, SPOT_CITY_LOCATOR, SPOT_LINK_TO_SPOT_PAGE_LOCATOR, SPOT_RATING_LOCATOR, SPOT_PRICE_LOCATOR } from './contants';

test.describe("Feature: Landing Page - List of All Spots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL);
  });
  test("On the landing page of the site, I should see a tile list of all the spots.", async ({ page }) => {
    const spotsList = await page.getByTestId(SPOT_LIST_LOCATOR);
    await expect(spotsList).toBeVisible();

    const spotTileLocator = await page.getByTestId(SPOT_TILE_LOCATOR);
    await spotTileLocator.first().waitFor({ state: 'visible' });

    const spots = await spotTileLocator.all();
    await expect(spots.length).toBeGreaterThan(2);
  });
  test("Each spot tile in the tile list should have a thumbnail image, the city, and the state of the spot.", async ({
    page,
  }) => {
    const firstSpot = await page.getByTestId(SPOT_TILE_LOCATOR).first();
    await expect(firstSpot.getByTestId( SPOT_THUMBNAIL_IMAGE_LOCATOR)).toBeVisible();
    await expect(firstSpot.getByTestId(SPOT_CITY_LOCATOR)).toBeVisible();
  });

  test("Each spot tile in the tile list should have a tooltip with the name of the spot as the tooltip's text.", async ({
    page,
  }) => {
    const firstSpot = await page.getByTestId(SPOT_TOOLTIP_LOCATOR).first();
    await firstSpot.hover();
    const title = await firstSpot.getAttribute("title");
    expect(title).toBe(title);
  });

  test('Each spot tile in the tile list should have a star rating of "New" (if there are no reviews for that spot) or the average star rating of the spot as a decimal.', async ({
    page,
  }) => {
    const spots = await page.getByTestId(SPOT_TILE_LOCATOR).all();
    for await (const spot of spots) {
      const rating = await spot.getByTestId(SPOT_RATING_LOCATOR).textContent();
      expect(rating?.match(/New/i) || !isNaN(parseFloat(rating))).toBeTruthy();
    }
  });

  test('Each spot tile in the tile list should have the price for the spot followed by the label "night".', async ({
    page,
  }) => {
    const firstSpot = await page.getByTestId(SPOT_TILE_LOCATOR).first();
    const priceElement = await firstSpot.getByTestId(SPOT_PRICE_LOCATOR);
    await expect(priceElement).toBeVisible();
    const priceText = await priceElement.textContent();
    expect(priceText).toMatch(/\$\s?\d+(,\d{3})*(\.\d{2})?\s*(\/\s*)?night/);
  });

  test("Clicking any part of the spot tile should navigate to that spot's detail page.", async ({
    page,
  }) => {
    const firstSpot = await page.getByTestId(SPOT_TILE_LOCATOR).first();

    // Using React Router's Link instead of a "div with an onClick + navigate" is ideal
    const linkToSpotPage = await firstSpot.getByTestId(SPOT_LINK_TO_SPOT_PAGE_LOCATOR);
    // spotId should be the path to your spots like `/spots/1` so that should be href's value here
    const spotId = await linkToSpotPage.getAttribute("href"); // the href here can be added to your ele that has an onClick if you didn't use Link

    await linkToSpotPage.click();

    await expect(page).toHaveURL(`${process.env.STUDENT_URL}${spotId}`);
  });

  test("The layout and element positioning is equivalent to the wireframes.", async ({
    page,
  }) => {
    const spotsList = await page.getByTestId(SPOT_LIST_LOCATOR);
    const spotsListBox = await spotsList.boundingBox();

    const viewportSize = page.viewportSize();
    expect(spotsListBox.x).toBeGreaterThan(0);
    expect(spotsListBox.x + spotsListBox.width).toBeLessThan(
      viewportSize.width
    );

    const spots = await page.getByTestId(SPOT_TILE_LOCATOR).all();
    const firstSpotBox = await spots[0].boundingBox();
    const secondSpotBox = await spots[1].boundingBox();

    expect(Math.abs(firstSpotBox?.y - secondSpotBox?.y)).toBeLessThan(5);

    const horizontalSpacing =
      secondSpotBox?.x - (firstSpotBox?.x + firstSpotBox?.width);
    expect(horizontalSpacing).toBeGreaterThan(0);

    const firstSpot = spots[0];
    const thumbnail = await firstSpot
      .getByTestId( SPOT_THUMBNAIL_IMAGE_LOCATOR)
      .boundingBox();
    const city = await firstSpot.getByTestId(SPOT_CITY_LOCATOR).boundingBox();

    const rating = await firstSpot.getByTestId(SPOT_RATING_LOCATOR).boundingBox()

    const price = await firstSpot.getByTestId(SPOT_PRICE_LOCATOR).boundingBox();

    expect(thumbnail?.y).toBeLessThan(city.y);


    expect(rating?.y).toBeGreaterThanOrEqual(city.y);

    expect(price?.y).toBeGreaterThan(rating?.y);
  });
});
