const { test, expect } = require('@playwright/test');

test.describe('Feature: Log in', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.STUDENT_URL);
    });

    test('On every page of the site, a Profile button must be at the top-right of the page.  It should have have the attribute: data-testid="user-menu-button"', async ({ page }) => {
        let profileButton = await page.getByTestId('user-menu-button')
        await expect(profileButton).toBeVisible()
    })

    test('The menu must contain a "Log in" menu option.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await expect(page.getByText('Log in')).toBeVisible()
    })

    test('The menu must contain a "Sign up" menu option.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await expect(page.getByText('Sign up')).toBeVisible()
    })

    test('Upon clicking the "Log in" menu option, it opens a modal pop-up that prompts the Username and Password input boxes and a "Log in" button.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()
        await expect(page.getByTestId('login-modal')).toBeVisible()
        await expect(page.getByTestId('credential-input')).toBeVisible()
        await expect(page.getByTestId('password-input')).toBeVisible()
        await expect(page.getByTestId('login-button')).toBeVisible()
    })

    test('Within the modal, the "Log in" button must be disabled anytime the username is less than 4 characters or the password is less than 6 characters.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        const loginButton = page.getByTestId('login-button')
        await expect(loginButton).toBeDisabled()

        await page.getByTestId('credential-input').fill('abc')
        await page.getByTestId('password-input').fill('12345')
        await expect(loginButton).toBeDisabled()

        await page.getByTestId('credential-input').fill('abcd')
        await expect(loginButton).toBeDisabled()

        await page.getByTestId('password-input').fill('123456')
        await expect(loginButton).toBeEnabled()
    })

    test('Attempting to log in with an invalid username or password must prompt the error message "The provided credentials were invalid".', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await page.getByTestId('credential-input').fill('invaliduser')
        await page.getByTestId('password-input').fill('invalidpass')
        await page.getByTestId('login-button').click()

        await expect(page.getByText('The provided credentials were invalid')).toBeVisible()
    })

    test('Upon logging in with a valid username and password, it must successfully log-in the user and sets their session cookie.', async ({ page, context }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await page.getByTestId('credential-input').fill('demo@user.io')
        await page.getByTestId('password-input').fill('password')
        await page.getByTestId('login-button').click()

        const cookies = await context.cookies()
        const sessionCookie = cookies.find(cookie => cookie.name === 'XSRF-TOKEN')
        expect(sessionCookie).toBeTruthy()
    })

    test('Upon logging in with a valid username and password, the "Log in" and "Sign up" buttons at the top of the page are hidden.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await page.getByTestId('credential-input').fill('demo@user.io')
        await page.getByTestId('password-input').fill('password')
        await page.getByTestId('login-button').click()

        await page.getByTestId('user-menu-button').click()
        await expect(page.getByText('Log in')).not.toBeVisible()
        await expect(page.getByText('Sign up')).not.toBeVisible()
    })

    test('Upon logging in with a valid username and password, it shows the User Menu Button.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await page.getByTestId('credential-input').fill('demo@user.io')
        await page.getByTestId('password-input').fill('password')
        await page.getByTestId('login-button').click()

        await expect(page.getByTestId('user-menu-button')).toBeVisible()
    })

    test('In the log-in modal, an extra link or button is available with the label "Log in as Demo User". Upon clicking this "Log in as Demo User" button, it will log the user into the "demo" account.', async ({ page, context }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await expect(page.getByText(/demo user/i)).toBeVisible();
        await page.getByText(/demo user/i).click()

        const cookies = await context.cookies()
        const sessionCookie = cookies.find(cookie => cookie.name === 'XSRF-TOKEN')
        expect(sessionCookie).toBeTruthy()

        await expect(page.getByTestId('user-menu-button')).toBeVisible()
    })

    test('Upon closing the log-in modal, it resets errors and clears all data entered. When it reopens it will be in the default state (empty inputs and disabled button).', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await page.getByTestId('credential-input').fill('invaliduser')
        await page.getByTestId('password-input').fill('invalidpass')
        await page.getByTestId('login-button').click()

        await expect(page.getByText('The provided credentials were invalid')).toBeVisible()

        await page.mouse.click(0, 0);
        await expect(page.getByTestId('login-modal')).not.toBeVisible()

        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        await expect(page.getByTestId('credential-input')).toHaveValue('')
        await expect(page.getByTestId('password-input')).toHaveValue('')
        await expect(page.getByTestId('login-button')).toBeDisabled()
        await expect(page.getByText('The provided credentials were invalid')).not.toBeVisible()
    })

    test('The layout and element positioning is equivalent to the wireframes.', async ({ page }) => {
        await page.getByTestId('user-menu-button').click()
        await page.getByText('Log in').click()

        const loginModal = await page.getByTestId('login-modal')
        const usernameInput = await page.getByTestId('credential-input')
        const passwordInput = await page.getByTestId('password-input')
        const loginButton = await page.getByTestId('login-button')

        await expect(loginModal).toBeVisible()

        const modalBoundingBox = await loginModal.boundingBox()
        const usernameBoundingBox = await usernameInput.boundingBox()
        const passwordBoundingBox = await passwordInput.boundingBox()
        const loginButtonBoundingBox = await loginButton.boundingBox()

        expect(usernameBoundingBox.y).toBeLessThan(passwordBoundingBox.y)

        expect(loginButtonBoundingBox.y).toBeGreaterThan(passwordBoundingBox.y)

        expect(usernameBoundingBox.x).toBeGreaterThan(modalBoundingBox.x)
        expect(passwordBoundingBox.x).toBeGreaterThan(modalBoundingBox.x)
        expect(loginButtonBoundingBox.x).toBeGreaterThan(modalBoundingBox.x)
    })
});
