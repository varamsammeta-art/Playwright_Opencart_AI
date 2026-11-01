import { Locator, Page } from "@playwright/test";

export class HomePage {
  private readonly page: Page;

  // Locators
  private readonly accountMenu: Locator;
  private readonly accountNavigation: Locator;
  private readonly searchField: Locator;
  private readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.accountMenu = page
      .getByRole("navigation")
      .getByRole("link", { name: /My Account/ });
    this.accountNavigation = page.getByRole("navigation");
    this.searchField = page.getByRole("textbox", { name: "Search" });
    this.shoppingCartLink = page
      .getByRole("navigation")
      .getByRole("link", { name: /Shopping Cart/ });
  }

  /**
   * Opens the My Account menu.
   */
  async clickMyAccount(): Promise<void> {
    await this.accountMenu.click();
  }

  /**
   * Opens the customer login page from the account menu.
   */
  async clickLogin(): Promise<void> {
    await this.accountNavigation
      .getByRole("link", { name: "Login", exact: true })
      .click();
  }

  /**
   * Opens the customer registration page from the account menu.
   */
  async clickRegister(): Promise<void> {
    await this.accountNavigation
      .getByRole("link", { name: "Register", exact: true })
      .click();
  }

  /**
   * Searches the catalog for a product.
   * @param productName - Product to search for.
   */
  async searchForProduct(productName: string): Promise<void> {
    await this.searchField.fill(productName);
    await this.searchField.press("Enter");
  }

  /**
   * Opens the shopping cart.
   */
  async openShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}
