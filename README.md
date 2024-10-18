# M5 Test Specs

This repository contains the test specs for the M5 project.  These tests are written using [Playwright](https://playwright.dev/docs/intro).

⭐ Note: Since everyone's project will be different, the tests depend on data attributes to identify elements.  Please see the below for more details.


## Setup and Usage
You can watch the walkthrough video on 2x speed in addition to the below instructions.

### Install Playwright and Dependencies
- `npm install`
- `npx playwright install --with-deps chromium`

### Add Environment Variables
Copy the `.env.example` file to a `.env` and add your test url:
- `cp .env.example .env`


### Local vs Prod Testing
If you're testing locally, start by running your backend and frontend.
- You'll need ensure your app is running before running the test specs.

The `.env` should point to either your local dev server, or your Render URL.
- The starter comes with the `STUDENT_URL` set to `http://localhost:5173`.
- You can change this to your Render url.  Note the lack of a trailing slash.


### Running the tests
> ⚠️ Before running the below command, please read the below section on adding test identifiers.
- `npx playwright test --ui`

## Adding Test Identifiers ⭐

Since everyone's project will be different, we can add attributes to elements so that Playwright can easily identify your interactive elements.

To add test identifiers, use the `data-testid` attribute.  To find the identifiers you'll need, you can check the test spec files in the `tests` directory.

Here is an example where identifiers are added to the login form:

```js
<form onSubmit={handleSubmit}>
  <label>
    Username or Email
    <input
      type="text"
      data-testid='credential-input' // Identifier
      value={credential}
      onChange={(e) => setCredential(e.target.value)}
      required
    />
  </label>
  <label>
    Password
    <input
      type="password"
      data-testid='password-input' // Identifier
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </label>
  {errors.credential && <p>{errors.credential}</p>}
  <button
  type="submit"
  data-testid='login-button' // Identifier
  >
  Log In
  </button>
</form>
```

And here's how you'll see these used in the test specs:
```js
await page.getByTestId('credential-input').fill('demo@user.io')
await page.getByTestId('password-input').fill('password')
await page.getByTestId('login-button').click()
```


## Quickstart -- Working with UI Mode

> 💡Enable Dark Mode
![dark mode](./screenshots/darkmode.png)

Click the green arrow circled in the screenshot below to run all tests:

![alt text](./screenshots/image.png)

Here is a screenshot where all tests are passing:

![alt text](./screenshots/image-1.png)

> 📖 You can read more details about UI Mode here: https://playwright.dev/docs/test-ui-mode#opening-ui-mode

## Rerun Failed Tests

Click the dropdown arrow circled in the screenshot below to open a specific spec.

Rerun failed tests by clicking the green arrow circled in the screenshot below.

![alt text](./screenshots/image-2.png)

 You can also rerun all tests for a spec by clicking the play button next to the spec name.

![alt text](./screenshots/image-3.png)

## Report Issues

If you find any issues with the tests, please DM me the details 🙏
