import { test, expect } from "../../fixtures/pageFixtures";
import { Helper } from "../../utils/helper";

test("Customer registration test @master @sanity @regression @web", async ({
  homePage,
  registerPage,
  accountPage,
}) => {
  const registrationData = Helper.getRegistrationDetails();

  await test.step("1) Navigate to My Account > Register", async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    expect(await registerPage.isRegistrationPageExists()).toBeTruthy();
  });

  await test.step("2) Register a new customer with unique details", async () => {
    await registerPage.completeRegistration(registrationData);
    expect(await registerPage.isRegistrationSuccessDisplayed()).toBeTruthy();
    expect(await accountPage.isAuthenticatedNavigationVisible()).toBeTruthy();
  });

  console.log("✅ Customer registration completed successfully.");
});
