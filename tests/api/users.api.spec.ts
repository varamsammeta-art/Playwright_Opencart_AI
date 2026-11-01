import { resolve } from "node:path";
import Ajv from "ajv";
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";
import { DataProvider } from "../../utils/DataReader";

dotenv.config();

type UserPayload = ReturnType<typeof RandomDataUtil.generateUserPayload>;
type User = UserPayload & { id: number; __v?: number };

function expectUser(user: User): void {
  expect(user.id, "User ID should be a positive number").toBeGreaterThan(0);
  expect(user.email, "User email should be a non-empty string").toBeTruthy();
  expect(user.username, "Username should be a non-empty string").toBeTruthy();
  expect(user.name.firstname, "First name should be a non-empty string").toBeTruthy();
  expect(user.name.lastname, "Last name should be a non-empty string").toBeTruthy();
}

test.describe("FakeStore Users API Tests", () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USER_ID = Number(process.env.USER_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);

  test("GET - All users @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);
    expect(response.status(), "User list should return status 200").toBe(200);

    const users = (await response.json()) as User[];
    expect(Array.isArray(users), "Users response should be an array").toBe(true);
    expect(users.length, "At least one user should be returned").toBeGreaterThan(0);
    users.forEach(expectUser);
  });

  test("GET - User by ID @master @sanity @api", async ({ request }) => {
    const path = Routes.GET_USER_BY_ID.replace("{id}", String(USER_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "User lookup should return status 200").toBe(200);

    const user = (await response.json()) as User;
    expectUser(user);
    expect(user.id, "Returned user ID should match the requested ID").toBe(USER_ID);
  });

  test("GET - Users with limit @master @regression @api", async ({ request }) => {
    expect(Number.isInteger(LIMIT) && LIMIT > 0, "LIMIT must be a positive integer").toBe(
      true,
    );
    const path = Routes.GET_USERS_WITH_LIMIT.replace("{limit}", String(LIMIT));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Limited user search should return status 200").toBe(
      200,
    );

    const users = (await response.json()) as User[];
    expect(Array.isArray(users), "Users response should be an array").toBe(true);
    expect(users.length, "User count should match LIMIT").toBe(LIMIT);
  });

  for (const order of ["asc", "desc"] as const) {
    test(`GET - Users sorted ${order} @master @regression @api`, async ({
      request,
    }) => {
      const path = Routes.GET_USERS_SORTED.replace("{order}", order);
      const response = await request.get(`${BASE_URL}${path}`);
      expect(response.status(), `User ${order} sort should return status 200`).toBe(
        200,
      );

      const users = (await response.json()) as User[];
      expect(users.length, "Sorted user response should not be empty").toBeGreaterThan(
        0,
      );
      const userIds = users.map((user) => user.id);
      const sortedIds = [...userIds].sort((first, second) =>
        order === "asc" ? first - second : second - first,
      );
      expect(userIds, `User IDs should be sorted ${order}`).toEqual(sortedIds);
    });
  }

  test("POST - Create user @master @regression @api", async ({ request }) => {
    const userData = RandomDataUtil.generateUserPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
      data: userData,
    });
    expect(response.status(), "User creation should return status 201").toBe(201);

    const created = (await response.json()) as { id: number };
    expect(created.id, "Created user should include a positive ID").toBeGreaterThan(
      0,
    );

    const deletePath = Routes.DELETE_USER.replace("{id}", String(created.id));
    const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);
    expect(deleteResponse.status(), "Created user cleanup should return status 200").toBe(
      200,
    );
  });

  test("PUT - Update user @master @regression @api", async ({ request }) => {
    const userData = RandomDataUtil.generateUserUpdatePayload();
    const path = Routes.UPDATE_USER.replace("{id}", String(USER_ID));
    const response = await request.put(`${BASE_URL}${path}`, { data: userData });
    expect(response.status(), "User update should return status 200").toBe(200);

    const updated = (await response.json()) as UserPayload;
    expect(updated).toMatchObject(userData);
  });

  test("DELETE - User by ID @master @regression @api", async ({ request }) => {
    const path = Routes.DELETE_USER.replace("{id}", String(USER_ID));
    const response = await request.delete(`${BASE_URL}${path}`);
    expect(response.status(), "User deletion should return status 200").toBe(200);
  });

  test("GET - User response schema @master @regression @api", async ({
    request,
  }) => {
    const path = Routes.GET_USER_BY_ID.replace("{id}", String(USER_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "User schema request should return status 200").toBe(
      200,
    );

    const user = await response.json();
    const schema = DataProvider.readJson(
      resolve(__dirname, "../../api/schemas/user_api_schema.json"),
    );
    const validate = new Ajv().compile(schema);
    const isValid = validate(user);
    const errors =
      validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join("; ") ??
      "No schema validation details are available";
    expect(isValid, `User response schema validation failed: ${errors}`).toBe(true);
  });

  test("User CRUD workflow @master @regression @api @end-to-end", async ({
    request,
  }) => {
    const userData = RandomDataUtil.generateUserPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
      data: userData,
    });
    expect(createResponse.status(), "User creation should return status 201").toBe(
      201,
    );
    const created = (await createResponse.json()) as { id: number };
    expect(created.id, "Created user should include a positive ID").toBeGreaterThan(
      0,
    );

    const updateData = RandomDataUtil.generateUserUpdatePayload();
    const updatePath = Routes.UPDATE_USER.replace("{id}", String(created.id));
    const updateResponse = await request.put(`${BASE_URL}${updatePath}`, {
      data: updateData,
    });
    expect(updateResponse.status(), "User update should return status 200").toBe(
      200,
    );
    const updated = (await updateResponse.json()) as UserPayload;
    expect(updated).toMatchObject(updateData);

    const deletePath = Routes.DELETE_USER.replace("{id}", String(created.id));
    const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);
    expect(deleteResponse.status(), "User deletion should return status 200").toBe(
      200,
    );
  });
});
