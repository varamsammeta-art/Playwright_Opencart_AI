import { Locator, Page, expect } from "@playwright/test";

export class AdminPage {
  private readonly page: Page;
  private readonly adminUrl: string;

  // Locators
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly securityNotificationClose: Locator;
  private readonly customersMenu: Locator;
  private readonly customersLink: Locator;
  private readonly emailFilter: Locator;
  private readonly filterButton: Locator;
  private readonly customerTable: Locator;

  constructor(page: Page, frontendUrl: string) {
    this.page = page;
    this.adminUrl = new URL("admin/index.php", frontendUrl).toString();

    // Initialize locators with CSS selectors
    this.usernameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.securityNotificationClose = page.locator(
      ".modal-dialog button.close",
    );
    this.customersMenu = page.locator("#menu-customer > a");
    this.customersLink = page
      .locator("#menu-customer ul a")
      .filter({ hasText: "Customers" })
      .first();
    this.emailFilter = page.locator("#input-email");
    this.filterButton = page.locator("#button-filter");
    this.customerTable = page.getByRole("table");
  }

  /**
   * Signs in to the OpenCart administration portal.
   * @param username - Configured administrator username.
   * @param password - Configured administrator password.
   */
  async login(username: string, password: string): Promise<void> {
    await this.page.goto(this.adminUrl);
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await expect(this.customersMenu).toBeVisible();
    if (await this.securityNotificationClose.isVisible()) {
      await this.securityNotificationClose.click();
    }
  }

  /**
   * Opens the customer listing in the administration portal.
   */
  async openCustomers(): Promise<void> {
    await this.customersMenu.click();
    await this.customersLink.click();
    await expect(this.emailFilter).toBeVisible();
  }

  /**
   * Searches the customer list by email and returns the matching row.
   * @param email - Unique customer email to search for.
   * @returns Locator for the matching customer row.
   */
  async findCustomerByEmail(email: string): Promise<Locator> {
    await this.emailFilter.fill(email);
    await this.filterButton.click();
    const row = this.customerTable.getByRole("row").filter({ hasText: email });
    await expect(row, `Admin should list customer ${email}`).toBeVisible();
    return row;
  }

  /**
   * Opens the selected customer record for detail validation.
   * @param row - Customer row from the filtered list.
   */
  async openCustomerDetails(row: Locator): Promise<void> {
    await row.getByRole("link").last().click();
    await expect(this.page.locator("#input-firstname")).toBeVisible();
  }

  /**
   * Reads the customer name and email from the detail form.
   * @returns The displayed first name, last name, and email.
   */
  async getCustomerDetails(): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  }> {
    return {
      firstName: await this.page.locator("#input-firstname").inputValue(),
      lastName: await this.page.locator("#input-lastname").inputValue(),
      email: await this.page.locator("#input-email").inputValue(),
      status: await this.page.locator("#input-status").inputValue(),
    };
  }
}
