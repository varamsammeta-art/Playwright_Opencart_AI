import { Locator, Page } from "@playwright/test";

export class SearchResultsPage {
  private readonly page: Page;

  // Locators
  private readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.pageHeading = page.getByRole("heading", { level: 1 });
  }

  /**
   * Verifies that the search results page identifies the search term.
   * @param searchTerm - Product search term.
   * @returns True when the page heading contains the term.
   */
  async isSearchResultsPageDisplayed(searchTerm: string): Promise<boolean> {
    return (await this.pageHeading.innerText()).includes(searchTerm);
  }

  /**
   * Verifies that a matching product is listed.
   * @param productName - Expected product name.
   * @returns True when the product link is visible.
   */
  async isProductDisplayed(productName: string): Promise<boolean> {
    return this.page
      .getByRole("link", { name: productName, exact: true })
      .first()
      .isVisible();
  }

  /**
   * Opens the matching product from search results.
   * @param productName - Product name to open.
   */
  async openProduct(productName: string): Promise<void> {
    await this.page
      .getByRole("link", { name: productName, exact: true })
      .first()
      .click();
  }
}
