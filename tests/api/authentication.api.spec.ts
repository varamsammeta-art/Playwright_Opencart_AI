import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";

const configuredEnvironment = dotenv.config().parsed;

test.describe("FakeStore Authentication API Tests", () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const username =
    process.env.API_USERNAME ??
    configuredEnvironment?.USERNAME ??
    process.env.USERNAME;
  const password =
    process.env.API_PASSWORD ??
    configuredEnvironment?.PASSWORD ??
    process.env.PASSWORD;

  test("POST - Successful login @master @sanity @api", async ({ request }) => {
    expect(username, "USERNAME must be configured for API login tests").toBeTruthy();
    expect(password, "PASSWORD must be configured for API login tests").toBeTruthy();

    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: { username, password },
    });
    expect(response.status(), "Valid credentials should return status 201").toBe(
      201,
    );

    const responseBody = await response.json();
    expect(typeof responseBody.token, "The response should contain a token").toBe(
      "string",
    );
    expect(responseBody.token.trim(), "The token should not be empty").not.toBe(
      "",
    );
  });

  test("POST - Invalid login @master @regression @api", async ({ request }) => {
    const invalidCredentials = RandomDataUtil.generateInvalidLoginPayload();
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: invalidCredentials,
    });

    expect(response.status(), "Invalid credentials should return status 401").toBe(
      401,
    );
    expect(await response.text()).toBe("username or password is incorrect");
  });
});
