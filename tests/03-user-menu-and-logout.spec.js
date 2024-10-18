import { test, expect } from '@playwright/test';
import { PROFILE_BUTTON_LOCATOR, PROFILE_BUTTON_DROPDOWN_LOCATOR, LOGIN_CREDENTIAL_INPUT_LOCATOR, LOGIN_PASSWORD_INPUT_LOCATOR, LOGIN_FORM_BUTTON_LOCATOR } from './contants';
test.describe('Feature: User Menu and Log Out', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.STUDENT_URL);

        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await page.getByText('Log in').click();
        await page.getByTestId(LOGIN_CREDENTIAL_INPUT_LOCATOR).fill('demo@user.io');
        await page.getByTestId(LOGIN_PASSWORD_INPUT_LOCATOR).fill('password');
        await page.getByTestId(LOGIN_FORM_BUTTON_LOCATOR).click();
    });

    test('On every page of the site, I should be able to see a User Menu Button in the upper-right corner that opens a user drop down menu when clicked.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).toBeVisible();
    });

    test('After a user successfully logs in, The user drop down menu contains the logged in user\'s first name as a greeting: "Hello, "<first name>".', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText('Hello, Demo')).toBeVisible();
    });

    test('After a user successfully logs in, The user drop down menu contains the logged in user\'s email: <email>.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText('demo@user.io')).toBeVisible();
    });

    test('After a user successfully logs in, The user drop down menu contains: a "Log out" Button as a menu option.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText('Log out')).toBeVisible();
    });

    test('After a user successfully logs in, the user menu does NOT contain the "Log in" or "Sign up" menu options.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByText('Log in')).not.toBeVisible();
        await expect(page.getByText('Sign up')).not.toBeVisible();
    });

    test('Upon clicking anywhere outside the User Menu (including on the User Menu Button), the menu drop down hides.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).toBeVisible();

        await page.mouse.click(0, 0);
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).not.toBeVisible();

        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).toBeVisible();

        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).not.toBeVisible();
    });

    test('Upon clicking anywhere on the greeting or email inside the user drop down menu, the User Menu remains open.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).toBeVisible();
    });

    test('Upon clicking the "Log out" menu option, it performs a log out where it will clear the session/cookie.', async ({ page, context }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await page.getByText('Log out').click();

        const cookies = await context.cookies();
        const sessionCookie = cookies.find(cookie => cookie.name === 'session');
        expect(sessionCookie).toBeUndefined();
    });

    test('Upon clicking the "Log out" button, it performs a log out where it will close the user drop down menu.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).toBeVisible();
        await page.getByText(/log out/i).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).not.toBeVisible();
    });

    test('Upon clicking the "Log Out" button, it performs a log out where it will navigate the user to the home page (/).', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();
        await expect(page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR)).toBeVisible();
        await page.getByText(/log out/i).click();
        await expect(page).toHaveURL(`${process.env.STUDENT_URL}/`);
    });

    test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {
        await page.getByTestId(PROFILE_BUTTON_LOCATOR).click();

        const userMenuButton = await page.getByTestId(PROFILE_BUTTON_LOCATOR);
        const userDropdownMenu = await page.getByTestId(PROFILE_BUTTON_DROPDOWN_LOCATOR);

        const buttonBox = await userMenuButton.boundingBox();
        const menuBox = await userDropdownMenu.boundingBox();

        expect(buttonBox.x + buttonBox?.width).toBeCloseTo(page.viewportSize().width, -2);
        expect(buttonBox.y).toBeLessThan(100);

        expect(menuBox.y).toBeGreaterThan(buttonBox.y + buttonBox.height);

        expect(menuBox.x + menuBox.width).toBeCloseTo(buttonBox.x + buttonBox.width, -2);

        const greeting = await page.getByText('Hello, Demo');
        const email = await page.getByText('demo@user.io');
        const logoutButton = await page.getByText('Log out');

        const greetingBox = await greeting.boundingBox();
        const emailBox = await email.boundingBox();
        const logoutBox = await logoutButton.boundingBox();

        expect(greetingBox?.y).toBeLessThan(emailBox.y);
        expect(emailBox?.y).toBeLessThan(logoutBox.y);
    });
});
