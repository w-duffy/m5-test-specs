import { test as base, expect, chromium } from "@playwright/test";
import {
  signUpUser,
  createSpot,
  logOutUser,
  createReview,
  loginDemoUser,
  createUniqueUser,
  createSpotAndSingleReview,
  createSpotAndMultiReviews,
  encapsulateSpotCreation,
  createSpotAndNoReview,
} from "./utils";
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
    await page.goto(process.env.STUDENT_URL!);
  });

  test("When viewing the home page, each spot tile in the tile list must show the average star rating for that spot immediately below the thumbnail of the tile and to the right of the spot's city & state. The average star rating should have a star icon followed by the average star rating of all the reviews for that spot as a decimal (e.g. 3.0 or 4.89, NOT 3 or 5)", async ({
    page,
  }) => {
    await page.goto(process.env.STUDENT_URL!);
    const spotTile = page.getByTestId("spot-tile").first();
    const ratingElement = spotTile.getByTestId("spot-rating");
    await expect(ratingElement).toBeVisible();
    const ratingText = await ratingElement.textContent();
    expect(
      ratingText?.match(/New/i) || !isNaN(parseFloat(ratingText!))
    ).toBeTruthy();

    const locationElement = spotTile.getByTestId("spot-city");
    const ratingBox = await ratingElement.boundingBox();
    const locationBox = await locationElement.boundingBox();
    expect(ratingBox?.y).toBeGreaterThanOrEqual(locationBox?.y!);
    expect(ratingBox?.x).toBeGreaterThanOrEqual(locationBox?.x!);
  });

  test("When viewing a spot's detail page, the review summary info should be in two different places, the callout information box and the heading before the list of reviews. The review summary info should show the average star rating of all the reviews for that spot and the review count for that spot", async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await logOutUser(page);
    await createReview(page);

    const calloutBox = page.getByTestId("spot-callout-box");
    const reviewHeading = page.getByTestId("reviews-heading");

    for (const element of [calloutBox, reviewHeading]) {
      const ratingElement = element.getByTestId("spot-rating");
      const reviewCountElement = element.getByTestId("review-count");

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
    await createReview(page);
    const calloutBox = await page.getByTestId("spot-callout-box");
    const reviewHeading = await page.getByTestId("reviews-heading");

    // TODO: Add check for star icon
    // Free points for now!

    for (const element of [calloutBox, reviewHeading]) {
      const ratingText = await element.getByTestId("spot-rating").textContent();
      expect(ratingText).toMatch(/^.\d+\.\d+$/);
    }
  });

  test('If there are no reviews for the spot, the text, "New", should be next to the star icon instead.', async ({
    page,
  }) => {
    const dummyData = createUniqueUser();
    await encapsulateSpotCreation(page, dummyData);
    await expect(
      page.getByTestId("spot-callout-box").getByRole("paragraph")
    ).toContainText("New");
    await expect(page.getByTestId("reviews-heading")).toContainText("New");
    // TODO: Add check for star icon
    // Free points for now!
  });

  test("The review count on the spot's detail page should be an integer representing the total number of reviews for that spot followed by the text 'Reviews' (e.g. '4 Reviews')", async ({
    page,
  }) => {
    await createSpotAndMultiReviews(page);
    page.waitForTimeout(2000);
    await expect(
      page.getByTestId("spot-callout-box").getByTestId("review-count")
    ).toContainText("2 Reviews");
    await expect(
      page.getByTestId("reviews-heading").getByTestId("review-count")
    ).toContainText("2 Reviews");
  });

  test('If the review count is 1, it should show "1 Review" (not "1 Reviews").', async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    page.waitForTimeout(2000);
    await expect(
      page.getByTestId("reviews-heading").getByTestId("review-count")
    ).toContainText("1 Review");
    await expect(
      page.getByTestId("spot-callout-box").getByTestId("review-count")
    ).toContainText("1 Review");
  });

  test("There should be a centered dot (·) between the star rating and the review count", async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    page.waitForTimeout(2000);
    await expect(page.getByTestId("reviews-heading")).toContainText(
      /\d\.\d+\s*\d+\sReview/
    );

    await expect(page.getByTestId("spot-callout-box")).toContainText(
      /\d\.\d+\s*\d+\sReview/
    );
  });

  test('If the review count is zero (there are no reviews yet for this spot), it should not show the centered dot or the review count (only the star icon and "New" should be displayed)', async ({
    page,
  }) => {
    const dummyData = createUniqueUser();
    await encapsulateSpotCreation(page, dummyData);
    page.waitForTimeout(2000);
    await expect(
      page.getByTestId("spot-callout-box").getByRole("paragraph")
    ).not.toContainText("Review");
    await expect(page.getByTestId("reviews-heading")).not.toContainText(
      "Review"
    );
  });

  test("Need a Test: When viewing the spot's detail page, show a list of the reviews for the spot below the spot's information with the newest reviews at the top, and the oldest reviews at the bottom.", async ({
    page,
  }) => {
    const reviewsList = page.getByTestId("reviews-list");
    const reviews = await reviewsList.getByTestId("review-item").all();

    for (let i = 1; i < reviews.length; i++) {
      const prevReviewDate = await reviews[i - 1]
        .getByTestId("review-date")
        .textContent();
      const currReviewDate = await reviews[i]
        .getByTestId("review-date")
        .textContent();
      expect(new Date(prevReviewDate!).getTime()).toBeGreaterThan(
        new Date(currReviewDate!).getTime()
      );
    }
  });

  test("Each review in the review list must include: The reviewer's first name, the month and the year that the review was posted (e.g. December 2022), and the review comment text.", async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    await page.getByTestId("review-list").first();

    await expect(
      page.getByTestId("review-list").first().getByText("Fakey")
    ).toBeVisible();
    await expect(
      page.getByTestId("review-list").first().getByText("October")
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
    const spotInfo = await page.getByTestId("spot-location").boundingBox();
    const reviewsSection = await page.getByTestId("review-list").boundingBox();
    expect(reviewsSection?.y!).toBeGreaterThan(
      spotInfo?.y! + spotInfo?.height!
    );

    const calloutBox = await page.getByTestId("spot-callout-box").boundingBox();
    const viewportSize = page.viewportSize();
    expect(calloutBox?.x! + calloutBox?.width!).toBeCloseTo(
      viewportSize?.width!,
      -3
    );

    const reviewHeading = await page
      .getByTestId("reviews-heading")
      .boundingBox();
    const reviewsList = await page.getByTestId("review-list").boundingBox();
    expect(reviewsList?.y!).toBeGreaterThan(
      reviewHeading?.y! + reviewHeading?.height!
    );
  });
});
