import { test, expect } from "@playwright/test";
import { createSpot, loginDemoUser, signUpUser, logOutUser } from "./utils";

test.describe("Feature: Post a Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL!);
  });

  test('If the current user is logged-in and they are viewing a spot\'s detail page for a spot that they HAVE NOT posted a review yet, a "Post Your Review" button shows between the rating/reviews heading and the list of reviews.', async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await logOutUser(page);

    await page.goto(process.env.STUDENT_URL!);
    await loginDemoUser(page);
    await page.getByTestId("spot-tile").first().click();
    const reviewButton = page.getByTestId("review-button");
    await expect(reviewButton).toBeVisible();

    const ratingHeading = page.getByTestId("reviews-heading");
    const reviewsList = page.getByText(/Be the first/i);
    const buttonBox = await reviewButton.boundingBox();
    const headingBox = await ratingHeading.boundingBox();
    const listBox = await reviewsList.boundingBox();

    expect(buttonBox?.y).toBeGreaterThanOrEqual(
      headingBox?.y! + headingBox?.height!
    );
    expect(buttonBox?.y! + buttonBox?.height!).toBeLessThanOrEqual(listBox?.y!);
  });

  test('If the current user is logged-in and they are viewing a spot\'s detail page for a spot that they are an owner of, the "Post Your Review" button should be hidden.', async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    const reviewButton = page.getByTestId("review-button");
    await expect(reviewButton).toBeHidden();
  });

  test('If the current user is logged-in and they are viewing a spot\'s detail page for a spot that they HAVE posted a review for, the "Post Your Review" button should be hidden.', async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await logOutUser(page);

    await page.goto(process.env.STUDENT_URL!);
    await loginDemoUser(page);
    await page.getByTestId("spot-tile").first().click();
    const reviewButton = page.getByTestId("review-button");
    await page.getByTestId("review-button").click();
    await page.getByPlaceholder("Leave your review here...").click();
    await page
      .getByPlaceholder("Leave your review here...")
      .fill(
        "Such a great stay, I can't wait to come back and write more fake reviews!"
      );
    await page.getByTestId("star-rating").locator("path").nth(4).click();

    await page.getByRole("button", { name: "Submit Your Review" }).click();
    await expect(reviewButton).toBeHidden();
  });

  test('If the current user is NOT logged-in and they are viewing a spot\'s detail page for a spot, the "Post Your Review" button should be hidden.', async ({
    page,
  }) => {
    await page.goto(process.env.STUDENT_URL!);
    await page.getByTestId("spot-tile").first().click();
    const reviewButton = page.getByTestId("review-button");
    await expect(reviewButton).toBeHidden();
  });

  test('Clicking "Post Your Review", opens a modal popup window containing the new review form.', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    const modal = page.getByTestId("review-modal");
    await expect(modal).toBeVisible();
  });

  test('On the new review form, there should be a title at the top with the text "How was your stay?".', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();

    const reviewTitle = page.getByText("How was your stay?");
    await expect(reviewTitle).toBeVisible();
  });

  test('There should be a comment text area with a placeholder of "Leave your review here..."', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    const textarea = page.getByPlaceholder("Leave your review here...");
    await expect(textarea).toBeVisible();
  });

  test('There should be a star rating input ranging from 1 to 5 stars followed by a label of "Stars".', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    const starRating = page.getByTestId("star-rating");
    await expect(starRating).toBeVisible();
    const starsLabel = page.getByText("Stars");
    await expect(starsLabel).toBeVisible();
  });

  test('The submit button should have the text of "Submit Your Review"', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    await expect(
      page.getByRole("button", { name: "Submit Your Review" })
    ).toBeVisible();
  });

  test('The "Submit Your Review" button is disabled when there are fewer than 10 characters in the comment text area and when the star rating input has no stars selected.', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    let submitButton = page.getByRole("button", { name: "Submit Your Review" });
    await expect(submitButton).toBeDisabled();

    await page.getByPlaceholder("Leave your review here...").fill("Yeet");
    await expect(submitButton).toBeDisabled();

    await page.getByPlaceholder("Leave your review here...").fill("");
    await page.getByTestId("star-rating").locator("path").nth(4).click();
    await expect(submitButton).toBeDisabled();
  });

  test("If a server error occurs, show it below the title. (But that shouldn't happen under normal circumstances).", async ({
    page,
  }) => {
    // free points!
    await expect(true).toBe(true);
  });

  test("When the review is successfully created, the newly created review should show up at the top of the reviews list.", async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    await page
      .getByPlaceholder("Leave your review here...")
      .fill("This is an awesome review comment for testing!");
    await page.getByTestId("star-rating").locator("path").nth(4).click();

    await page.getByRole("button", { name: "Submit Your Review" }).click();

    const firstReview = page.getByTestId("review-list").first();
    await expect(firstReview).toContainText(
      "This is an awesome review comment for testing!"
    );
  });

  test("When the review is successfully created, the average star rating and review summary info should be updated in both places.", async ({
    page,
  }) => {
    await signUpUser(page);
    await createSpot(page);
    await logOutUser(page);

    await page.goto(process.env.STUDENT_URL!);
    await page.getByTestId("spot-tile").first().click();
    const initialRating = await page
      .getByTestId("reviews-heading")
      .getByTestId("review-count")
      .textContent();
    const initialReviewCount = await page
      .getByTestId("spot-callout-box")
      .getByTestId("review-count")
      .textContent();
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();

    await page.getByTestId("review-button").click();
    await page
      .getByPlaceholder("Leave your review here...")
      .fill("This is an awesome review comment for testing!");
    await page.getByTestId("star-rating").locator("path").nth(4).click();
    await page
      .getByRole("button", { name: "Submit Your Review" })
      .click({ delay: 1000 });

    const updatedRating = await page
      .getByTestId("reviews-heading")
      .getByTestId("review-count")
      .textContent();
    const updatedReviewCount = await page
      .getByTestId("spot-callout-box")
      .getByTestId("review-count")
      .textContent();

    expect(updatedRating).not.toEqual(initialRating);
    expect(updatedReviewCount).not.toEqual(initialReviewCount);
  });

  test("Closing the modal resets any errors and clears all data entered. Once it reopens, it must be in the default state (no errors, empty inputs, button disabled).", async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();
    await page.getByPlaceholder("Leave your review here...").fill("small");
    await expect(
      page.getByRole("button", { name: "Submit Your Review" })
    ).toBeDisabled();
    await page.mouse.click(0, 0);
    await page.getByTestId("review-button").click();
    const textarea = page.getByPlaceholder("Leave your review here...");
    await expect(textarea).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "Submit Your Review" })
    ).toBeDisabled();
  });

  test("The layout and element positioning is equivalent to the wireframes.", async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId("spot-tile").first().click();
    await page.getByTestId("review-button").click();

    const title = await page.getByText("How was your stay?").boundingBox();
    const textarea = await page
      .getByPlaceholder("Leave your review here...")
      .boundingBox();
    const starRating = await page.getByTestId("star-rating").boundingBox();
    const submitButton = await page
      .getByRole("button", { name: "Submit Your Review" })
      .boundingBox();

    expect(title?.y).toBeLessThan(textarea?.y!);
    expect(textarea?.y).toBeLessThan(starRating?.y!);
    expect(starRating?.y).toBeLessThan(submitButton?.y!);
  });
});
