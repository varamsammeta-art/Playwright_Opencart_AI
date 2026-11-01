import { resolve } from "node:path";
import Ajv from "ajv";
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";
import { DataProvider } from "../../utils/DataReader";

dotenv.config();

type CartPayload = ReturnType<typeof RandomDataUtil.generateCartPayload>;
type Cart = CartPayload & { id: number; __v?: number };

function expectCart(cart: Cart): void {
  expect(cart.id, "Cart ID should be a positive number").toBeGreaterThan(0);
  expect(cart.userId, "Cart user ID should be a positive number").toBeGreaterThan(
    0,
  );
  expect(cart.products, "Cart products should be an array").toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        productId: expect.any(Number),
        quantity: expect.any(Number),
      }),
    ]),
  );
}

test.describe("FakeStore Carts API Tests", () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const CART_ID = Number(process.env.CART_ID ?? 1);
  const USER_ID = Number(process.env.USER_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);
  const START_DATE = process.env.START_DATE ?? "";
  const END_DATE = process.env.END_DATE ?? "";

  test("GET - All carts @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);
    expect(response.status(), "Cart list should return status 200").toBe(200);

    const carts = (await response.json()) as Cart[];
    expect(Array.isArray(carts), "Carts response should be an array").toBe(true);
    expect(carts.length, "At least one cart should be returned").toBeGreaterThan(0);
    carts.forEach(expectCart);
  });

  test("GET - Cart by ID @master @sanity @api", async ({ request }) => {
    const path = Routes.GET_CART_BY_ID.replace("{id}", String(CART_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Cart lookup should return status 200").toBe(200);

    const cart = (await response.json()) as Cart;
    expectCart(cart);
    expect(cart.id, "Returned cart ID should match the requested ID").toBe(CART_ID);
  });

  test("GET - Carts by date range @master @regression @api", async ({
    request,
  }) => {
    expect(START_DATE, "START_DATE must be configured").not.toBe("");
    expect(END_DATE, "END_DATE must be configured").not.toBe("");
    const startTime = Date.parse(START_DATE);
    const endTime = Date.parse(END_DATE);
    expect(Number.isNaN(startTime) || Number.isNaN(endTime), "Cart date range must be valid").toBe(
      false,
    );
    expect(startTime <= endTime, "START_DATE must not be after END_DATE").toBe(true);

    const path = Routes.GET_CARTS_BY_DATE_RANGE.replace(
      "{startdate}",
      encodeURIComponent(START_DATE),
    ).replace("{enddate}", encodeURIComponent(END_DATE));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Cart date filter should return status 200").toBe(200);

    const carts = (await response.json()) as Cart[];
    expect(Array.isArray(carts), "Carts response should be an array").toBe(true);
    expect(carts.length, "Date range should return at least one cart").toBeGreaterThan(
      0,
    );
    carts.forEach((cart) => {
      expectCart(cart);
      const cartTime = Date.parse(cart.date);
      expect(Number.isNaN(cartTime), "Cart date should be parseable").toBe(false);
      expect(cartTime, "Cart date should be on or after START_DATE").toBeGreaterThanOrEqual(
        startTime,
      );
      expect(cartTime, "Cart date should be on or before END_DATE").toBeLessThanOrEqual(
        endTime,
      );
    });
  });

  test("GET - Carts by user @master @regression @api", async ({ request }) => {
    const path = Routes.GET_USER_CART.replace("{userId}", String(USER_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "User cart lookup should return status 200").toBe(200);

    const carts = (await response.json()) as Cart[];
    expect(Array.isArray(carts), "Carts response should be an array").toBe(true);
    expect(carts.length, "User should have at least one cart").toBeGreaterThan(0);
    carts.forEach((cart) => {
      expectCart(cart);
      expect(cart.userId, "Each cart should belong to the requested user").toBe(
        USER_ID,
      );
    });
  });

  test("GET - Carts with limit @master @regression @api", async ({ request }) => {
    expect(Number.isInteger(LIMIT) && LIMIT > 0, "LIMIT must be a positive integer").toBe(
      true,
    );
    const path = Routes.GET_CARTS_WITH_LIMIT.replace("{limit}", String(LIMIT));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Limited cart search should return status 200").toBe(
      200,
    );

    const carts = (await response.json()) as Cart[];
    expect(Array.isArray(carts), "Carts response should be an array").toBe(true);
    expect(carts.length, "Cart count should match LIMIT").toBe(LIMIT);
  });

  for (const order of ["asc", "desc"] as const) {
    test(`GET - Carts sorted ${order} @master @regression @api`, async ({
      request,
    }) => {
      const path = Routes.GET_CARTS_SORTED.replace("{order}", order);
      const response = await request.get(`${BASE_URL}${path}`);
      expect(response.status(), `Cart ${order} sort should return status 200`).toBe(
        200,
      );

      const carts = (await response.json()) as Cart[];
      expect(carts.length, "Sorted cart response should not be empty").toBeGreaterThan(
        0,
      );
      const cartIds = carts.map((cart) => cart.id);
      const sortedIds = [...cartIds].sort((first, second) =>
        order === "asc" ? first - second : second - first,
      );
      expect(cartIds, `Cart IDs should be sorted ${order}`).toEqual(sortedIds);
    });
  }

  test("POST - Create cart @master @regression @api", async ({ request }) => {
    const cartData = RandomDataUtil.generateCartPayload(USER_ID);
    const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
      data: cartData,
    });
    expect(response.status(), "Cart creation should return status 201").toBe(201);

    const created = (await response.json()) as Cart;
    expectCart(created);
    expect(created).toMatchObject(cartData);

    const deletePath = Routes.DELETE_CART.replace("{id}", String(created.id));
    const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);
    expect(deleteResponse.status(), "Created cart cleanup should return status 200").toBe(
      200,
    );
  });

  test("PUT - Update cart @master @regression @api", async ({ request }) => {
    const cartData = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
    const path = Routes.UPDATE_CART.replace("{id}", String(CART_ID));
    const response = await request.put(`${BASE_URL}${path}`, { data: cartData });
    expect(response.status(), "Cart update should return status 200").toBe(200);

    const updated = (await response.json()) as Cart;
    expect(updated.id, "Updated cart ID should match the requested ID").toBe(CART_ID);
    expect(updated).toMatchObject(cartData);
  });

  test("DELETE - Cart by ID @master @regression @api", async ({ request }) => {
    const path = Routes.DELETE_CART.replace("{id}", String(CART_ID));
    const response = await request.delete(`${BASE_URL}${path}`);
    expect(response.status(), "Cart deletion should return status 200").toBe(200);

    const responseText = await response.text();
    if (responseText) {
      const deleted = JSON.parse(responseText) as Cart | null;
      if (deleted) {
        expect(deleted.id, "Deleted cart ID should match the requested ID").toBe(
          CART_ID,
        );
      }
    }
  });

  test("GET - Cart response schema @master @regression @api", async ({
    request,
  }) => {
    const path = Routes.GET_CART_BY_ID.replace("{id}", String(CART_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Cart schema request should return status 200").toBe(
      200,
    );

    const cart = await response.json();
    const schema = DataProvider.readJson(
      resolve(__dirname, "../../api/schemas/cart_api_schema.json"),
    );
    const validate = new Ajv().compile(schema);
    const isValid = validate(cart);
    const errors =
      validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join("; ") ??
      "No schema validation details are available";
    expect(isValid, `Cart response schema validation failed: ${errors}`).toBe(true);
  });

  test("Cart CRUD workflow @master @regression @api @end-to-end", async ({
    request,
  }) => {
    const cartData = RandomDataUtil.generateCartPayload(USER_ID);
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
      data: cartData,
    });
    expect(createResponse.status(), "Cart creation should return status 201").toBe(
      201,
    );
    const created = (await createResponse.json()) as Cart;
    expectCart(created);
    expect(created).toMatchObject(cartData);

    const updateData = {
      ...cartData,
      products: cartData.products.map((product) => ({
        ...product,
        quantity: product.quantity + 1,
      })),
    };
    const updatePath = Routes.UPDATE_CART.replace("{id}", String(created.id));
    const updateResponse = await request.put(`${BASE_URL}${updatePath}`, {
      data: updateData,
    });
    expect(updateResponse.status(), "Cart update should return status 200").toBe(
      200,
    );
    const updated = (await updateResponse.json()) as Cart;
    expect(updated.id, "Updated cart ID should match the created ID").toBe(created.id);
    expect(updated.products).toEqual(updateData.products);
    expect(updated.products[0].quantity).toBe(cartData.products[0].quantity + 1);

    const deletePath = Routes.DELETE_CART.replace("{id}", String(created.id));
    const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);
    expect(deleteResponse.status(), "Cart deletion should return status 200").toBe(
      200,
    );
  });
});
