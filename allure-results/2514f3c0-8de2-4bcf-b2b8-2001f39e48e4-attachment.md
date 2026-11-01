# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\logout.spec.ts >> Customer logout test @master @sanity @regression @web
- Location: tests\web\logout.spec.ts:4:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost/opencart/upload/
Call log:
  - navigating to "http://localhost/opencart/upload/", waiting until "load"

```

# Test source

```ts
  1  | import { test as base } from "@playwright/test";
  2  | import dotenv from "dotenv";
  3  | import { AccountPage } from "../pages/AccountPage";
  4  | import { AdminPage } from "../pages/AdminPage";
  5  | import { CartPage } from "../pages/CartPage";
  6  | import { HomePage } from "../pages/HomePage";
  7  | import { LoginPage } from "../pages/LoginPage";
  8  | import { LogoutPage } from "../pages/LogoutPage";
  9  | import { ProductPage } from "../pages/ProductPage";
  10 | import { RegisterPage } from "../pages/RegisterPage";
  11 | import { SearchResultsPage } from "../pages/SearchResultsPage";
  12 | 
  13 | dotenv.config();
  14 | 
  15 | const APP_URL = process.env.WEB_APP_URL;
  16 | if (!APP_URL) {
  17 |   throw new Error("WEB_APP_URL must be configured to run OpenCart web tests.");
  18 | }
  19 | 
  20 | type PageFixtures = {
  21 |   adminPage: AdminPage;
  22 |   homePage: HomePage;
  23 |   loginPage: LoginPage;
  24 |   registerPage: RegisterPage;
  25 |   accountPage: AccountPage;
  26 |   logoutPage: LogoutPage;
  27 |   searchResultsPage: SearchResultsPage;
  28 |   productPage: ProductPage;
  29 |   cartPage: CartPage;
  30 | };
  31 | 
  32 | export const test = base.extend<PageFixtures>({
  33 |   adminPage: async ({ page }, use) => {
  34 |     await use(new AdminPage(page, APP_URL));
  35 |   },
  36 |   homePage: async ({ page }, use) => {
> 37 |     await page.goto(APP_URL);
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost/opencart/upload/
  38 |     await use(new HomePage(page));
  39 |   },
  40 |   loginPage: async ({ page }, use) => {
  41 |     await use(new LoginPage(page));
  42 |   },
  43 |   registerPage: async ({ page }, use) => {
  44 |     await use(new RegisterPage(page));
  45 |   },
  46 |   accountPage: async ({ page }, use) => {
  47 |     await use(new AccountPage(page));
  48 |   },
  49 |   logoutPage: async ({ page }, use) => {
  50 |     await use(new LogoutPage(page));
  51 |   },
  52 |   searchResultsPage: async ({ page }, use) => {
  53 |     await use(new SearchResultsPage(page));
  54 |   },
  55 |   productPage: async ({ page }, use) => {
  56 |     await use(new ProductPage(page));
  57 |   },
  58 |   cartPage: async ({ page }, use) => {
  59 |     await use(new CartPage(page));
  60 |   },
  61 | });
  62 | 
  63 | test.afterEach(async ({ page, context }) => {
  64 |   if (!page.isClosed()) {
  65 |     await page.close();
  66 |   }
  67 |   await context.close();
  68 | });
  69 | 
  70 | export { expect } from "@playwright/test";
  71 | 
```