# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\add-to-cart.spec.ts >> Add product to shopping cart test @master @sanity @regression @web
- Location: tests\web\add-to-cart.spec.ts:4:5

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
  4  | test("Add product to shopping cart test @master @sanity @regression @web", async ({
  5  |   homePage,
  6  |   searchResultsPage,
  7  |   productPage,
  8  |   cartPage,
  9  | }) => {
  10 |   const { productName, totalPrice } = Helper.getProductDetails();
  11 |   const quantity = "2";
  12 | 
  13 |   await test.step("1) Search for and open the product", async () => {
  14 |     await homePage.searchForProduct(productName);
> 15 |     expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
     |                                                                     ^ Error: expect(received).toBeTruthy()
  16 |     await searchResultsPage.openProduct(productName);
  17 |     expect(
  18 |       await productPage.isProductDetailsDisplayed(productName),
  19 |     ).toBeTruthy();
  20 |   });
  21 | 
  22 |   await test.step("2) Add the requested quantity", async () => {
  23 |     await productPage.setQuantity(quantity);
  24 |     await productPage.addToCart();
  25 |     expect(
  26 |       await productPage.isAddToCartConfirmationDisplayed(),
  27 |     ).toBeTruthy();
  28 |   });
  29 | 
  30 |   await test.step("3) Verify the product and quantity in the cart", async () => {
  31 |     await homePage.openShoppingCart();
  32 |     expect(await cartPage.isShoppingCartPageDisplayed()).toBeTruthy();
  33 |     expect(await cartPage.isProductInCart(productName)).toBeTruthy();
  34 |     const details = await cartPage.getProductDetails(productName);
  35 |     expect(details.quantity).toBe(quantity);
  36 |     expect(details.unitPrice).toContain(totalPrice);
  37 |     expect(Number(details.lineTotal.replace(/[^\d.]/g, ""))).toBe(
  38 |       Number(totalPrice.replace(/[^\d.]/g, "")) * Number(quantity),
  39 |     );
  40 |   });
  41 | 
  42 |   console.log("✅ Product was added to the cart with the requested quantity.");
  43 | });
  44 | 
```