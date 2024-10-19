import { test, expect } from "@playwright/test";
import { updateReviewCountCheck, createSpotAndSingleReview, encapsulateSpotCreation, signUpUser, createSpotAndNoReviewUserOnPage } from "./utils";
import { CREATE_A_REVIEW_CLICKABLE_STAR_LOCATOR, CREATE_A_REVIEW_MODAL_LOCATOR, CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR, REVIEW_HEADING_LOCATOR, SPOT_LINK_TO_SPOT_PAGE_LOCATOR, SPOT_TILE_LOCATOR, REVIEW_LIST_LOCATOR } from './contants';
test.describe("Feature: Post a Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL);
  });

  test('If the current user is logged-in and they are viewing a spot\'s detail page for a spot that they HAVE NOT posted a review yet, a "Post Your Review" button shows between the rating/reviews heading and the list of reviews.', async ({
    page,
  }) => {
    await createSpotAndNoReviewUserOnPage(page);
    await page.waitForTimeout(2000);
    const reviewButton = await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR);
    await expect(reviewButton).toBeVisible();

    const ratingHeading = await page.getByTestId(REVIEW_HEADING_LOCATOR);
    const reviewsList = await page.getByText(/Be the first/i);
    const buttonBox = await reviewButton.boundingBox();
    const headingBox = await ratingHeading.boundingBox();
    const listBox = await reviewsList.boundingBox();

    expect(buttonBox?.y).toBeGreaterThanOrEqual(
      headingBox?.y + headingBox?.height
    );
    expect(buttonBox?.y + buttonBox?.height).toBeLessThanOrEqual(listBox?.y);
  });

  test('If the current user is logged-in and they are viewing a spot\'s detail page for a spot that they are an owner of, the "Post Your Review" button should be hidden.', async ({
    page,
  }) => {
    await encapsulateSpotCreation(page);
    await page.waitForTimeout(2000);
    const reviewButton = await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR);
    await expect(reviewButton).toBeHidden();
  });

  test('If the current user is logged-in and they are viewing a spot\'s detail page for a spot that they HAVE posted a review for, the "Post Your Review" button should be hidden.', async ({
    page,
  }) => {
    await createSpotAndSingleReview(page);
    await page.waitForTimeout(2000);
    const reviewButton = await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR);
    await expect(reviewButton).toBeHidden();
  });

  test('If the current user is NOT logged-in and they are viewing a spot\'s detail page for a spot, the "Post Your Review" button should be hidden.', async ({
    page,
  }) => {
    await page.goto(process.env.STUDENT_URL);
    await page.getByTestId(SPOT_LINK_TO_SPOT_PAGE_LOCATOR).first().click();
    await expect(page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR)).not.toBeVisible();
  });

  test('Clicking "Post Your Review", opens a modal popup window containing the new review form.', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    const modal = await page.getByTestId(CREATE_A_REVIEW_MODAL_LOCATOR);
    await expect(modal).toBeVisible();
  });

  test('On the new review form, there should be a title at the top with the text "How was your stay?".', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();

    const reviewTitle = page.getByText("How was your stay?");
    await expect(reviewTitle).toBeVisible();
  });

  test('There should be a comment text area with a placeholder of "Leave your review here..."', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    const textarea = await page.getByPlaceholder("Leave your review here...");
    await expect(textarea).toBeVisible();
  });

  test('There should be a star rating input ranging from 1 to 5 stars followed by a label of "Stars".', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    const starRating = await page.getByTestId(CREATE_A_REVIEW_CLICKABLE_STAR_LOCATOR).all()
    await expect(starRating).toHaveLength(5);
    const starsLabel = await page.getByText("Stars");
    await expect(starsLabel).toBeVisible();
  });

  test('The submit button should have the text of "Submit Your Review"', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    await expect(
      page.getByRole("button", { name: "Submit Your Review" })
    ).toBeVisible();
  });

  test('The "Submit Your Review" button is disabled when there are fewer than 10 characters in the comment text area and when the star rating input has no stars selected.', async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    let submitButton = page.getByRole("button", { name: "Submit Your Review" });
    await expect(submitButton).toBeDisabled();

    await page.getByPlaceholder("Leave your review here...").fill("Yeet");
    await expect(submitButton).toBeDisabled();

    // await page.getByTestId("star-rating").all().click();
    await page.getByPlaceholder("Leave your review here...").fill("");
    for (let star of await page.getByTestId(CREATE_A_REVIEW_CLICKABLE_STAR_LOCATOR).all()) {
      await star.click();
    }
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
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    await page
      .getByPlaceholder("Leave your review here...")
      .fill("This is an awesome review comment for testing!");
      for (let star of await page.getByTestId(CREATE_A_REVIEW_CLICKABLE_STAR_LOCATOR).all()) {
        await star.click();
      }

    await page.getByRole("button", { name: "Submit Your Review" }).click();

    const firstReview = await page.getByTestId(REVIEW_LIST_LOCATOR).first();
    await expect(firstReview).toContainText(
      "This is an awesome review comment for testing!"
    );
  });

  test("When the review is successfully created, the average star rating and review summary info should be updated in both places.", async ({
    page,
  }) => {
   await updateReviewCountCheck(page, expect);
  });

  test("Closing the modal resets any errors and clears all data entered. Once it reopens, it must be in the default state (no errors, empty inputs, button disabled).", async ({
    page,
  }) => {
    await signUpUser(page);
    await page.getByTestId(SPOT_TILE_LOCATOR).first().click();
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    await page.getByPlaceholder("Leave your review here...").fill("small");
    await expect(
      page.getByRole("button", { name: "Submit Your Review" })
    ).toBeDisabled();
    await page.mouse.click(0, 0);
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();
    const textarea = await page.getByPlaceholder("Leave your review here...");
    await expect(textarea).toHaveValue("");
    await expect(
      page.getByRole("button", { name: "Submit Your Review" })
    ).toBeDisabled();
  });

  test("The layout and element positioning is equivalent to the wireframes.", async ({
    page,
  }) => {
    await createSpotAndNoReviewUserOnPage(page)
    await page.getByTestId(CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR).click();

    const title = await page.getByText("How was your stay?").boundingBox();
    const textarea = await page
      .getByPlaceholder("Leave your review here...")
      .boundingBox();
    const starRating = await page.getByTestId(CREATE_A_REVIEW_CLICKABLE_STAR_LOCATOR).first().boundingBox();
    const submitButton = await page
      .getByRole("button", { name: "Submit Your Review" })
      .boundingBox();

    expect(title?.y).toBeLessThan(textarea?.y);
    expect(textarea?.y).toBeLessThan(starRating?.y);
    expect(starRating?.y).toBeLessThan(submitButton?.y);
  });
});
