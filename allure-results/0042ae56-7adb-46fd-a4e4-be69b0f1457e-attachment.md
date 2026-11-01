# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\end-to-end-shopping.spec.ts >> End-to-end customer shopping flow @master @regression @end-to-end @web
- Location: tests\web\end-to-end-shopping.spec.ts:4:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from "../../fixtures/pageFixtures";
  2  | import { Helper } from "../../utils/helper";
  3  | 
  4  | test("End-to-end customer shopping flow @master @regression @end-to-end @web", async ({
  5  |   homePage,
  6  |   registerPage,
  7  |   loginPage,
  8  |   accountPage,
  9  |   logoutPage,
  10 |   searchResultsPage,
  11 |   productPage,
  12 |   cartPage,
  13 | }) => {
  14 |   const customer = Helper.getRegistrationDetails();
  15 |   const { productName, totalPrice } = Helper.getProductDetails();
  16 | 
  17 |   await test.step("1) Register a new customer", async () => {
  18 |     await homePage.clickMyAccount();
  19 |     await homePage.clickRegister();
> 20 |     expect(await registerPage.isRegistrationPageExists()).toBeTruthy();
     |                                                           ^ Error: expect(received).toBeTruthy()
  21 |     await registerPage.completeRegistration(customer);
  22 |     expect(await registerPage.isRegistrationSuccessDisplayed()).toBeTruthy();
  23 |   });
  24 | 
  25 |   await test.step("2) Log out and log in with the new customer", async () => {
  26 |     await accountPage.clickLogout();
  27 |     expect(await logoutPage.isLogoutConfirmationDisplayed()).toBeTruthy();
  28 |     await logoutPage.clickContinue();
  29 |     await homePage.clickMyAccount();
  30 |     await homePage.clickLogin();
  31 |     await loginPage.login(customer.email, customer.password);
  32 |     expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
  33 |   });
  34 | 
  35 |   await test.step("3) Search for and open the product", async () => {
  36 |     await homePage.searchForProduct(productName);
  37 |     expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
  38 |     await searchResultsPage.openProduct(productName);
  39 |     expect(
  40 |       await productPage.isProductDetailsDisplayed(productName),
  41 |     ).toBeTruthy();
  42 |   });
  43 | 
  44 |   await test.step("4) Add the product and verify cart details", async () => {
  45 |     await productPage.setQuantity("1");
  46 |     await productPage.addToCart();
  47 |     expect(
  48 |       await productPage.isAddToCartConfirmationDisplayed(),
  49 |     ).toBeTruthy();
  50 |     await homePage.openShoppingCart();
  51 |     expect(await cartPage.isShoppingCartPageDisplayed()).toBeTruthy();
  52 |     expect(await cartPage.isProductInCart(productName)).toBeTruthy();
  53 | 
  54 |     const details = await cartPage.getProductDetails(productName);
  55 |     expect(details.quantity).toBe("1");
  56 |     expect(details.unitPrice).toContain(totalPrice);
  57 |     expect(details.lineTotal).toContain(totalPrice);
  58 |     expect(await cartPage.getGrandTotal()).toContain(totalPrice);
  59 |   });
  60 | 
  61 |   console.log("✅ End-to-end customer shopping flow completed successfully.");
  62 | });
  63 | 
```