import { test, expect } from '@playwright/test';

test.describe('Feature: View Spot Details', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL!);
        const firstSpot = page.getByTestId('spot-tile').first();

        const anchorTag = await firstSpot.locator('a');

        await anchorTag.click();
    });

    test('On the spot\'s detail page, the following information should be present: a Heading <spot name>, Location: <city>, <state>, <country>, Images (1 large image and 4 small images), Text: Hosted by <first name>, <last name>, Paragraph: <description>, and the callout information box on the right, below the images.', async ({ page }) => {

        await expect(page.getByTestId('spot-name')).toBeVisible();


        await expect(page.getByTestId('spot-location')).toBeVisible();
        const locationText = await page.getByTestId('spot-location').textContent();
        // looking for: city, state, country
        expect(locationText).toMatch(/[\w\s]+,\s[\w\s]+,\s[\w\s]+/);

        const largeImage = page.getByTestId('spot-large-image');
        await expect(largeImage).toBeVisible();
        const smallImages = await page.getByTestId('spot-small-image').all();
        expect(smallImages.length).toBe(4);

        await expect(page.getByTestId('spot-host')).toBeVisible();
        const hostText = await page.getByTestId('spot-host').textContent();
        expect(hostText).toMatch(/Hosted by \w+ \w+/);

        await expect(page.getByTestId('spot-description')).toBeVisible();

        await expect(page.getByTestId('spot-callout-box')).toBeVisible();
    });

    test('The callout information box on the right of the spot\'s detail page should state the price for the spot followed by the label "night", and have a "Reserve" button.', async ({ page }) => {
        const calloutBox = page.getByTestId('spot-callout-box');

        const priceElement = calloutBox.getByTestId('spot-price');
        await expect(priceElement).toBeVisible();
        const priceText = await priceElement.textContent();
        expect(priceText).toMatch(/\$\s?\d+(,\d{3})*(\.\d{2})?\s*(\/\s*)?night/);

        const reserveButton = calloutBox.getByTestId('reserve-button');
        await expect(reserveButton).toBeVisible();
        expect(await reserveButton.textContent()).toBe('Reserve');
    });

    test('When the "Reserve" button on the spot\'s detail page is clicked, it should open an alert with the text "Feature coming soon".', async ({ page }) => {
        const reserveButton = page.getByTestId('reserve-button');


        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('Feature coming soon');
            await dialog.dismiss();
        });

        await reserveButton.click();
    });

    test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {

        const spotName = await page.getByTestId('spot-name').boundingBox();
        const location = await page.getByTestId('spot-location').boundingBox();
        expect(spotName?.y).toBeLessThan(location?.y!);


        const largeImage = await page.getByTestId('spot-large-image').boundingBox();
        expect(largeImage?.y).toBeGreaterThan(location?.y!);


        const smallImages = await page.getByTestId('spot-small-image').all();
        const firstSmallImage = await smallImages[0].boundingBox();
        expect(firstSmallImage?.x).toBeGreaterThan(largeImage?.x! + largeImage?.width!);


        const host = await page.getByTestId('spot-host').boundingBox();
        expect(host?.y).toBeGreaterThan(largeImage?.y! + largeImage?.height!);


        const description = await page.getByTestId('spot-description').boundingBox();
        expect(description?.y).toBeGreaterThan(host?.y! + host?.height!);


        const calloutBox = await page.getByTestId('spot-callout-box').boundingBox();
        const viewportSize = page.viewportSize();
        expect(calloutBox?.x!+ calloutBox?.width!).toBeCloseTo(viewportSize?.width!, -3);


        const reserveButton = await page.getByTestId('reserve-button').boundingBox();
        expect(reserveButton?.y! + reserveButton?.height!).toBeCloseTo(calloutBox?.y! + calloutBox?.height!, -2);
    });
});
