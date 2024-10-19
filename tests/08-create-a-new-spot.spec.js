import { test, expect } from '@playwright/test';
import { createUniqueUser, loginDemoUser } from "./utils";
import {CREATE_A_NEW_SPOT_FORM_LOCATOR, CREATE_A_NEW_SPOT_FORM_TITLE_LOCATOR, CREATE_A_NEW_SPOT_SECTION_1_LOCATOR, CREATE_A_NEW_SPOT_SECTION_1_CAPTION_LOCATOR, CREATE_A_NEW_SPOT_SECTION_1_HEADING_LOCATOR, CREATE_A_NEW_SPOT_SECTION_2_LOCATOR, CREATE_A_NEW_SPOT_SECTION_2_CAPTION_LOCATOR, CREATE_A_NEW_SPOT_SECTION_2_HEADING_LOCATOR, CREATE_A_NEW_SPOT_SECTION_3_LOCATOR, CREATE_A_NEW_SPOT_SECTION_3_CAPTION_LOCATOR, CREATE_A_NEW_SPOT_SECTION_3_HEADING_LOCATOR, CREATE_A_NEW_SPOT_SECTION_4_LOCATOR, CREATE_A_NEW_SPOT_SECTION_4_CAPTION_LOCATOR, CREATE_A_NEW_SPOT_SECTION_4_HEADING_LOCATOR, CREATE_A_NEW_SPOT_SECTION_5_LOCATOR, CREATE_A_NEW_SPOT_SECTION_5_CAPTION_LOCATOR, CREATE_A_NEW_SPOT_SECTION_5_HEADING_LOCATOR, CREATE_A_NEW_SPOT_LOCATION_INPUT_LOCATOR, PROFILE_BUTTON_LOCATOR } from './contants';
test.describe('Feature: Create a New Spot', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL);
        await loginDemoUser(page)
        await page.waitForTimeout(1000);
        await page.getByText('Create a New Spot').click();
    });

    test("There should be a 'Create a New Spot' button in the navigation bar to the left of the User Menu button for logged-in users", async ({ page }) => {
        await page.goto(process.env.STUDENT_URL);
        const createSpotButton = await page.getByText('Create a New Spot');
        await expect(createSpotButton).toBeVisible();

        const userMenuButton = await page.getByTestId(PROFILE_BUTTON_LOCATOR);
        const createSpotBox = await createSpotButton.boundingBox();
        const userMenuBox = await userMenuButton.boundingBox();
        expect(createSpotBox?.x).toBeLessThan(userMenuBox?.x);
    });
    //

    test("Upon clicking the 'Create a New Spot' button, the user should be navigated to a blank form to gather the data for a new spot (see wireframe)", async ({ page }) => {
        await expect(page).toHaveURL(`${process.env.STUDENT_URL}/spots/new`);
        await expect(page.getByTestId(CREATE_A_NEW_SPOT_FORM_LOCATOR)).toBeVisible();
    });


    test('On the new spot form, there should be: a title at the top with the text "Create a New Spot"', async ({ page }) => {
        await expect(page.getByTestId(CREATE_A_NEW_SPOT_FORM_TITLE_LOCATOR)).toHaveText('Create a New Spot');
    });
    test('The first section should include: a heading of "Where\'s your place located?", a caption of "Guests will only get your exact address once they booked a reservation.", and text inputs with labels and placeholders for "Country", "Street Address", "City", and "State" ("Latitude" and "Longitude" inputs are optional for MVP"', async ({ page }) => {
        const section = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_1_LOCATOR)
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_1_HEADING_LOCATOR)).toHaveText('Where\'s your place located?');
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_1_CAPTION_LOCATOR)).toHaveText('Guests will only get your exact address once they booked a reservation.');
        const inputs = ['Country', 'Street Address', 'City', 'State']
        for (const inputLabel of inputs) {
            await expect(section.getByLabel(inputLabel)).toBeVisible();
        }

    })

    test('The second section should include: a heading of "Describe your place to guests", a caption of "Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.", and a text area with a placeholder of "Please write at least 30 characters".', async ({ page }) => {
        const section = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_2_LOCATOR)
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_2_HEADING_LOCATOR)).toHaveText('Describe your place to guests');
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_2_CAPTION_LOCATOR)).toHaveText('Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.');
        await expect(section.getByPlaceholder('Please write at least 30 characters')).toBeVisible();

    })
    test('The third section should include: a heading of "Create a title for your spot", a caption of "Catch guests\' attention with a spot title that highlights what makes your place special.", and a text input with a placeholder of "Name of your spot"', async ({ page }) => {
        const section = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_3_LOCATOR)
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_3_HEADING_LOCATOR)).toHaveText('Create a title for your spot');
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_3_CAPTION_LOCATOR)).toHaveText("Catch guests' attention with a spot title that highlights what makes your place special.");
        await expect(section.getByPlaceholder('Name of your spot')).toBeVisible();

    })

    test('The fourth section should include: a heading of "Set a base price for your spot", a caption of "Competitive pricing can help your listing stand out and rank higher in search results.", and a number input with a placeholder of "Price per night (USD)"', async ({ page }) => {
        const section = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_4_LOCATOR)
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_4_HEADING_LOCATOR)).toHaveText('Set a base price for your spot');
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_4_CAPTION_LOCATOR )).toHaveText("Competitive pricing can help your listing stand out and rank higher in search results.");
        await expect(section.getByPlaceholder('Price per night (USD)')).toBeVisible();
        await expect(section.getByPlaceholder('Price per night (USD)')).toHaveAttribute('type', 'number');
    })

    test('The fifth section should include: a heading of "Liven up your spot with photos", a caption of "Submit a link to at least one photo to publish your spot.", and five text inputs where the first input has a placeholder of "Preview Image URL" and the rest of the inputs have a placeholder of "Image URL"', async ({ page }) => {
        const section = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_5_LOCATOR)
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_5_HEADING_LOCATOR)).toHaveText('Liven up your spot with photos');
        await expect(section.getByTestId(CREATE_A_NEW_SPOT_SECTION_5_CAPTION_LOCATOR)).toHaveText("Submit a link to at least one photo to publish your spot.");
        await expect(section.getByPlaceholder('Preview Image URL')).toBeVisible();
        let imageUrlInputs = await (await section.getByPlaceholder('Image URL').all()).slice(1)
        expect(imageUrlInputs.length).toBe(4);
        for (const input of imageUrlInputs) {
            await expect(input).toBeVisible();
        }
    })

    test('The submit button should have the text of "Create Spot', async ({ page }) => {
        const submitButton = await page.locator('button[type="submit"]')
        await expect(submitButton).toHaveText('Create Spot');
    });



    test('Validation messages must show at the top of the form or under each field with an error if the user tries to submit an incomplete form. Examples: a Required Field: " is required" (e.g. "Price per night is required", etc.), a Description Min Length: "Description needs 30 or more characters". Out of the five image URL inputs, only the first Image URL input (the Preview Image URL) is required.', async ({ page }) => {
        await page.locator('button[type="submit"]').click();

        await expect(page.getByText(/Country is required/i)).toBeVisible();
        await expect(page.getByText(/Address is required/i)).toBeVisible();
        await expect(page.getByText(/City is required/i)).toBeVisible();
        await expect(page.getByText(/State is required/i)).toBeVisible();
        await expect(page.getByText(/Description needs 30 or more characters/i)).toBeVisible();
        await expect(page.getByText(/Name is required/i)).toBeVisible();
        await expect(page.getByText(/Price per night is required/i)).toBeVisible();
        await expect(page.getByText(/Preview Image URL is required/i)).toBeVisible();
    });

    test("When a spot is successfully created, the user should automatically be navigated to the new spot's detail page.", async ({ page }) => {
        const spotFiller = createUniqueUser();
        await page.getByLabel('Country').fill(`Country of ${spotFiller.username}`);
        await page.getByLabel('Street Address').fill(`${spotFiller.username} lane`);
        await page.getByLabel('City').fill('Test City');
        await page.getByLabel('State').fill('Test State');
        await page.getByPlaceholder('Please write at least 30 characters').fill(`Wow ${spotFiller.username} great Spot -- `);
        await page.getByPlaceholder('Name of your spot').fill(`${spotFiller.username} Casa`);
        await page.getByPlaceholder('Price per night (USD)').fill('100');
        await page.getByPlaceholder('Preview Image URL').fill('https://static.vecteezy.com/system/resources/previews/024/189/092/non_2x/house-real-estate-building-in-png.png');

        await page.locator('button[type="submit"]').click();

        await expect(page.getByText(`${spotFiller.username} Casa`)).toBeVisible();
        await expect(page.getByText(`Country of ${spotFiller.username}`)).toBeVisible();
        const locationText = await page.getByTestId(CREATE_A_NEW_SPOT_LOCATION_INPUT_LOCATOR).textContent();
        expect(locationText).toMatch(/[\w\s]+,\s[\w\s]+,\s[\w\s]+/);
    });

    test('Navigating away and back to the create spot form form resets any errors and clears all data entered, so it displays in the default state (no errors, empty inputs).', async ({ page }) => {

        await page.getByLabel('Country').fill('Test Country');

        await page.goto(process.env.STUDENT_URL);

        await page.getByText('Create a New Spot').click();

        await expect(page.getByLabel('Country')).toHaveValue('');
    });

    test('The layout and element positioning is equivalent to the wireframes.s', async ({ page }) => {

        const formTitle = await page.getByTestId('form-title').boundingBox();
        const section1 = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_1_LOCATOR).boundingBox();
        const section2 = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_2_LOCATOR).boundingBox();
        const section3 = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_3_LOCATOR).boundingBox();
        const section4 = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_4_LOCATOR).boundingBox();
        const section5 = await page.getByTestId(CREATE_A_NEW_SPOT_SECTION_5_LOCATOR).boundingBox();
        const submitButton = await page.locator('button[type="submit"]').boundingBox();

        expect(formTitle?.y).toBeLessThan(section1?.y);
        expect(section1?.y).toBeLessThan(section2?.y);
        expect(section2?.y).toBeLessThan(section3?.y);
        expect(section3?.y).toBeLessThan(section4?.y);
        expect(section4?.y).toBeLessThan(section5?.y);
        expect(section5?.y).toBeLessThan(submitButton?.y);
    });



});
