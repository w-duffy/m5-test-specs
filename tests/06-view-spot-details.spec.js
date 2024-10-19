import { test, expect } from '@playwright/test';
import { createSpot, loginDemoUser } from './utils';
import { SPOT_HEADING_LOCATOR, SPOT_DETAIL_PAGE_LOCATION_LOCATOR, SPOT_LARGE_IMAGE_LOCATOR, SPOT_SMALL_IMAGE_LOCATOR, SPOT_HOST_LOCATOR, SPOT_DESCRIPTION_LOCATOR, SPOT_CALLOUT_BOX_LOCATOR, SPOT_PRICE_DETAIL_PAGE_LOCATOR, SPOT_RESERVE_BUTTON_LOCATOR } from './contants';
test.describe('Feature: View Spot Details', () => {
    /*
    Before each test, we need to create a spot and login the demo user.
    The Demo user will be on the newly created spot's page at the beginning of the test.
    */
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL);
        await loginDemoUser(page)
        await page.waitForTimeout(1000);
        await createSpot(page)
    });

    test('On the spot\'s detail page, the following information should be present: a Heading <spot name>, Location: <city>, <state>, <country>, Images (1 large image and 4 small images), Text: Hosted by <first name>, <last name>, Paragraph: <description>, and the callout information box on the right, below the images.', async ({ page }) => {
        await expect(page.getByTestId(SPOT_HEADING_LOCATOR)).toBeVisible();


        await expect(page.getByTestId(SPOT_DETAIL_PAGE_LOCATION_LOCATOR)).toBeVisible();
        const locationText = await page.getByTestId(SPOT_DETAIL_PAGE_LOCATION_LOCATOR).textContent();
        // looking for: city, state, country
        expect(locationText).toMatch(/[\w\s]+,\s[\w\s]+,\s[\w\s]+/);

        const largeImage = await page.getByTestId(SPOT_LARGE_IMAGE_LOCATOR);
        await expect(largeImage).toBeVisible();
        const smallImages = await page.getByTestId(SPOT_SMALL_IMAGE_LOCATOR).all();
        expect(smallImages.length).toBe(4);

        await expect(page.getByTestId(SPOT_HOST_LOCATOR)).toBeVisible();
        const hostText = await page.getByTestId(SPOT_HOST_LOCATOR).textContent();
        expect(hostText).toMatch(/Hosted by \w+ \w+/);

        await expect(page.getByTestId(SPOT_DESCRIPTION_LOCATOR)).toBeVisible();

        await expect(page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR)).toBeVisible();
    });

    test('The callout information box on the right of the spot\'s detail page should state the price for the spot followed by the label "night", and have a "Reserve" button.', async ({ page }) => {
        const calloutBox = await page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR);

        const priceElement = await calloutBox.getByTestId( SPOT_PRICE_DETAIL_PAGE_LOCATOR);
        await expect(priceElement).toBeVisible();
        const priceText = await priceElement.textContent();
        expect(priceText).toMatch(/\$\s?\d+(,\d{3})*(\.\d{2})?\s*(\/\s*)?night/);

        const reserveButton = await calloutBox.getByTestId(SPOT_RESERVE_BUTTON_LOCATOR);
        await expect(reserveButton).toBeVisible();
        expect(await reserveButton.textContent()).toBe('Reserve');
    });

    test('When the "Reserve" button on the spot\'s detail page is clicked, it should open an alert with the text "Feature coming soon".', async ({ page }) => {
        const reserveButton = await page.getByTestId(SPOT_RESERVE_BUTTON_LOCATOR);

        // clicking the reserve button should trigger a window alert.
        // the alert should say "Feature coming soon"

        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('Feature coming soon');
            await dialog.dismiss();
        });

        await reserveButton.click();
    });

    test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {

        const spotName = await page.getByTestId(SPOT_HEADING_LOCATOR).boundingBox();
        const location = await page.getByTestId(SPOT_DETAIL_PAGE_LOCATION_LOCATOR).boundingBox();
        expect(spotName?.y).toBeLessThan(location?.y);


        const largeImage = await page.getByTestId(SPOT_LARGE_IMAGE_LOCATOR).boundingBox();
        expect(largeImage?.y).toBeGreaterThan(location?.y);


        const smallImages = await page.getByTestId(SPOT_SMALL_IMAGE_LOCATOR).all();
        const firstSmallImage = await smallImages[0].boundingBox();
        expect(firstSmallImage?.x).toBeGreaterThanOrEqual(largeImage?.x + largeImage?.width);


        const host = await page.getByTestId(SPOT_HOST_LOCATOR).boundingBox();
        expect(host?.y).toBeGreaterThanOrEqual(largeImage?.y + largeImage?.height);


        const description = await page.getByTestId(SPOT_DESCRIPTION_LOCATOR).boundingBox();
        expect(description?.y).toBeGreaterThanOrEqual(host?.y + host?.height);


        const calloutBox = await page.getByTestId(SPOT_CALLOUT_BOX_LOCATOR).boundingBox();
        const viewportSize = page.viewportSize();
        expect(calloutBox?.x+ calloutBox?.width).toBeCloseTo(viewportSize?.width, -3);


        const reserveButton = await page.getByTestId(SPOT_RESERVE_BUTTON_LOCATOR).boundingBox();
        expect(reserveButton?.y + reserveButton?.height).toBeCloseTo(calloutBox?.y + calloutBox?.height, -2);
    });
});
