import { test, expect } from "../../fixtures/pageFixtures";
import { Helper } from "../../utils/helper";

test("End-to-end customer shopping flow @master @regression @end-to-end @web", async ({
  homePage,
  registerPage,
  loginPage,
  accountPage,
  logoutPage,
  searchResultsPage,
  productPage,
  cartPage,
}) => {
  const customer = Helper.getRegistrationDetails();
  const { productName, totalPrice } = Helper.getProductDetails();

  await test.step("1) Register a new customer", async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    expect(await registerPage.isRegistrationPageExists()).toBeTruthy();
    await registerPage.completeRegistration(customer);
    expect(await registerPage.isRegistrationSuccessDisplayed()).toBeTruthy();
  });

  await test.step("2) Log out and log in with the new customer", async () => {
    await accountPage.clickLogout();
    expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
    await logoutPage.clickContinue();
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.login(customer.email, customer.password);
    expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
  });

  await test.step("3) Search for and open the product", async () => {
    await homePage.searchForProduct(productName);
    expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
    await searchResultsPage.openProduct(productName);
    expect(
      await productPage.isProductDetailsDisplayed(productName),
    ).toBeTruthy();
  });

  await test.step("4) Add the product and verify cart details", async () => {
    await productPage.setQuantity("1");
    await productPage.addToCart();
    expect(
      await productPage.isAddToCartConfirmationDisplayed(),
    ).toBeTruthy();
    await homePage.openShoppingCart();
    expect(await cartPage.isShoppingCartPageDisplayed()).toBeTruthy();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();

    const details = await cartPage.getProductDetails(productName);
    expect(details.quantity).toBe("1");
    expect(details.unitPrice).toContain(totalPrice);
    expect(details.lineTotal).toContain(totalPrice);
    expect(await cartPage.getGrandTotal()).toContain(totalPrice);
  });

  console.log("✅ End-to-end customer shopping flow completed successfully.");
});
