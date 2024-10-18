import { test, expect } from '@playwright/test';
import { PROFILE_BUTTON_LOCATOR, SIGN_UP_EMAIL_ERROR_MESSAGE_LOCATOR, SIGN_UP_USERNAME_ERROR_MESSAGE_LOCATOR, SIGN_UP_FORM_LOCATOR, SIGN_UP_FORM_BUTTON_LOCATOR, SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_EMAIL_INPUT_LOCATOR, SIGN_UP_USERNAME_INPUT_LOCATOR, SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR } from './contants';
function createUniqueUser() {
    return {
      firstName: "Fakey",
      lastName: "McFakeFake",
      email: `${generateUniqueUsername()}@test.com`,
      username: generateUniqueUsername(),
      password: "secret password",
    };
  }
   function generateUniqueUsername() {
    const letters = Array.from({ length: 6 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 97)
    ).join("");
    const numbers = Math.floor(Math.random() * 9000) + 1000;
    const timestamp = Date.now();
    return `${letters}${numbers}${timestamp}`;
  }
test.describe('Feature: Sign Up', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL);
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
    });

    test('When logged out, I should see a "Sign up" button next to the "Log in" button in the top-right corner of the header on every page of the site.', async ({ page }) => {
        const loginButton = await page.getByText('Log in');
        const signUpButton = await page.getByText('Sign up');

        await expect(loginButton).toBeVisible();
        await expect(signUpButton).toBeVisible();
    });

    test('Upon clicking "Sign up" the sign-up modal pop-up window should open and display a new user account form.', async ({ page }) => {
        await page.getByText('Sign up').click();
        await expect(page.getByTestId(SIGN_UP_FORM_LOCATOR)).toBeVisible();
    });

    test('The new user account form should show placeholders or labels and input boxes for: "First Name", "Last Name", "Email", "Username", "Password", and "Confirm Password".', async ({ page }) => {
        await page.getByText('Sign up').click();

        const fields = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_EMAIL_INPUT_LOCATOR, SIGN_UP_USERNAME_INPUT_LOCATOR, SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR];
        for (const field of fields) {
            await expect(page.getByTestId(`${field}`)).toBeVisible();
        }
    });

    test('The new user account form should show a "Sign up" button after all the input boxes.', async ({ page }) => {
        await page.getByText('Sign up').click();
        const signUpButton = page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR);
        await expect(signUpButton).toBeVisible();

        const inputBoxes = await page.$$('input');
        const lastInputBox = inputBoxes[inputBoxes.length - 1];
        const lastInputBoxBound = await lastInputBox.boundingBox();
        const signUpButtonBound = await signUpButton.boundingBox();

        expect(signUpButtonBound?.y).toBeGreaterThan(lastInputBoxBound.y + lastInputBoxBound.height);
    });

    test('The "Sign up" button should be disabled when any field is empty.', async ({ page }) => {
        await page.getByText('Sign up').click();
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeDisabled();

        const fields = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_EMAIL_INPUT_LOCATOR, SIGN_UP_USERNAME_INPUT_LOCATOR, SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR];

        for (const field of fields) {
            await page.getByTestId(field).fill('testingALongString');
        }
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeEnabled();

        for (const field of fields) {
            await page.getByTestId(field).fill('');
            await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeDisabled();
            await page.getByTestId(field).fill('test');
        }
    });

    test('The "Sign up" button should be disabled when the "Username" field is less than 4 characters.', async ({ page }) => {
        await page.getByText('Sign up').click();
        const fields = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_EMAIL_INPUT_LOCATOR, SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR];

        for (const field of fields) {
            await page.getByTestId(field).fill('testingALongString');
        }
        await page.getByTestId(SIGN_UP_USERNAME_INPUT_LOCATOR).fill('abc');
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeDisabled();
        await page.getByTestId(SIGN_UP_USERNAME_INPUT_LOCATOR).fill('abcd');
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeEnabled();
    });

    test('The "Sign up" button should be disabled when the "Password" field is less than 6 characters.', async ({ page }) => {
        await page.getByText('Sign up').click();
        const fields = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_USERNAME_INPUT_LOCATOR, SIGN_UP_EMAIL_INPUT_LOCATOR];
        for (const field of fields) {
            await page.getByTestId(field).fill('testingALongString');
        }
        await page.getByTestId(SIGN_UP_PASSWORD_INPUT_LOCATOR).fill('12345');
        await page.getByTestId(SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR).fill('12345');
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeDisabled();
        await page.getByTestId(SIGN_UP_PASSWORD_INPUT_LOCATOR).fill('123456');
        await page.getByTestId(SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR).fill('123456');
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeEnabled();
    });

    test('When clicking "Sign up" button on the new user account form with errors in the form, it must show all error messages returned from the backend.', async ({ page }) => {
        await page.getByText('Sign up').click();
        const fields = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR];

        for (const field of fields) {
            await page.getByTestId(field).fill('testingALongString');
        }
        await page.getByTestId(SIGN_UP_EMAIL_INPUT_LOCATOR).fill('demo@user.io');
        await page.getByTestId(SIGN_UP_USERNAME_INPUT_LOCATOR).fill('Demo-lition');
        await page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR).click();

        await expect(page.getByTestId(SIGN_UP_EMAIL_ERROR_MESSAGE_LOCATOR)).toBeVisible();
        await expect(page.getByTestId(SIGN_UP_USERNAME_ERROR_MESSAGE_LOCATOR )).toBeVisible();
    });

    test('Upon closing and reopening sign-up modal, the errors are reset.', async ({ page }) => {
        await page.getByText('Sign up').click();
        const fields = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_USERNAME_INPUT_LOCATOR, SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR];

        for (const field of fields) {
            await page.getByTestId(field).fill('testingALongString');
        }
        await page.getByTestId(SIGN_UP_EMAIL_INPUT_LOCATOR).fill('demo@user.io');
        await page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(SIGN_UP_EMAIL_ERROR_MESSAGE_LOCATOR)).toBeVisible();

        await page.mouse.click(0, 0);
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await page.getByText('Sign up').click();
        await expect(page.getByTestId(SIGN_UP_EMAIL_ERROR_MESSAGE_LOCATOR)).not.toBeVisible();
    });

    test('Upon closing and reopening sign-up modal, all fields are empty.', async ({ page }) => {
        await page.getByText('Sign up').click();
        await page.getByTestId(SIGN_UP_FIRST_NAME_INPUT_LOCATOR).fill('John');
        await page.mouse.click(0, 0);
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await page.getByText('Sign up').click();
        await expect(page.getByTestId(SIGN_UP_FIRST_NAME_INPUT_LOCATOR)).toHaveValue('');
    });

    test('Upon closing and reopening sign-up modal, the "Sign up" button on the new user account form is disabled.', async ({ page }) => {
        await page.getByText('Sign up').click();
        await page.getByTestId(SIGN_UP_FIRST_NAME_INPUT_LOCATOR).fill('John');
        await page.mouse.click(0, 0);
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await page.getByText('Sign up').click();
        await expect(page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR)).toBeDisabled();
    });

    test('After a successful sign-up is completed, the new user should automatically be logged in and see the User Menu button.', async ({ page }) => {
        const user = createUniqueUser();
        await page.getByText('Sign up').click();
        await page.getByTestId(SIGN_UP_FIRST_NAME_INPUT_LOCATOR).fill(user.firstName);
        await page.getByTestId(SIGN_UP_LAST_NAME_INPUT_LOCATOR ).fill(user.lastName);
        await page.getByTestId(SIGN_UP_EMAIL_INPUT_LOCATOR).fill(user.email);
        await page.getByTestId(SIGN_UP_USERNAME_INPUT_LOCATOR).fill(user.username);
        await page.getByTestId(SIGN_UP_PASSWORD_INPUT_LOCATOR).fill(user.password);
        await page.getByTestId(SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR).fill(user.password);
        await page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR).click();
        await page.waitForTimeout(2000);

        await expect(page.getByTestId(PROFILE_BUTTON_LOCATOR)).toBeVisible();
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText(`Hello, ${user.firstName}`)).toBeVisible();
        await expect(page.getByText(user.email)).toBeVisible();
        await expect(page.getByText('Log out')).toBeVisible();
        await expect(page.getByText('Log in')).not.toBeVisible();
        await expect(page.getByText('Sign up')).not.toBeVisible();
    });

    test('After a successful sign-up is completed, if the new user refreshes the browser, they should still see the User Menu Button with the new user\'s information in the user drop down menu.', async ({ page, context }) => {

        const user = createUniqueUser();
        await page.getByText('Sign up').click();
        await page.getByTestId(SIGN_UP_FIRST_NAME_INPUT_LOCATOR).fill(user.firstName);
        await page.getByTestId(SIGN_UP_LAST_NAME_INPUT_LOCATOR ).fill(user.lastName);
        await page.getByTestId(SIGN_UP_EMAIL_INPUT_LOCATOR).fill(user.email);
        await page.getByTestId(SIGN_UP_USERNAME_INPUT_LOCATOR).fill(user.username);
        await page.getByTestId(SIGN_UP_PASSWORD_INPUT_LOCATOR).fill(user.password);
        await page.getByTestId(SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR).fill(user.password);
        await page.getByTestId(SIGN_UP_FORM_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_LOCATOR)).toBeVisible();
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText(`Hello, ${user.firstName}`)).toBeVisible();
        await expect(page.getByText(user.email)).toBeVisible();
        await expect(page.getByText('Log out')).toBeVisible();
        await expect(page.getByText('Log in')).not.toBeVisible();
        await expect(page.getByText('Sign up')).not.toBeVisible();

        const storageState = await context.storageState();

        await page.reload();

        await context.addCookies(storageState.cookies);

        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText(`Hello, ${user.firstName}`)).toBeVisible();
        await expect(page.getByText(user.email)).toBeVisible();
    });

    test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {
        await page.getByText('Sign up').click();

        const modal = page.getByTestId(SIGN_UP_FORM_LOCATOR);
        const modalBox = await modal.boundingBox();

        const viewportSize = page.viewportSize();
        expect(modalBox?.x).toBeCloseTo((viewportSize.width - modalBox.width) / 2, -2);
        expect(modalBox?.y).toBeCloseTo((viewportSize.height - modalBox.height) / 2, -2);

        const formElements = [SIGN_UP_FIRST_NAME_INPUT_LOCATOR, SIGN_UP_LAST_NAME_INPUT_LOCATOR , SIGN_UP_EMAIL_INPUT_LOCATOR, SIGN_UP_USERNAME_INPUT_LOCATOR, SIGN_UP_PASSWORD_INPUT_LOCATOR, SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR, SIGN_UP_FORM_BUTTON_LOCATOR];
        for (let i = 1; i < formElements.length; i++) {
            const prevElement = page.getByTestId(formElements[i-1]);
            const currentElement = page.getByTestId(formElements[i]);
            const prevBox = await prevElement.boundingBox();
            const currentBox = await currentElement.boundingBox();
            expect(currentBox?.y).toBeGreaterThan(prevBox.y);
        }
    });
});
