import { Locator, Page } from "@playwright/test";

export type CartProductDetails = {
  quantity: string;
  unitPrice: string;
  lineTotal: string;
};

export class CartPage {
  private readonly page: Page;

  // Locators
  private readonly cartHeading: Locator;
  private readonly grandTotalRow: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.cartHeading = page.getByRole("heading", {
      name: /^Shopping Cart/,
    });
    this.grandTotalRow = page
      .getByRole("row")
      .filter({ has: page.getByText("Total:", { exact: true }) });
  }

  /**
   * Verifies that the shopping cart is displayed.
   * @returns True when the cart heading is visible.
   */
  async isShoppingCartPageDisplayed(): Promise<boolean> {
    return this.cartHeading.isVisible();
  }

  /**
   * Verifies that the expected product is in the shopping cart.
   * @param productName - Expected cart product.
   * @returns True when its cart row is visible.
   */
  async isProductInCart(productName: string): Promise<boolean> {
    return this.productRow(productName).isVisible();
  }

  /**
   * Reads the requested product's cart quantity and prices.
   * @param productName - Product row to inspect.
   * @returns The displayed quantity, unit price, and line total.
   */
  async getProductDetails(productName: string): Promise<CartProductDetails> {
    const row = this.productRow(productName);
    const cells = row.getByRole("cell");

    return {
      quantity: await row.getByRole("textbox").inputValue(),
      unitPrice: (await cells.nth(4).innerText()).trim(),
      lineTotal: (await cells.nth(5).innerText()).trim(),
    };
  }

  /**
   * Reads the displayed grand total.
   * @returns Cart grand total text.
   */
  async getGrandTotal(): Promise<string> {
    return (await this.grandTotalRow.getByRole("cell").nth(1).innerText()).trim();
  }

  private productRow(productName: string): Locator {
    return this.page
      .getByRole("row")
      .filter({
        has: this.page.getByRole("link", {
          name: productName,
          exact: true,
        }),
      });
  }
}
