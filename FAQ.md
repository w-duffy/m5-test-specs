# FAQ

🌟 Unlike Mod 4, it is not required to pass this test suite to pass Mod 5. 🌟

The test suite is designed to be used as a way to confirm you're passing before Monday.  It allows you to test your app end-to-end and ensure you didn't miss anything or modify a piece of your app that broke something you did earlier.


## Using the Test Suite; TLDR.

- ✅ Do finish your app without the specs first, and only use the specs as a way to confirm you're passing before Monday.
- ✅ Do add test identifiers as outlined in the README.
- ✅ Do use the specs locally.  You do not need to retest them in production, but still push your code to production when you're done.
- ✅ Do run tests individually or in smaller subsets.
- ✅ Do use the specs if you want to confirm that you're passing before Monday.
- ✅ Do rerun specs you missed in case the test flaked. You can get green checks, leave the specs open, fix any bugs, rerun the missed specs, and accumulate a full set of green checks. That is passing.

- ❌ Don't use the specs until you've completed your features.
- ❌ Don't run the entire suite of tests all at the same time until you're comfortable with how they work.
- ❌ Don't stay stuck on a single spec if you think it's not working. The tests all run independently, so you can get points elsewhere and return to specs you're missing later when you're more familiar with how they work.
- ❌ Don't burn yourself out trying to figure out how to use the specs.  We've been trucking all week so take a pit stop before you keep going.  Remember, the specs are just a way for you to confirm you're passing _before_ Monday.


## Starting with the Test Suite

Before using this test suite, you should focus on finishing your app. This test suite serves as a way for you to test your app end-to-end and ensure you didn't miss anything or modify a piece of your app that broke something you did earlier.

Ultimately, the specs are a way for you to confirm you're passing _before_ Monday.  If you're feeling burnt out from trucking all week, you can simply move on and either revisit this later or wait until normal grading on Monday.


## The M5 Specs are Optional

This test suite is not being used like the Mod 4 test suite. The Mod 4 tests were **required** for grading. This was possible in Mod 4 because there wasn't any room for interpretation: for any given request, there should only have been one exact response.

On the other hand, M5 has more room for flexibility. For example, you _could_ use only `div`s and get your app working. Or, you might take a more [semantic](https://web.dev/learn/html/semantic-html) approach and end up with a variety of HTML elements. The latter is preferable but wasn't required.

---

### Do I have to pass these specs to pass the Mod 5 Project?

No, you don't have to pass these specs to pass Mod 5.  However, the tests do ensure you didn't miss anything, and allow you to know you're passing before Monday.

---

### Why would I use the Specs?

You can use this test suite to confirm you're passing before Monday on your own time. Some students really like knowing they're passing, so this is a way for them to do that.

---

### What is the difference between manual grading and the specs?

The specs are predictable. They will always perform the same operations in the same order every single time.

A user, on the other hand, is unpredictable. The specs attempt to simulate a user's (the instructor's) interaction with your app, but it's difficult to test every scenario for how a user could interact with your app.

---

### Nothing is working. Are the specs broken?

If none of your tests are passing, it's likely that you didn't add test identifiers yet. Please reference the README and the walkthrough recording for more information.
