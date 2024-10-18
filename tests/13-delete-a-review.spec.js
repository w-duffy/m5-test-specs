import { test, expect } from "@playwright/test";
import { createSpotAndSingleReview, createSpotAndSingleReviewLogInDemoUser } from "./utils";
import { REVIEW_TEXT_LOCATOR, REVIEW_LIST_LOCATOR, DELETE_A_REVIEW_MODAL_LOCATOR } from './contants';
test.describe("Feature: Delete a Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.STUDENT_URL);
  });

  test('On a review that the logged-in user has posted, there should be a "Delete" button below the review\'s comment.', async ({ page }) => {
    await createSpotAndSingleReview(page);
    const deleteButton = page.getByTestId(REVIEW_LIST_LOCATOR).first().getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible();
  });

  test('On a review that the logged-in user did NOT post, the "Delete" button should be hidden.', async ({ page }) => {
    await createSpotAndSingleReviewLogInDemoUser(page);

    const deleteButton = page.getByTestId(REVIEW_LIST_LOCATOR).first().getByRole('button', { name: 'Delete' });
    await expect(deleteButton).not.toBeVisible();
  });

  test('Clicking the "Delete" button on a review will open a confirmation modal popup window that should contain: a Title: "Confirm Delete", a Message: "Are you sure you want to delete this review?", a Red button: "Yes (Delete Review)", and a Dark grey button: "No (Keep Review)".', async ({ page }) => {

await createSpotAndSingleReview(page);
    await page.getByTestId(REVIEW_LIST_LOCATOR).first().getByRole('button', { name: 'Delete' }).click();

    const modal = page.getByTestId(DELETE_A_REVIEW_MODAL_LOCATOR);
    await expect(modal).toBeVisible();

    await expect(modal.getByRole('heading', { name: 'Confirm Delete' })).toBeVisible();
    await expect(modal.getByText('Are you sure you want to delete this review?')).toBeVisible();

    const deleteButton = modal.getByRole('button', { name: 'Yes (Delete Review)' });
    await expect(deleteButton).toBeVisible();

    const cancelButton = modal.getByRole('button', { name: 'No (Keep Review)' });
    await expect(cancelButton).toBeVisible();
  });

  test('Clicking the "Delete" button on a review should not delete the review. Clicking the "Yes (Delete Review)" button in the confirmation modal should delete the review.', async ({ page }) => {

    await createSpotAndSingleReview(page);

    await page.waitForTimeout(2000);

    const initialReviewContent = await page.getByTestId(REVIEW_LIST_LOCATOR).first().textContent();

    await page.getByTestId(REVIEW_LIST_LOCATOR).first().getByRole('button', { name: 'Delete' }).click();

    const modal = page.getByTestId(DELETE_A_REVIEW_MODAL_LOCATOR);
    await expect(modal).toBeVisible();

    await page.mouse.click(0,0)
    await page.waitForTimeout(2000);

    const reviewContentAfterCancel = await page.getByTestId(REVIEW_LIST_LOCATOR).first().textContent()
    expect(reviewContentAfterCancel).toBe(initialReviewContent);

    await page.getByTestId(REVIEW_LIST_LOCATOR).first().getByRole('button', { name: 'Delete' }).click();
    await modal.getByRole('button', { name: 'Yes (Delete Review)' }).click();

    await page.waitForTimeout(2000);
    await expect (page.getByText(initialReviewContent)).not.toBeVisible();

  });

  test('After a review is deleted, it should be removed from the review list in the in the spot\'s detail page. No refresh should be necessary.', async ({ page }) => {

    await createSpotAndSingleReview(page);
    await page.waitForTimeout(1000);

    const reviewText = await page.getByTestId(REVIEW_LIST_LOCATOR).first().getByTestId(REVIEW_TEXT_LOCATOR).first().textContent();

    await page.getByTestId(REVIEW_LIST_LOCATOR).first().getByRole('button', { name: 'Delete' }).click();
    const modal = page.getByTestId(DELETE_A_REVIEW_MODAL_LOCATOR);
    await modal.getByRole('button', { name: 'Yes (Delete Review)' }).click();

    await page.waitForTimeout(1000);

    await expect(page.getByText(reviewText)).not.toBeVisible();
  });

  test('The layout and element positioning is equivalent to the wireframes', async ({ page }) => {

    await createSpotAndSingleReview(page);
    await page.waitForTimeout(1000);

    const reviewItem = page.getByTestId(REVIEW_LIST_LOCATOR).first();
    const reviewText = await reviewItem.getByTestId(REVIEW_TEXT_LOCATOR).boundingBox();
    const deleteButton = await reviewItem.getByRole('button', { name: 'Delete' }).boundingBox();

    expect(reviewText?.y).toBeLessThan(deleteButton?.y);

    await reviewItem.getByRole('button', { name: 'Delete' }).click();

    const modal = page.getByTestId(DELETE_A_REVIEW_MODAL_LOCATOR);
    const title = await modal.getByRole('heading', { name: 'Confirm Delete' }).boundingBox();
    const message = await modal.getByText('Are you sure you want to delete this review?').boundingBox();
    const confirmButton = await modal.getByRole('button', { name: 'Yes (Delete Review)' }).boundingBox();
    const cancelButton = await modal.getByRole('button', { name: 'No (Keep Review)' }).boundingBox();

    expect(title?.y).toBeLessThan(message?.y);
    expect(message?.y).toBeLessThan(confirmButton?.y);
    expect(confirmButton?.y).toBeLessThanOrEqual(cancelButton?.y);
    expect(cancelButton?.x).toBeCloseTo(confirmButton?.x);
  });
});
