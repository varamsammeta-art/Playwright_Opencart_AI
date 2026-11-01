import { test, expect } from "../../fixtures/pageFixtures";
import { RandomDataUtil } from "../../utils/dataGenerator";

test("Invalid customer login test @master @sanity @regression @web", async ({
  homePage,
  loginPage,
  accountPage,
}) => {
  await test.step("1) Navigate to My Account > Login", async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageExists()).toBeTruthy();
  });

  await test.step("2) Submit invalid credentials and verify rejection", async () => {
    await loginPage.login(
      RandomDataUtil.getEmail(),
      RandomDataUtil.getPassword(),
    );
    expect(await loginPage.getWarningMessage()).toContain(
      "Warning: No match for E-Mail Address and/or Password.",
    );
    expect(await accountPage.isMyAccountPageExists()).toBeFalsy();
  });

  console.log("✅ Invalid customer login was rejected as expected.");
});
