# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\valid-login.spec.ts >> Valid customer login test @master @sanity @regression @web
- Location: tests\web\valid-login.spec.ts:20:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - navigation [ref=f2e2]:
    - generic [ref=f2e3]:
      - button "$ Currency " [ref=f2e7] [cursor=pointer]:
        - strong [ref=f2e8]: $
        - text: Currency
        - generic [ref=f2e9]: 
      - list [ref=f2e11]:
        - listitem [ref=f2e12]:
          - link "" [ref=f2e13] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/contact
          - text: "123456789"
        - listitem [ref=f2e15]:
          - link " My Account" [ref=f2e16] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/account
            - generic [ref=f2e17]: 
            - text: My Account
        - listitem [ref=f2e19]:
          - link " Wish List (0)" [ref=f2e20] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/wishlist
            - generic [ref=f2e21]: 
            - text: Wish List (0)
        - listitem [ref=f2e22]:
          - link " Shopping Cart" [ref=f2e23] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=checkout/cart
            - generic [ref=f2e24]: 
            - text: Shopping Cart
        - listitem [ref=f2e25]:
          - link " Checkout" [ref=f2e26] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=checkout/checkout
            - generic [ref=f2e27]: 
            - text: Checkout
  - banner [ref=f2e28]:
    - generic [ref=f2e30]:
      - link [ref=f2e33] [cursor=pointer]:
        - /url: https://naveenautomationlabs.com/opencart/index.php?route=common/home
        - img "naveenopencart" [ref=f2e34]
      - generic [ref=f2e36]:
        - textbox "Search" [ref=f2e37]
        - button "" [ref=f2e39] [cursor=pointer]
      - button " 0 item(s) - $0.00" [ref=f2e43] [cursor=pointer]:
        - generic [ref=f2e44]: 
        - text: 0 item(s) - $0.00
  - navigation [ref=f2e46]:
    - generic: 
    - list [ref=f2e48]:
      - listitem [ref=f2e49]:
        - link "Desktops" [ref=f2e50] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=20
      - listitem [ref=f2e51]:
        - link "Laptops & Notebooks" [ref=f2e52] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=18
      - listitem [ref=f2e53]:
        - link "Components" [ref=f2e54] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=25
      - listitem [ref=f2e55]:
        - link "Tablets" [ref=f2e56] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=57
      - listitem [ref=f2e57]:
        - link "Software" [ref=f2e58] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=17
      - listitem [ref=f2e59]:
        - link "Phones & PDAs" [ref=f2e60] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=24
      - listitem [ref=f2e61]:
        - link "Cameras" [ref=f2e62] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=33
      - listitem [ref=f2e63]:
        - link "MP3 Players" [ref=f2e64] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/category&path=34
  - generic [ref=f2e65]:
    - list [ref=f2e66]:
      - listitem [ref=f2e67]:
        - link "" [ref=f2e68] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=common/home
      - listitem [ref=f2e70]:
        - link "Account" [ref=f2e71] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/account
      - listitem [ref=f2e72]:
        - link "Login" [ref=f2e73] [cursor=pointer]:
          - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/login
    - generic [ref=f2e74]:
      - generic [ref=f2e75]: 
      - text: "Warning: No match for E-Mail Address and/or Password."
    - generic [ref=f2e76]:
      - generic [ref=f2e78]:
        - generic [ref=f2e80]:
          - heading "New Customer" [level=2] [ref=f2e81]
          - paragraph [ref=f2e82]:
            - strong [ref=f2e83]: Register Account
          - paragraph [ref=f2e84]: By creating an account you will be able to shop faster, be up to date on an order's status, and keep track of the orders you have previously made.
          - link "Continue" [ref=f2e85] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/register
        - generic [ref=f2e87]:
          - heading "Returning Customer" [level=2] [ref=f2e88]
          - paragraph [ref=f2e89]:
            - strong [ref=f2e90]: I am a returning customer
          - generic [ref=f2e91]:
            - generic [ref=f2e92]:
              - generic [ref=f2e93]: E-Mail Address
              - textbox "E-Mail Address" [ref=f2e94]: playwright.login.29cbbac759624ff183eccac3347d6b72@example.com
            - generic [ref=f2e95]:
              - generic [ref=f2e96]: Password
              - textbox "Password" [ref=f2e97]: OpenCartTest!2026
              - link "Forgotten Password" [ref=f2e98] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/forgotten
            - button "Login" [ref=f2e99] [cursor=pointer]
      - complementary [ref=f2e100]:
        - generic [ref=f2e101]:
          - link "Login" [ref=f2e102] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/login
          - link "Register" [ref=f2e103] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/register
          - link "Forgotten Password" [ref=f2e104] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/forgotten
          - link "My Account" [ref=f2e105] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/account
          - link "Address Book" [ref=f2e106] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/address
          - link "Wish List" [ref=f2e107] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/wishlist
          - link "Order History" [ref=f2e108] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/order
          - link "Downloads" [ref=f2e109] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/download
          - link "Recurring payments" [ref=f2e110] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/recurring
          - link "Reward Points" [ref=f2e111] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/reward
          - link "Returns" [ref=f2e112] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/return
          - link "Transactions" [ref=f2e113] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/transaction
          - link "Newsletter" [ref=f2e114] [cursor=pointer]:
            - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/newsletter
  - contentinfo [ref=f2e115]:
    - generic [ref=f2e116]:
      - generic [ref=f2e117]:
        - generic [ref=f2e118]:
          - heading "Information" [level=5] [ref=f2e119]
          - list [ref=f2e120]:
            - listitem [ref=f2e121]:
              - link "About Us" [ref=f2e122] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/information&information_id=4
            - listitem [ref=f2e123]:
              - link "Delivery Information" [ref=f2e124] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/information&information_id=6
            - listitem [ref=f2e125]:
              - link "Privacy Policy" [ref=f2e126] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/information&information_id=3
            - listitem [ref=f2e127]:
              - link "Terms & Conditions" [ref=f2e128] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/information&information_id=5
        - generic [ref=f2e129]:
          - heading "Customer Service" [level=5] [ref=f2e130]
          - list [ref=f2e131]:
            - listitem [ref=f2e132]:
              - link "Contact Us" [ref=f2e133] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/contact
            - listitem [ref=f2e134]:
              - link "Returns" [ref=f2e135] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/return/add
            - listitem [ref=f2e136]:
              - link "Site Map" [ref=f2e137] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=information/sitemap
        - generic [ref=f2e138]:
          - heading "Extras" [level=5] [ref=f2e139]
          - list [ref=f2e140]:
            - listitem [ref=f2e141]:
              - link "Brands" [ref=f2e142] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/manufacturer
            - listitem [ref=f2e143]:
              - link "Gift Certificates" [ref=f2e144] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/voucher
            - listitem [ref=f2e145]:
              - link "Affiliate" [ref=f2e146] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=affiliate/login
            - listitem [ref=f2e147]:
              - link "Specials" [ref=f2e148] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=product/special
        - generic [ref=f2e149]:
          - heading "My Account" [level=5] [ref=f2e150]
          - list [ref=f2e151]:
            - listitem [ref=f2e152]:
              - link "My Account" [ref=f2e153] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/account
            - listitem [ref=f2e154]:
              - link "Order History" [ref=f2e155] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/order
            - listitem [ref=f2e156]:
              - link "Wish List" [ref=f2e157] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/wishlist
            - listitem [ref=f2e158]:
              - link "Newsletter" [ref=f2e159] [cursor=pointer]:
                - /url: https://naveenautomationlabs.com/opencart/index.php?route=account/newsletter
      - separator [ref=f2e160]
      - paragraph [ref=f2e161]:
        - text: Powered By
        - link "OpenCart" [ref=f2e162] [cursor=pointer]:
          - /url: http://www.opencart.com
        - text: naveenopencart © 2026
```

# Test source

```ts
  1  | import { resolve } from "node:path";
  2  | import { test, expect } from "../../fixtures/pageFixtures";
  3  | import { DataProvider } from "../../utils/DataReader";
  4  | 
  5  | type LoginData = {
  6  |   email: string;
  7  |   password: string;
  8  |   expected: "success" | "failure";
  9  | };
  10 | 
  11 | const loginDataRows = DataProvider.readJson(
  12 |   resolve(__dirname, "../../testdata/opencart_logindata.json"),
  13 | ) as LoginData[];
  14 | const validLoginData = loginDataRows.find((row) => row.expected === "success");
  15 | 
  16 | if (!validLoginData) {
  17 |   throw new Error("Login test data must contain a row with expected: success.");
  18 | }
  19 | 
  20 | test("Valid customer login test @master @sanity @regression @web", async ({
  21 |   homePage,
  22 |   loginPage,
  23 |   accountPage,
  24 | }) => {
  25 |   await test.step("1) Navigate to My Account > Login", async () => {
  26 |     await homePage.clickMyAccount();
  27 |     await homePage.clickLogin();
  28 |     expect(await loginPage.isLoginPageExists()).toBeTruthy();
  29 |   });
  30 | 
  31 |   await test.step("2) Log in using configured customer credentials", async () => {
  32 |     await loginPage.login(validLoginData.email, validLoginData.password);
> 33 |     expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
     |                                                       ^ Error: expect(received).toBeTruthy()
  34 |     expect(await accountPage.isAuthenticatedNavigationVisible()).toBeTruthy();
  35 |   });
  36 | 
  37 |   console.log("✅ Customer login completed successfully.");
  38 | });
  39 | 
```