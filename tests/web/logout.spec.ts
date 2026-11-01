import { test, expect } from "../../fixtures/pageFixtures";
import { Helper } from "../../utils/helper";

test("Customer logout test @master @sanity @regression @web", async ({
  homePage,
  registerPage,
  loginPage,
  accountPage,
  logoutPage,
}) => {
  const customer = Helper.getRegistrationDetails();

  await test.step("1) Register a customer for this isolated logout flow", async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    await registerPage.completeRegistration(customer);
    expect(await registerPage.isRegistrationSuccessDisplayed()).toBeTruthy();
    expect(await accountPage.isAuthenticatedNavigationVisible()).toBeTruthy();
  });

  await test.step("2) Log out and verify the confirmation", async () => {
    await accountPage.clickLogout();
    expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
    await logoutPage.clickContinue();
  });

  await test.step("3) Log in with the new customer's valid credentials", async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.login(customer.email, customer.password);
    expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
  });

  await test.step("4) Log out, continue, and verify authentication ended", async () => {
    await accountPage.clickLogout();
    expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
    await logoutPage.clickContinue();
    expect(await accountPage.isMyAccountPageExists()).toBeFalsy();
    expect(await accountPage.isAuthenticatedNavigationVisible()).toBeFalsy();
  });

  console.log("✅ Customer logout completed successfully.");
});
