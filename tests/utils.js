export function createUniqueUser() {
  return {
    firstName: "Fakey",
    lastName: "McFakeFake",
    email: `${generateUniqueUsername()}@test.com`,
    username: generateUniqueUsername(),
    password: "secret password",
  };
}
export function generateUniqueUsername() {
  const letters = Array.from({ length: 6 }, () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  ).join("");
  const numbers = Math.floor(Math.random() * 9000) + 1000;
  const timestamp = Date.now();
  return `${letters}${numbers}${timestamp}`;
}

export async function createSpotAndSingleReview(page){
  const dummyData = createUniqueUser();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Log In").click();
  await page.getByTestId("demo-user-login").click();
  await page.waitForTimeout(1000);
  await page.getByTestId("create-new-spot-button").click()
  await page.getByPlaceholder("Country").click();
  await page.getByPlaceholder("Country").fill(`${dummyData.username} United`);
  await page.getByPlaceholder("Street Address").click();
  await page
    .getByPlaceholder("Street Address")
    .fill(`${dummyData.username} Lane`);
  await page.getByPlaceholder("City").click();
  await page.getByPlaceholder("City").fill(`Fort ${dummyData.username}`);
  await page.getByPlaceholder("State").click();
  await page.getByPlaceholder("State").fill(`New ${dummyData.username}`);
  await page.getByPlaceholder("Please write at least 30").click();
  await page
    .getByPlaceholder("Please write at least 30")
    .fill(
      `Great Spot! ${dummyData.username} ${dummyData.username}. See you there!`
    );
  await page.getByPlaceholder("Name of your spot").click();
  await page
    .getByPlaceholder("Name of your spot")
    .fill(`Cozy ${dummyData.username} Cabin`);
  await page.getByPlaceholder("Price per night (USD)").click();
  await page.getByPlaceholder("Price per night (USD)").fill("350");
  await page.getByPlaceholder("Preview Image URL").click();
  await page.getByPlaceholder("Preview Image URL").click();
  await page
    .getByPlaceholder("Preview Image URL")
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(1).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(1)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(2).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(2)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(3).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(3)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(4).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(4)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByRole("button", { name: "Create Spot" }).click();
  await page.waitForTimeout(2000);
  let url = page.url();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("button", { name: "Log Out" }).click();
  await page.waitForTimeout(2000);
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Sign Up").click();

  await page.getByTestId("first-name-input").click();
  await page.getByTestId("first-name-input").fill(`Fakey${dummyData.username}`);
  await page.getByTestId("first-name-input").press("Tab");
  await page.getByTestId("last-name-input").fill(`W${dummyData.username}`);
  await page.getByTestId("last-name-input").press("Tab");
  await page
    .getByTestId("email-input")
    .fill(`${dummyData.username}@test.com`);
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("username-input").fill(dummyData.username);
  await page.getByTestId("username-input").press("Tab");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("password-input").press("Tab");
  await page.getByTestId("confirm-password-input").fill("password");
  await page.getByTestId("form-sign-up-button").click();
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByTestId("review-button").click();
  await page.getByPlaceholder("Leave your review here...").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill("Nice spot!!!!!!!!!");


    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }

  await page.getByRole("button", { name: "Submit Your Review" }).click();
}


export async function signUpUser(page) {
  const user = createUniqueUser();
  await page.goto(process.env.STUDENT_URL);
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Sign Up").click();
  await page.getByTestId("first-name-input").click();
  await page.getByTestId("first-name-input").fill(`Fakey${user.username}`);
  await page.getByTestId("first-name-input").press("Tab");
  await page.getByTestId("last-name-input").fill(`W${user.lastName}`);
  await page.getByTestId("last-name-input").press("Tab");
  await page.getByTestId("email-input").fill(user.email);
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("username-input").fill(user.username);
  await page.getByTestId("username-input").press("Tab");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("password-input").press("Tab");
  await page.getByTestId("confirm-password-input").fill("password");
  await page.getByTestId("form-sign-up-button").click();
}


export async function createSpot(page, dummyData = createUniqueUser()) {
  await page.getByTestId("create-new-spot-button").click()
  // await page.getByRole("link", { name: "Create a New Spot" }).click();
  await page.getByTestId("create-new-spot-button").click();
  await page.getByPlaceholder("Country").click();
  await page.getByPlaceholder("Country").fill("Middle Earth");
  await page.getByPlaceholder("Street Address").click();
  await page
    .getByPlaceholder("Street Address")
    .fill(`Fake Street ${dummyData.username}`);
  await page.getByPlaceholder("City").click();
  await page.getByPlaceholder("City").fill("Fake City");
  await page.getByPlaceholder("State").click();
  await page.getByPlaceholder("State").fill("Texas");
  await page.getByPlaceholder("Please write at least 30").click();
  await page
    .getByPlaceholder("Please write at least 30")
    .fill("This is a great fake spot for testing reviews");
  await page.getByPlaceholder("Name of your spot").click();
  await page
    .getByPlaceholder("Name of your spot")
    .fill(`Fake Spot ${dummyData.username}`);
  await page.getByPlaceholder("Price per night (USD)").click();
  await page.getByPlaceholder("Price per night (USD)").fill("100");
  await page.getByPlaceholder("Preview Image URL").click();
  await page
    .getByPlaceholder("Preview Image URL")
    .fill(
      "https://www.jamesedition.com/stories/wp-content/uploads/2022/03/mansions_main_fin.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(1).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(1)
    .fill(
      "https://www.jamesedition.com/stories/wp-content/uploads/2022/03/mansions_main_fin.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(2).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(2)
    .fill(
      "https://www.jamesedition.com/stories/wp-content/uploads/2022/03/mansions_main_fin.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(3).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(3)
    .fill(
      "https://www.jamesedition.com/stories/wp-content/uploads/2022/03/mansions_main_fin.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(4).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(4)
    .fill(
      "https://www.jamesedition.com/stories/wp-content/uploads/2022/03/mansions_main_fin.jpg"
    );
  await page.getByRole("button", { name: "Create Spot" }).click();
}

export async function createReview(page) {
  let reviewDetails = generateUniqueUsername()
  await signUpUser(page);
  await page.getByTestId("spot-tile").first().click();
  await page.getByTestId("review-button").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill(`This is an awesome review comment for testing! ${reviewDetails}`);
    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }
  await page.getByRole("button", { name: "Submit Your Review" }).click();
}

export async function logOutUser(page) {
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("button", { name: "Log Out" }).click();
}


export async function loginDemoUser(page) {
  await page.getByTestId("user-menu-button").click();

  await page.getByText("Log in").click();
  await page.getByTestId("credential-input").fill("demo@user.io");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("login-button").click();
}


export async function clearSession(page) {
  await page.context().clearCookies();
  await page.context().clearPermissions();
  await page.evaluate(() => localStorage.clear());
}

export async function createReviewByDemo(page) {

  let reviewDetails = generateUniqueUsername()
  await page.getByTestId("review-button").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill(`This is an awesome review comment for testing! ${reviewDetails}`);

    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }


  await page.getByRole("button", { name: "Submit Your Review" }).click();
}















export async function encapsulateSpotCreation(page, dummyData = createUniqueUser()){
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Log In").click();
  await page.getByTestId("demo-user-login").click();
  await page.waitForTimeout(2000);
  await page.getByTestId("create-new-spot-button").click();
  await page.getByPlaceholder("Country").click();
  await page.getByPlaceholder("Country").fill(`${dummyData.username} United`);
  await page.getByPlaceholder("Street Address").click();
  await page
    .getByPlaceholder("Street Address")
    .fill(`${dummyData.username} Lane`);
  await page.getByPlaceholder("City").click();
  await page.getByPlaceholder("City").fill(`Fort ${dummyData.username}`);
  await page.getByPlaceholder("State").click();
  await page.getByPlaceholder("State").fill(`New ${dummyData.username}`);
  await page.getByPlaceholder("Please write at least 30").click();
  await page
    .getByPlaceholder("Please write at least 30")
    .fill(
      `Great Spot! ${dummyData.username} ${dummyData.username}. See you there!`
    );
  await page.getByPlaceholder("Name of your spot").click();
  await page
    .getByPlaceholder("Name of your spot")
    .fill(`Cozy ${dummyData.username} Cabin`);
  await page.getByPlaceholder("Price per night (USD)").click();
  await page.getByPlaceholder("Price per night (USD)").fill("350");
  await page.getByPlaceholder("Preview Image URL").click();
  await page.getByPlaceholder("Preview Image URL").click();
  await page
    .getByPlaceholder("Preview Image URL")
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(1).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(1)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(2).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(2)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(3).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(3)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(4).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(4)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByRole("button", { name: "Create Spot" }).click();
}



export async function encapsulateUserCreation(page){
  const dummyData = createUniqueUser();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("button", { name: "Log Out" }).click();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Sign Up").click();

  await page.getByTestId("first-name-input").click();
  await page.getByTestId("first-name-input").fill(dummyData.username);
  await page.getByTestId("first-name-input").press("Tab");
  await page.getByTestId("last-name-input").fill(dummyData.username);
  await page.getByTestId("last-name-input").press("Tab");
  await page
    .getByTestId("email-input")
    .fill(`${dummyData.username}@test.com`);
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("username-input").fill(dummyData.username);
  await page.getByTestId("username-input").press("Tab");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("password-input").press("Tab");
  await page.getByTestId("confirm-password-input").fill("password");
  await page.getByTestId("form-sign-up-button").click()
}

export async function createSpotAndMultiReviews(page){

  const dummyData2 = createUniqueUser();
  await encapsulateSpotCreation(page, dummyData2)
  await page.waitForTimeout(2000);
  let url = page.url();
  await encapsulateUserCreation(page)
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByTestId("review-button").click();
  await page.getByPlaceholder("Leave your review here...").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill("Nice spot!!!!!!!!!");
    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }

  await page.getByRole("button", { name: "Submit Your Review" }).click();

  await encapsulateUserCreation(page)
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByTestId("review-button").click();
  await page.getByPlaceholder("Leave your review here...").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill("Nice spot!!!!!!!!!");
    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }

  await page.getByRole("button", { name: "Submit Your Review" }).click();
}




export async function createSpotAndNoReview(page){
  const dummyData = createUniqueUser();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Log In").click();
  await page.getByTestId("demo-user-login").click();
  await page.getByTestId("create-new-spot-button").click();
  await page.getByPlaceholder("Country").click();
  await page.getByPlaceholder("Country").fill(`${dummyData.username} United`);
  await page.getByPlaceholder("Street Address").click();
  await page
    .getByPlaceholder("Street Address")
    .fill(`${dummyData.username} Lane`);
  await page.getByPlaceholder("City").click();
  await page.getByPlaceholder("City").fill(`Fort ${dummyData.username}`);
  await page.getByPlaceholder("State").click();
  await page.getByPlaceholder("State").fill(`New ${dummyData.username}`);
  await page.getByPlaceholder("Please write at least 30").click();
  await page
    .getByPlaceholder("Please write at least 30")
    .fill(
      `Great Spot! ${dummyData.username} ${dummyData.username}. See you there!`
    );
  await page.getByPlaceholder("Name of your spot").click();
  await page
    .getByPlaceholder("Name of your spot")
    .fill(`Cozy ${dummyData.username} Cabin`);
  await page.getByPlaceholder("Price per night (USD)").click();
  await page.getByPlaceholder("Price per night (USD)").fill("350");
  await page.getByPlaceholder("Preview Image URL").click();
  await page.getByPlaceholder("Preview Image URL").click();
  await page
    .getByPlaceholder("Preview Image URL")
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(1).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(1)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(2).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(2)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(3).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(3)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(4).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(4)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByRole("button", { name: "Create Spot" }).click();
  await page.waitForTimeout(2000);
  let url = page.url();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("button", { name: "Log Out" }).click();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Sign Up").click();

  await page.getByTestId("first-name-input").click();
  await page.getByTestId("first-name-input").fill(`Fakey ${dummyData.username}`);
  await page.getByTestId("first-name-input").press("Tab");
  await page.getByTestId("last-name-input").fill(dummyData.username);
  await page.getByTestId("last-name-input").press("Tab");
  await page
    .getByTestId("email-input")
    .fill(`${dummyData.username}@test.com`);
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("username-input").fill(dummyData.username);
  await page.getByTestId("username-input").press("Tab");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("password-input").press("Tab");
  await page.getByTestId("confirm-password-input").fill("password");
  await page.getByTestId("form-sign-up-button").click();
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByTestId("review-button").click();
}


export async function createSpotAndNoReviewUserOnPage(page){
  const dummyData = createUniqueUser();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Log In").click();
  await page.getByTestId("demo-user-login").click();
  await page.getByTestId("create-new-spot-button").click();
  await page.getByPlaceholder("Country").click();
  await page.getByPlaceholder("Country").fill(`${dummyData.username} United`);
  await page.getByPlaceholder("Street Address").click();
  await page
    .getByPlaceholder("Street Address")
    .fill(`${dummyData.username} Lane`);
  await page.getByPlaceholder("City").click();
  await page.getByPlaceholder("City").fill(`Fort ${dummyData.username}`);
  await page.getByPlaceholder("State").click();
  await page.getByPlaceholder("State").fill(`New ${dummyData.username}`);
  await page.getByPlaceholder("Please write at least 30").click();
  await page
    .getByPlaceholder("Please write at least 30")
    .fill(
      `Great Spot! ${dummyData.username} ${dummyData.username}. See you there!`
    );
  await page.getByPlaceholder("Name of your spot").click();
  await page
    .getByPlaceholder("Name of your spot")
    .fill(`Cozy ${dummyData.username} Cabin`);
  await page.getByPlaceholder("Price per night (USD)").click();
  await page.getByPlaceholder("Price per night (USD)").fill("350");
  await page.getByPlaceholder("Preview Image URL").click();
  await page.getByPlaceholder("Preview Image URL").click();
  await page
    .getByPlaceholder("Preview Image URL")
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(1).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(1)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(2).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(2)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(3).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(3)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(4).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(4)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByRole("button", { name: "Create Spot" }).click();
  await page.waitForTimeout(2000);
  let url = page.url();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("button", { name: "Log Out" }).click();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Sign Up").click();


  await page.getByTestId("first-name-input").click();
  await page.getByTestId("first-name-input").fill(`Fakey ${dummyData.username}`);
  await page.getByTestId("first-name-input").press("Tab");
  await page.getByTestId("last-name-input").fill(dummyData.username);
  await page.getByTestId("last-name-input").press("Tab");
  await page
    .getByTestId("email-input")
    .fill(`${dummyData.username}@test.com`);
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("username-input").fill(dummyData.username);
  await page.getByTestId("username-input").press("Tab");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("password-input").press("Tab");
  await page.getByTestId("confirm-password-input").fill("password");
  await page.getByTestId("form-sign-up-button").click();
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
}













export async function updateReviewCountCheck(page, expect){

  const dummyData2 = createUniqueUser();
  await encapsulateSpotCreation(page, dummyData2)
  await page.waitForTimeout(2000);
  let url = page.url();
  await encapsulateUserCreation(page)
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);

  await page.getByTestId("review-button").click();
  await page.getByPlaceholder("Leave your review here...").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill("Nice spot!!!!!!!!!");

    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }

  await page.getByRole("button", { name: "Submit Your Review" }).click();
  await page.waitForTimeout(2000);
  const initialRating = await page
  .getByTestId("reviews-heading")
  .getByTestId("review-count")
  .textContent();
const initialReviewCount = await page
  .getByTestId("spot-callout-box")
  .getByTestId("review-count")
  .textContent();

  await encapsulateUserCreation(page)
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByTestId("review-button").click();
  await page.getByPlaceholder("Leave your review here...").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill("Nice spot!!!!!!!!!");

    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }

  await page.getByRole("button", { name: "Submit Your Review" }).click();
  await page.waitForTimeout(2000);

  const updatedRating = await page
  .getByTestId("reviews-heading")
  .getByTestId("review-count")
  .textContent();
const updatedReviewCount = await page
  .getByTestId("spot-callout-box")
  .getByTestId("review-count")
  .textContent();

expect(updatedRating).not.toEqual(initialRating);
expect(updatedReviewCount).not.toEqual(initialReviewCount);
}





export async function createSpotAndSingleReviewLogInDemoUser(page){
  const dummyData = createUniqueUser();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Log In").click();
  await page.getByTestId("demo-user-login").click();
  await page.getByTestId("create-new-spot-button").click()
  await page.getByPlaceholder("Country").click();
  await page.getByPlaceholder("Country").fill(`${dummyData.username} United`);
  await page.getByPlaceholder("Street Address").click();
  await page
    .getByPlaceholder("Street Address")
    .fill(`${dummyData.username} Lane`);
  await page.getByPlaceholder("City").click();
  await page.getByPlaceholder("City").fill(`Fort ${dummyData.username}`);
  await page.getByPlaceholder("State").click();
  await page.getByPlaceholder("State").fill(`New ${dummyData.username}`);
  await page.getByPlaceholder("Please write at least 30").click();
  await page
    .getByPlaceholder("Please write at least 30")
    .fill(
      `Great Spot! ${dummyData.username} ${dummyData.username}. See you there!`
    );
  await page.getByPlaceholder("Name of your spot").click();
  await page
    .getByPlaceholder("Name of your spot")
    .fill(`Cozy ${dummyData.username} Cabin`);
  await page.getByPlaceholder("Price per night (USD)").click();
  await page.getByPlaceholder("Price per night (USD)").fill("350");
  await page.getByPlaceholder("Preview Image URL").click();
  await page.getByPlaceholder("Preview Image URL").click();
  await page
    .getByPlaceholder("Preview Image URL")
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(1).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(1)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(2).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(2)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(3).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(3)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByPlaceholder("Image URL").nth(4).click();
  await page
    .getByPlaceholder("Image URL")
    .nth(4)
    .fill(
      "https://img.freepik.com/free-photo/3d-house-model-with-modern-architecture_23-2151004049.jpg"
    );
  await page.getByRole("button", { name: "Create Spot" }).click();
  await page.waitForTimeout(2000);
  let url = page.url();
  await page.getByTestId("user-menu-button").click();
  await page.getByRole("button", { name: "Log Out" }).click();
  await page.getByTestId("user-menu-button").click();
  await page.getByText("Sign Up").click();

  await page.getByTestId("first-name-input").click();
  await page.getByTestId("first-name-input").fill(`Fakey ${dummyData.username}`);
  await page.getByTestId("first-name-input").press("Tab");
  await page.getByTestId("last-name-input").fill(dummyData.username);
  await page.getByTestId("last-name-input").press("Tab");
  await page
    .getByTestId("email-input")
    .fill(`${dummyData.username}@test.com`);
  await page.getByTestId("email-input").press("Tab");
  await page.getByTestId("username-input").fill(dummyData.username);
  await page.getByTestId("username-input").press("Tab");
  await page.getByTestId("password-input").fill("password");
  await page.getByTestId("password-input").press("Tab");
  await page.getByTestId("confirm-password-input").fill("password");
  await page.getByTestId("form-sign-up-button").click();
  await page.waitForTimeout(2000);
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByTestId("review-button").click();
  await page.getByPlaceholder("Leave your review here...").click();
  await page
    .getByPlaceholder("Leave your review here...")
    .fill("Nice spot!!!!!!!!!");

    for (let star of await page.getByTestId("review-star-clickable").all()) {
      await star.click();
    }

  await page.getByRole("button", { name: "Submit Your Review" }).click();
  await logOutUser(page);
  await loginDemoUser(page);
  await page.goto(url);
  await page.waitForTimeout(2000);
}
