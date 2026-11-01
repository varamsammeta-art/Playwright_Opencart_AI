import { test, expect } from "../../fixtures/pageFixtures";
import { Helper } from "../../utils/helper";

test("Product search test @master @sanity @regression @web", async ({
  homePage,
  searchResultsPage,
}) => {
  const { productName } = Helper.getProductDetails();

  await test.step("1) Search for the known product", async () => {
    await homePage.searchForProduct(productName);
    expect(
      await searchResultsPage.isSearchResultsPageDisplayed(productName),
    ).toBeTruthy();
    expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
  });

  console.log("✅ Product search returned the expected product.");
});
