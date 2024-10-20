import { test as base, expect, chromium } from "@playwright/test";
import {
  signUpUser,
  createSpot,
  logOutUser,
  createReview,
  createUniqueUser,
  createSpotAndSingleReview,
  createSpotAndMultiReviews,
  encapsulateSpotCreation,
  createSpotAndNoReview,
} from "./utils";
import { SPOT_DETAIL_PAGE_TILE_LOCATOR, SPOT_DETAIL_PAGE_LOCATION_LOCATOR, SPOT_DETAIL_PAGE_RATING_LOCATOR, SPOT_DETAIL_PAGE_CITY_LOCATOR, SPOT_CALLOUT_BOX_LOCATOR, REVIEW_LIST_LOCATOR, REVIEW_ITEM_LOCATOR, REVIEW_DATE_LOCATOR, REVIEW_COUNT_LOCATOR, REVIEW_HEADING_LOCATOR } from './contants';
const test = base.extend({
  context: async ({}, use) => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    await use(context);
    await context.close();
    await browser.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});
test.describe("Feature: view-rating-and-reviews", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL);
  });

  test("When viewing the home page, each spot tile in the tile list must show the average star rating for that spot immediately below the thumbnail of the tile and to the right of the spot's city & state. The average star rating should have a star icon followed by the average star rating of all the reviews for that spot as a decimal (e.g. 3.0 or 4.89, NOT 3 or 5)", async ({
    page,
  }) => {
    await page.goto(process.env.STUDENT_URL);
    const spotTile = page.getByTestId(SPOT_DETAIL_PAGE_TILE_LOCATOR).first();
    const ratingElement = spotTile.getByTestId(SPOT_DETAIL_PAGE_RATING_LOCATOR);
    await expect(ratingElement).toBeVisible();
    const ratingText = await ratingElement.textContent();
    expect(
      ratingText?.match(/New/i) || !isNaN((parseFloat(ratingText)))
    ).toBeTruthy();

    const locationElement = spotTile.getByTestId(SPOT_DETAIL_PAGE_CITY_LOCATOR);
    const ratingBox = await ratingElement.boundingBox();
    const locationBox = await locationElement.boundingBox();
    expect(ratingBox?.y).toBeGreaterThanOrEqual(locationBox?.y);
    expect(ratingBox?.x).toBeGreaterThanOrEqual(locationBox?.x);
  });

  test("When viewing a spot's detail page, the review summary info should be in two different places, the callout information box and the heading before the list of reviews. The review summary info should show the average star rating of all the reviews for that spot and the review count for that spot", async ({
    page,
  }) => {

    await createSpotAndSingleReview(page);
    const calloutBox = page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR);
    const reviewHeading = page.getByTestId(REVIEW_HEADING_LOCATOR);

    for (const element of [calloutBox, reviewHeading]) {
      const ratingElement = element.getByTestId(SPOT_DETAIL_PAGE_RATING_LOCATOR);
      const reviewCountElement = element.getByTestId(REVIEW_COUNT_LOCATOR);

      await expect(ratingElement).toBeVisible();
      await expect(reviewCountElement).toBeVisible();
    }
  });

  test("The average star rating in the spot's detail page should have a star icon followed by the average star rating of all the reviews for that spot as a decimal (e.g. 3.0 or 4.89, NOT 3 or 5)", async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await logOutUser(page);
    await page.waitForTimeout(1000);
    await createReview(page);
    await page.waitForTimeout(2000);
    const calloutBox = await page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR);
    const reviewHeading = await page.getByTestId(REVIEW_HEADING_LOCATOR);

    // TODO: Add check for star icon
    // Free points for now

    for (const element of [calloutBox, reviewHeading]) {
      const ratingText = await element.getByTestId(SPOT_DETAIL_PAGE_RATING_LOCATOR).textContent();
      expect(ratingText).toMatch(/\b\d\.\d/);
    }
  });

  test('If there are no reviews for the spot, the text, "New", should be next to the star icon instead.', async ({
    page,
  }) => {
    const dummyData = createUniqueUser();
    await encapsulateSpotCreation(page, dummyData);
    await expect(
      page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR).getByRole("paragraph")
    ).toContainText("New");
    await expect(page.getByTestId(REVIEW_HEADING_LOCATOR)).toContainText("New");
    // TODO: Add check for star icon
    // Free points for now!
  });

  test("The review count on the spot's detail page should be an integer representing the total number of reviews for that spot followed by the text 'Reviews' (e.g. '4 Reviews')", async ({
    page,
  }) => {
    await createSpotAndMultiReviews(page);
    await page.waitForTimeout(2000);
    await expect(
      page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR).getByTestId(REVIEW_COUNT_LOCATOR)
    ).toContainText("2 Reviews");
    await expect(
      page.getByTestId(REVIEW_HEADING_LOCATOR).getByTestId(REVIEW_COUNT_LOCATOR)
    ).toContainText("2 Reviews");
  });

  test('If the review count is 1, it should show "1 Review" (not "1 Reviews").', async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    await expect(
      page.getByTestId(REVIEW_HEADING_LOCATOR).getByTestId(REVIEW_COUNT_LOCATOR)
    ).toContainText("1 Review");
    await expect(
      page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR).getByTestId(REVIEW_COUNT_LOCATOR)
    ).toContainText("1 Review");
  });

  test("There should be a centered dot (·) between the star rating and the review count", async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    let reviewHeading = await page.getByTestId(REVIEW_HEADING_LOCATOR);
     await expect(reviewHeading).toContainText(
      /Review/
    );
    await expect(reviewHeading).toContainText(
      /\b\d\.\d/
    );

    let spotCalloutBox = await page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR);
    expect(spotCalloutBox).toContainText(
      /Review/
    );
    await expect(spotCalloutBox).toContainText(
      /\b\d\.\d/
    );
  });

  test('If the review count is zero (there are no reviews yet for this spot), it should not show the centered dot or the review count (only the star icon and "New" should be displayed)', async ({
    page,
  }) => {
    const dummyData = createUniqueUser();
    await encapsulateSpotCreation(page, dummyData);
    await page.waitForTimeout(1000);
    await expect(
      page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR).getByRole("paragraph")
    ).not.toContainText("Review");
    await expect(page.getByTestId(REVIEW_HEADING_LOCATOR)).not.toContainText(
      "Review"
    );
  });

  test("Need a Test: When viewing the spot's detail page, show a list of the reviews for the spot below the spot's information with the newest reviews at the top, and the oldest reviews at the bottom.", async ({
    page,
  }) => {
    const reviewsList = await page.getByTestId(REVIEW_LIST_LOCATOR);
    const reviews = await reviewsList.getByTestId(REVIEW_ITEM_LOCATOR).all();

    for (let i = 1; i < reviews.length; i++) {
      const prevReviewDate = await reviews[i - 1]
        .getByTestId(REVIEW_DATE_LOCATOR)
        .textContent();
      const currReviewDate = await reviews[i]
        .getByTestId(REVIEW_DATE_LOCATOR)
        .textContent();
      expect(new Date(prevReviewDate).getTime()).toBeGreaterThan(
        new Date(currReviewDate).getTime()
      );
    }
  });

  test("Each review in the review list must include: The reviewer's first name, the month and the year that the review was posted (e.g. December 2022), and the review comment text.", async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    await page.getByTestId(REVIEW_LIST_LOCATOR).first();

    await expect(
      page.getByTestId(REVIEW_LIST_LOCATOR).first().getByText(/Fakey/)
    ).toBeVisible();
    await expect(
      page.getByTestId(REVIEW_LIST_LOCATOR).first().getByText("October")
    ).toBeVisible();
  });

  test('If no reviews have been posted yet and the current user is logged-in and is NOT the owner of the spot, replace the reviews list with the text "Be the first to post a review!"', async ({
    page,
  }) => {
    await createSpotAndNoReview(page);
    await expect(
      page.getByText("Be the first to post a review!")
    ).toBeVisible();
  });

  test("The layout and element positioning is equivalent to the wireframes.", async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    const spotInfo = await page.getByTestId(SPOT_DETAIL_PAGE_LOCATION_LOCATOR).boundingBox();
    const reviewsSection = await page.getByTestId(REVIEW_LIST_LOCATOR).boundingBox();
    expect(reviewsSection?.y).toBeGreaterThan(
      spotInfo?.y + spotInfo?.height
    );

    const calloutBox = await page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR).boundingBox();
    const viewportSize = await page.viewportSize();
    expect(calloutBox?.x + calloutBox?.width).toBeCloseTo(
      viewportSize?.width,
      -3
    );

    const reviewHeading = await page
      .getByTestId(REVIEW_HEADING_LOCATOR)
      .boundingBox();
    const reviewsList = await page.getByTestId(REVIEW_LIST_LOCATOR).boundingBox();
    expect(reviewsList?.y).toBeGreaterThanOrEqual(
      reviewHeading?.y + reviewHeading?.height
    );
  });
});
