import { resolve } from "node:path";
import { test, expect } from "../../fixtures/pageFixtures";
import { DataProvider } from "../../utils/DataReader";

type LoginData = {
  testName?: string;
  TestName?: string;
  email: string;
  password: string;
  expected: "success" | "failure";
};

const loginDataRows = DataProvider.readJson(
  resolve(__dirname, "../../testdata/opencart_logindata.json"),
) as LoginData[];

for (const [index, row] of loginDataRows.entries()) {
  const testName = row.testName ?? row.TestName ?? `Login data row ${index + 1}`;

  test(`${testName} row ${index + 1} @master @datadriven @web`, async ({
    homePage,
    loginPage,
    accountPage,
  }) => {
    const email = row.email.trim() ? row.email : "";
    const password = row.password.trim() ? row.password : "";

    await test.step("1) Open the login page", async () => {
      await homePage.clickMyAccount();
      await homePage.clickLogin();
      expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step("2) Submit this row's credentials and verify the result", async () => {
      await loginPage.login(email, password);

      if (row.expected === "success") {
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
      } else {
        const warningMessage = await loginPage.getWarningMessage();
        expect(warningMessage).toMatch(
          /^Warning: (No match for E-Mail Address and\/or Password|Your account has exceeded allowed number of login attempts)/,
        );
        expect(await accountPage.isMyAccountPageExists()).toBeFalsy();
      }
    });

    console.log(`✅ Data-driven login row ${index + 1} validated.`);
  });
}
