import { test, expect } from "../../fixtures/pageFixtures";
import dotenv from "dotenv";
import { Helper } from "../../utils/helper";
import { executeQuery } from "../../utils/dbClient";

dotenv.config();

type CustomerRecord = {
  customer_id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: number;
  date_added: Date | string | null;
};

test("Registered customer matches Admin and MySQL records @master @regression @db @end-to-end", async ({
  homePage,
  registerPage,
  adminPage,
}) => {
  const customer = Helper.getRegistrationDetails();
  customer.email = customer.email.replace(
    "@",
    `+${Date.now()}@`,
  );
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be configured.");
  }

  try {
    await test.step("1) Register a unique customer through the frontend", async () => {
      await homePage.clickMyAccount();
      await homePage.clickRegister();
      expect(await registerPage.isRegistrationPageExists()).toBeTruthy();

      await registerPage.completeRegistration(customer);
      expect(await registerPage.isRegistrationSuccessDisplayed()).toBeTruthy();
    });

    await test.step("2) Verify the registered customer in the Admin Portal", async () => {
      await adminPage.login(adminUsername, adminPassword);
      await adminPage.openCustomers();
      const customerRow = await adminPage.findCustomerByEmail(customer.email);
      await expect(customerRow).toContainText(customer.firstName);
      await expect(customerRow).toContainText(customer.lastName);
      await expect(customerRow).toContainText("Enabled");

      await adminPage.openCustomerDetails(customerRow);
      const customerDetails = await adminPage.getCustomerDetails();
      expect(customerDetails.firstName, "Admin first name should match").toBe(
        customer.firstName,
      );
      expect(customerDetails.lastName, "Admin last name should match").toBe(
        customer.lastName,
      );
      expect(customerDetails.email, "Admin email should match").toBe(customer.email);
      expect(customerDetails.status, "Registered customer should be enabled").toBe(
        "1",
      );
    });

    await test.step("3) Verify the customer record in MySQL", async () => {
      const result = (await executeQuery(
        "SELECT customer_id, firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?",
        [customer.email],
      )) as CustomerRecord[];

      expect(result.length, "Exactly one matching customer should exist in MySQL").toBe(
        1,
      );
      const [record] = result;
      expect(record.firstname, "Database first name should match").toBe(
        customer.firstName,
      );
      expect(record.lastname, "Database last name should match").toBe(
        customer.lastName,
      );
      expect(record.email, "Database email should match").toBe(customer.email);
      expect(record.status, "Database customer status should be enabled").toBe(1);
      expect(record.date_added, "Database date_added should be populated").toBeTruthy();
    });

    console.log("✅ Customer matched across frontend, Admin Portal, and MySQL.");
  } finally {
    await executeQuery("DELETE FROM oc_customer WHERE email = ?", [customer.email]);
  }
});
