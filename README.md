# M5 Test Specs

This repository contains the test specs for the M5 project.  These tests are written using the [Playwright](https://playwright.dev/) testing framework.

Plese note: these tests are a work in progress and are not yet complete.  Please report any issues you find.  Thank you!

## Setup and Usage

- Install the dependencies: `npm install`
- Run the tests: `npx playwright test --ui`

## Adding Test Identifiers
Since everyone's project will be different, we can add attributes to elements so that Playwright can easily identify the interactive elements.

To add test identifiers, use the `data-testid` attribute.  To find the identifiers you'll need, you can check the test spec files in the `tests` directory.

Here is an example where identifiers are added to the login form:

```js
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            data-testid='credential-input'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            data-testid='password-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button data-testid='login-button' type="submit">Log In</button>
      </form>
```



## Quickstart -- Working with UI Mode
> You can read more here: https://playwright.dev/docs/test-ui-mode#opening-ui-mode

Click the green arrow circled in the screenshot below to run all tests:

![alt text](./screenshots/image.png)


Here is a screenshot where all tests are passing:

![alt text](./screenshots/image-1.png)


## Rerun Failed Tests

Click the dropdown arrow circled in the screenshot below to open a specific spec.

Rerun failed tests by clicking the green arrow circled in the screenshot below.

![alt text](./screenshots/image-2.png)

 You can also rerun all tests for a spec by clicking the play button next to the spec name.

![alt text](./screenshots/image-3.png)
