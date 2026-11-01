import { test, expect } from "../../fixtures/pageFixtures";
import { Helper } from "../../utils/helper";

test("Add product to shopping cart test @master @sanity @regression @web", async ({
  homePage,
  searchResultsPage,
  productPage,
  cartPage,
}) => {
  const { productName, totalPrice } = Helper.getProductDetails();
  const quantity = "2";

  await test.step("1) Search for and open the product", async () => {
    await homePage.searchForProduct(productName);
    expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
    await searchResultsPage.openProduct(productName);
    expect(
      await productPage.isProductDetailsDisplayed(productName),
    ).toBeTruthy();
  });

  await test.step("2) Add the requested quantity", async () => {
    await productPage.setQuantity(quantity);
    await productPage.addToCart();
    expect(
      await productPage.isAddToCartConfirmationDisplayed(),
    ).toBeTruthy();
  });

  await test.step("3) Verify the product and quantity in the cart", async () => {
    await homePage.openShoppingCart();
    expect(await cartPage.isShoppingCartPageDisplayed()).toBeTruthy();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    const details = await cartPage.getProductDetails(productName);
    expect(details.quantity).toBe(quantity);
    expect(details.unitPrice).toContain(totalPrice);
    expect(Number(details.lineTotal.replace(/[^\d.]/g, ""))).toBe(
      Number(totalPrice.replace(/[^\d.]/g, "")) * Number(quantity),
    );
  });

  console.log("✅ Product was added to the cart with the requested quantity.");
});
