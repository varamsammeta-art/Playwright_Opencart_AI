import { Locator, Page } from "@playwright/test";

export class ProductPage {
  private readonly page: Page;

  // Locators
  private readonly productHeading: Locator;
  private readonly quantityField: Locator;
  private readonly addToCartButton: Locator;
  private readonly addToCartConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.productHeading = page.getByRole("heading", { level: 1 });
    this.quantityField = page.getByRole("textbox", { name: "Qty" });
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.addToCartConfirmation = page.getByText(/Success: You have added/);
  }

  /**
   * Verifies that the expected product details are displayed.
   * @param productName - Expected product name.
   * @returns True when the heading matches the product.
   */
  async isProductDetailsDisplayed(productName: string): Promise<boolean> {
    return (await this.productHeading.innerText()) === productName;
  }

  /**
   * Sets the requested quantity.
   * @param quantity - Quantity to add to the cart.
   */
  async setQuantity(quantity: string): Promise<void> {
    await this.quantityField.fill(quantity);
  }

  /**
   * Adds the selected product to the shopping cart.
   */
  async addToCart(): Promise<void> {
    try {
      await this.addToCartButton.click();
    } catch (error) {
      console.log(`Error adding product to shopping cart: ${error}`);
      throw error;
    }
  }

  /**
   * Verifies that OpenCart displayed its add-to-cart confirmation.
   * @returns True when the confirmation is visible.
   */
  async isAddToCartConfirmationDisplayed(): Promise<boolean> {
    await this.addToCartConfirmation.waitFor({ state: "visible" });
    return true;
  }
}
