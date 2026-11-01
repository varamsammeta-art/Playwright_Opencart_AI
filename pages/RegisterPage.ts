import { Locator, Page } from "@playwright/test";

export type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
};

export class RegisterPage {
  private readonly page: Page;

  // Locators
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly telephoneField: Locator;
  private readonly passwordField: Locator;
  private readonly passwordConfirmationField: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly registrationHeading: Locator;
  private readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.firstNameField = page.getByPlaceholder("First Name");
    this.lastNameField = page.getByPlaceholder("Last Name");
    this.emailField = page.getByPlaceholder("E-Mail");
    this.telephoneField = page.getByPlaceholder("Telephone");
    this.passwordField = page.getByPlaceholder("Password", { exact: true });
    this.passwordConfirmationField = page.getByPlaceholder("Password Confirm");
    this.privacyPolicyCheckbox = page.getByRole("checkbox");
    this.continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });
    this.registrationHeading = page.getByRole("heading", {
      name: "Register Account",
      exact: true,
    });
    this.successHeading = page.getByRole("heading", {
      name: "Your Account Has Been Created!",
      exact: true,
    });
  }

  /**
   * Verifies that the registration page is displayed.
   * @returns True when the registration heading is visible.
   */
  async isRegistrationPageExists(): Promise<boolean> {
    return this.registrationHeading.isVisible();
  }

  /**
   * Completes and submits the customer registration form.
   * @param data - Customer details to register.
   */
  async completeRegistration(data: RegistrationData): Promise<void> {
    try {
      await this.firstNameField.fill(data.firstName);
      await this.lastNameField.fill(data.lastName);
      await this.emailField.fill(data.email);
      await this.telephoneField.fill(data.telephone);
      await this.passwordField.fill(data.password);
      await this.passwordConfirmationField.fill(data.password);
      await this.privacyPolicyCheckbox.check();
      await this.continueButton.click();
    } catch (error) {
      console.log(`Error completing customer registration: ${error}`);
      throw error;
    }
  }

  /**
   * Verifies that registration succeeded.
   * @returns True when the account-created heading is visible.
   */
  async isRegistrationSuccessDisplayed(): Promise<boolean> {
    return this.successHeading.isVisible();
  }
}
