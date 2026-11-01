import { Locator, Page } from "@playwright/test";

export class LogoutPage {
  private readonly page: Page;

  // Locators
  private readonly logoutHeading: Locator;
  private readonly continueLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.logoutHeading = page.getByRole("heading", {
      name: "Account Logout",
      exact: true,
    });
    this.continueLink = page.getByRole("link", {
      name: "Continue",
      exact: true,
    });
  }

  /**
   * Verifies that the logout confirmation page is displayed.
   * @returns True when its heading is visible.
   */
  async isLogoutConfirmationDisplayed(): Promise<boolean> {
    return this.logoutHeading.isVisible();
  }

  /**
   * Returns from the logout confirmation to the storefront.
   */
  async clickContinue(): Promise<void> {
    await this.continueLink.click();
  }
}
