import { resolve } from "node:path";
import { test, expect } from "../../fixtures/pageFixtures";
import { DataProvider } from "../../utils/DataReader";

type LoginData = {
  email: string;
  password: string;
  expected: "success" | "failure";
};

const loginDataRows = DataProvider.readJson(
  resolve(__dirname, "../../testdata/opencart_logindata.json"),
) as LoginData[];
const validLoginData = loginDataRows.find((row) => row.expected === "success");

if (!validLoginData) {
  throw new Error("Login test data must contain a row with expected: success.");
}

test("Valid customer login test @master @sanity @regression @web", async ({
  homePage,
  loginPage,
  accountPage,
}) => {
  await test.step("1) Navigate to My Account > Login", async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageExists()).toBeTruthy();
  });

  await test.step("2) Log in using configured customer credentials", async () => {
    await loginPage.login(validLoginData.email, validLoginData.password);
    expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    expect(await accountPage.isAuthenticatedNavigationVisible()).toBeTruthy();
  });

  console.log("✅ Customer login completed successfully.");
});
