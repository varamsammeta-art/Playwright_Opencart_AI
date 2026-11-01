import { Locator, Page } from "@playwright/test";

export class AccountPage {
  private readonly page: Page;

  // Locators
  private readonly accountSidebar: Locator;
  private readonly myAccountLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.accountSidebar = page.getByRole("complementary");
    this.myAccountLink = this.accountSidebar.getByRole("link", {
      name: "My Account",
      exact: true,
    });
    this.logoutLink = this.accountSidebar.getByRole("link", {
      name: "Logout",
      exact: true,
    });
  }

  /**
   * Verifies that the authenticated My Account page is displayed.
   * @returns True when OpenCart's account page title is present.
   */
  async isMyAccountPageExists(): Promise<boolean> {
    return (await this.page.title()) === "My Account";
  }

  /**
   * Verifies that authenticated account navigation is available.
   * @returns True when My Account and Logout links are visible.
   */
  async isAuthenticatedNavigationVisible(): Promise<boolean> {
    return (
      (await this.myAccountLink.isVisible()) &&
      (await this.logoutLink.isVisible())
    );
  }

  /**
   * Opens the customer logout confirmation page.
   */
  async clickLogout(): Promise<void> {
    try {
      await this.logoutLink.click();
    } catch (error) {
      console.log(`Error logging out of customer account: ${error}`);
      throw error;
    }
  }
}
