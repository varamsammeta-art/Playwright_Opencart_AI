import { Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;

  // Locators
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly warning: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.emailField = page.getByRole("textbox", { name: "E-Mail Address" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login", exact: true });
    this.warning = page.locator(".alert-danger");
  }

  /**
   * Verifies that the customer login form is displayed.
   * @returns True when the email field is visible.
   */
  async isLoginPageExists(): Promise<boolean> {
    return this.emailField.isVisible();
  }

  /**
   * Enters the supplied customer credentials and submits the login form.
   * @param email - Customer email, which may be empty.
   * @param password - Customer password, which may be empty.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await this.emailField.fill(email);
      await this.passwordField.fill(password);
      await this.loginButton.click();
    } catch (error) {
      console.log(`Error submitting customer login: ${error}`);
      throw error;
    }
  }

  /**
   * Reads the visible OpenCart login warning.
   * @returns The displayed warning text.
   */
  async getWarningMessage(): Promise<string> {
    await this.warning.waitFor({ state: "visible" });
    return (await this.warning.innerText()).trim();
  }
}
