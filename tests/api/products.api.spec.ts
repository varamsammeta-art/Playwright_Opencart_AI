import { resolve } from "node:path";
import Ajv from "ajv";
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { Routes } from "../../api/endpoints/routes";
import { RandomDataUtil } from "../../utils/dataGenerator";
import { DataProvider } from "../../utils/DataReader";

dotenv.config();

type ProductPayload = ReturnType<typeof RandomDataUtil.generateProductPayload>;
type Product = ProductPayload & { id: number };

function expectProduct(product: Product): void {
  expect(product.id, "Product ID should be a positive number").toBeGreaterThan(0);
  expect(product.title, "Product title should be a non-empty string").toBeTruthy();
  expect(typeof product.price, "Product price should be numeric").toBe("number");
  expect(product.category, "Product category should be a non-empty string").toBeTruthy();
  expect(product.image, "Product image should be a non-empty string").toBeTruthy();
}

test.describe("FakeStore Products API Tests", () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);

  test("GET - All products @master @sanity @api", async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);
    expect(response.status(), "Product list should return status 200").toBe(200);

    const products = (await response.json()) as Product[];
    expect(Array.isArray(products), "Products response should be an array").toBe(
      true,
    );
    expect(products.length, "At least one product should be returned").toBeGreaterThan(
      0,
    );
    products.forEach(expectProduct);
  });

  test("GET - Product by ID @master @sanity @api", async ({ request }) => {
    const path = Routes.GET_PRODUCT_BY_ID.replace("{id}", String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Product lookup should return status 200").toBe(200);

    const product = (await response.json()) as Product;
    expectProduct(product);
    expect(product.id, "Returned product ID should match the requested ID").toBe(
      PRODUCT_ID,
    );
  });

  test("GET - Products with limit @master @regression @api", async ({
    request,
  }) => {
    expect(Number.isInteger(LIMIT) && LIMIT > 0, "LIMIT must be a positive integer").toBe(
      true,
    );
    const path = Routes.GET_PRODUCTS_WITH_LIMIT.replace("{limit}", String(LIMIT));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Limited product search should return status 200").toBe(
      200,
    );

    const products = (await response.json()) as Product[];
    expect(Array.isArray(products), "Products response should be an array").toBe(
      true,
    );
    expect(products.length, "Product count should match LIMIT").toBe(LIMIT);
  });

  for (const order of ["asc", "desc"] as const) {
    test(`GET - Products sorted ${order} @master @regression @api`, async ({
      request,
    }) => {
      const path = Routes.GET_PRODUCTS_SORTED.replace("{order}", order);
      const response = await request.get(`${BASE_URL}${path}`);
      expect(response.status(), `Product ${order} sort should return status 200`).toBe(
        200,
      );

      const products = (await response.json()) as Product[];
      expect(products.length, "Sorted product response should not be empty").toBeGreaterThan(
        0,
      );
      const productIds = products.map((product) => product.id);
      const sortedIds = [...productIds].sort((first, second) =>
        order === "asc" ? first - second : second - first,
      );
      expect(productIds, `Product IDs should be sorted ${order}`).toEqual(sortedIds);
    });
  }

  test("GET - All product categories @master @sanity @api", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);
    expect(response.status(), "Category list should return status 200").toBe(200);

    const categories = (await response.json()) as string[];
    expect(Array.isArray(categories), "Categories response should be an array").toBe(
      true,
    );
    expect(categories.length, "At least one category should be returned").toBeGreaterThan(
      0,
    );
    categories.forEach((category) => expect(category.trim()).not.toBe(""));
  });

  test("GET - Products by category @master @regression @api", async ({
    request,
  }) => {
    const category = "electronics";
    const path = Routes.GET_PRODUCTS_BY_CATEGORY.replace(
      "{category}",
      encodeURIComponent(category),
    );
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Category product search should return status 200").toBe(
      200,
    );

    const products = (await response.json()) as Product[];
    expect(Array.isArray(products), "Products response should be an array").toBe(
      true,
    );
    expect(products.length, "Category should contain matching products").toBeGreaterThan(
      0,
    );
    products.forEach((product) => {
      expectProduct(product);
      expect(product.category).toBe(category);
    });
  });

  test("POST - Create product @master @regression @api", async ({ request }) => {
    const productData = RandomDataUtil.generateProductPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
      data: productData,
    });
    expect(response.status(), "Product creation should return status 201").toBe(201);

    const created = (await response.json()) as Product;
    expectProduct(created);
    expect(created).toMatchObject(productData);

    const deletePath = Routes.DELETE_PRODUCT.replace("{id}", String(created.id));
    const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);
    expect(deleteResponse.status(), "Created product cleanup should return status 200").toBe(
      200,
    );
  });

  test("PUT - Update product @master @regression @api", async ({ request }) => {
    const productData = RandomDataUtil.generateUpdatedProductPayload();
    const path = Routes.UPDATE_PRODUCT.replace("{id}", String(PRODUCT_ID));
    const response = await request.put(`${BASE_URL}${path}`, { data: productData });
    expect(response.status(), "Product update should return status 200").toBe(200);

    const updated = (await response.json()) as Product;
    expect(updated.id, "Updated product ID should match the requested ID").toBe(
      PRODUCT_ID,
    );
    expect(updated).toMatchObject(productData);
  });

  test("DELETE - Product by ID @master @regression @api", async ({ request }) => {
    const path = Routes.DELETE_PRODUCT.replace("{id}", String(PRODUCT_ID));
    const response = await request.delete(`${BASE_URL}${path}`);
    expect(response.status(), "Product deletion should return status 200").toBe(200);

    const responseText = await response.text();
    if (responseText) {
      const deleted = JSON.parse(responseText) as Product;
      expect(deleted.id, "Deleted product ID should match the requested ID").toBe(
        PRODUCT_ID,
      );
    }
  });

  test("GET - Product response schema @master @regression @api", async ({
    request,
  }) => {
    const path = Routes.GET_PRODUCT_BY_ID.replace("{id}", String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${path}`);
    expect(response.status(), "Product schema request should return status 200").toBe(
      200,
    );

    const product = await response.json();
    const schema = DataProvider.readJson(
      resolve(__dirname, "../../api/schemas/product_api_schema.json"),
    );
    const validate = new Ajv().compile(schema);
    const isValid = validate(product);
    const errors =
      validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join("; ") ??
      "No schema validation details are available";
    expect(isValid, `Product response schema validation failed: ${errors}`).toBe(
      true,
    );
  });

  test("Product CRUD workflow @master @regression @api @end-to-end", async ({
    request,
  }) => {
    const productData = RandomDataUtil.generateProductPayload();
    const createResponse = await request.post(
      `${BASE_URL}${Routes.CREATE_PRODUCT}`,
      { data: productData },
    );
    expect(createResponse.status(), "Product creation should return status 201").toBe(
      201,
    );
    const created = (await createResponse.json()) as Product;
    expectProduct(created);
    expect(created).toMatchObject(productData);

    const updateData = RandomDataUtil.generateUpdatedProductPayload();
    const updatePath = Routes.UPDATE_PRODUCT.replace("{id}", String(created.id));
    const updateResponse = await request.put(`${BASE_URL}${updatePath}`, {
      data: updateData,
    });
    expect(updateResponse.status(), "Product update should return status 200").toBe(
      200,
    );
    const updated = (await updateResponse.json()) as Product;
    expect(updated.id, "Updated product ID should match the created ID").toBe(
      created.id,
    );
    expect(updated).toMatchObject(updateData);

    const deletePath = Routes.DELETE_PRODUCT.replace("{id}", String(created.id));
    const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);
    expect(deleteResponse.status(), "Product deletion should return status 200").toBe(
      200,
    );
  });
});
