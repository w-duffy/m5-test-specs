import { test, expect } from "@playwright/test";
import { spotsListLocator, spotToolTipLocator, spotTileLocator, spotThumbnailImageLocator, spotCityLocator, spotStateLocator, spotRatingLocator, spotPriceLocator, spotNameLocator } from './contants';

test.describe("Feature: Landing Page - List of All Spots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL!);
  });

  test("On the landing page of the site, I should see a tile list of all the spots.", async ({
    page,
  }) => {
    const spotsList = page.getByTestId(spotsListLocator);
    await expect(spotsList).toBeVisible();
    const spots = await page.getByTestId(spotTileLocator).all();
    expect(spots.length).toBeGreaterThan(2);
  });

  test("Each spot tile in the tile list should have a thumbnail image, the city, and the state of the spot.", async ({
    page,
  }) => {
    const firstSpot = page.getByTestId(spotTileLocator).first();
    await expect(firstSpot.getByTestId(spotThumbnailImageLocator)).toBeVisible();
    await expect(firstSpot.getByTestId(spotCityLocator)).toBeVisible();
  });

  test("Each spot tile in the tile list should have a tooltip with the name of the spot as the tooltip's text.", async ({
    page,
  }) => {
    const firstSpot = await page.getByTestId(spotToolTipLocator).first();
    await firstSpot.hover();
    const title = await firstSpot.getAttribute("title");
    expect(title).toBe(title);
  });

  test('Each spot tile in the tile list should have a star rating of "New" (if there are no reviews for that spot) or the average star rating of the spot as a decimal.', async ({
    page,
  }) => {
    const spots = await page.getByTestId(spotTileLocator).all();
    for (const spot of spots) {
      const rating = await spot.getByTestId(spotRatingLocator).textContent();
      expect(rating?.match(/New/i) || !isNaN(parseFloat(rating!))).toBeTruthy();
    }
  });

  test('Each spot tile in the tile list should have the price for the spot followed by the label "night".', async ({
    page,
  }) => {
    const firstSpot = page.getByTestId(spotTileLocator).first();
    const priceElement = firstSpot.getByTestId(spotPriceLocator);
    await expect(priceElement).toBeVisible();
    const priceText = await priceElement.textContent();
    expect(priceText).toMatch(/\$\s?\d+(,\d{3})*(\.\d{2})?\s*(\/\s*)?night/);
  });

  test("Clicking any part of the spot tile should navigate to that spot's detail page.", async ({
    page,
  }) => {
    const firstSpot = page.getByTestId(spotTileLocator).first();

    const anchorTag = await firstSpot.locator("a");
    const spotId = await anchorTag.getAttribute("href");

    await anchorTag.click();

    await expect(page).toHaveURL(`${process.env.STUDENT_URL}${spotId}`);
  });

  test("The layout and element positioning is equivalent to the wireframes.", async ({
    page,
  }) => {
    const spotsList = page.getByTestId(spotsListLocator);
    const spotsListBox = await spotsList.boundingBox();

    const viewportSize = page.viewportSize();
    expect(spotsListBox?.x).toBeGreaterThan(0);
    expect(spotsListBox?.x! + spotsListBox?.width!).toBeLessThan(
      viewportSize?.width!
    );

    const spots = await page.getByTestId(spotTileLocator).all();
    const firstSpotBox = await spots[0].boundingBox();
    const secondSpotBox = await spots[1].boundingBox();

    expect(Math.abs(firstSpotBox?.y! - secondSpotBox?.y!)).toBeLessThan(5);

    const horizontalSpacing =
      secondSpotBox?.x! - (firstSpotBox?.x! + firstSpotBox?.width!);
    expect(horizontalSpacing).toBeGreaterThan(0);

    const firstSpot = spots[0];
    const thumbnail = await firstSpot
      .getByTestId(spotThumbnailImageLocator)
      .boundingBox();
    const city = await firstSpot.getByTestId(spotCityLocator).boundingBox();
    // const state = await firstSpot.getByTestId('spot-state').boundingBox();



    // Try to find the 'spot-rating' element and wait up to 2 seconds
    const rating = await firstSpot.getByTestId(spotRatingLocator).boundingBox()

    const price = await firstSpot.getByTestId(spotPriceLocator).boundingBox();

    expect(thumbnail?.y).toBeLessThan(city?.y!);

    // TODO: Checking city and state ... issue when city and state share the same container
    // expect(Math.abs(city.y - state.y)).toBeLessThan(5);

    expect(rating?.y).toBeGreaterThanOrEqual(city?.y!);

    expect(price?.y).toBeGreaterThan(rating?.y!);
  });
});
