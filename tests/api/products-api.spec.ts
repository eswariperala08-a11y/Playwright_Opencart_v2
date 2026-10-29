import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = process.env.PRODUCT_ID || '1';
const LIMIT = process.env.LIMIT || '3';
const CATEGORY = 'electronics';

test.describe('FakeStore Products API Tests', () => {
    test('GET - All products @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'GET all products should return HTTP 200').toBe(200);
        const products = await response.json();
        expect(Array.isArray(products), 'Products response should be an array').toBeTruthy();
        expect(products.length, 'At least one product should be returned').toBeGreaterThan(0);
        expect(products[0]).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            price: expect.any(Number),
            category: expect.any(String),
            image: expect.any(String),
        }));
    });

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {
        const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', PRODUCT_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET product by ID should return HTTP 200').toBe(200);
        const product = await response.json();
        expect(product.id).toBe(Number(PRODUCT_ID));
        expect(product).toEqual(expect.objectContaining({
            title: expect.any(String),
            price: expect.any(Number),
            category: expect.any(String),
            image: expect.any(String),
        }));
    });

    test('GET - Products with limit @master @regression @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', LIMIT);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET products with limit should return HTTP 200').toBe(200);
        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products).toHaveLength(Number(LIMIT));
    });

    test('GET - Products sorted ascending @master @regression @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Ascending product sort should return HTTP 200').toBe(200);
        const products = await response.json() as { id: number }[];
        const ids = products.map((product) => product.id);
        expect(ids).toEqual([...ids].sort((first, second) => first - second));
    });

    test('GET - Products sorted descending @master @regression @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Descending product sort should return HTTP 200').toBe(200);
        const products = await response.json() as { id: number }[];
        const ids = products.map((product) => product.id);
        expect(ids).toEqual([...ids].sort((first, second) => second - first));
    });

    test('GET - All product categories @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'GET categories should return HTTP 200').toBe(200);
        const categories = await response.json();
        expect(Array.isArray(categories)).toBeTruthy();
        expect(categories.length, 'Category list should not be empty').toBeGreaterThan(0);
    });

    test('GET - Products by category @master @regression @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', encodeURIComponent(CATEGORY));
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET products by category should return HTTP 200').toBe(200);
        const products = await response.json() as { category: string }[];
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);
        expect(products.every((product) => product.category === CATEGORY)).toBeTruthy();
    });

    test('POST - Create product @master @regression @api', async ({ request }) => {
        const product = RandomDataUtil.generateProductPayload();
        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: product });

        expect(response.status(), 'Creating a product should return HTTP 201').toBe(201);
        const created = await response.json();
        expect(created.id, 'Created product should have an ID').toBeTruthy();
        expect(created).toEqual(expect.objectContaining(product));
    });

    test('PUT - Update product @master @regression @api', async ({ request }) => {
        const updatedProduct = RandomDataUtil.generateUpdatedProductPayload();
        const route = Routes.UPDATE_PRODUCT.replace('{id}', PRODUCT_ID);
        const response = await request.put(`${BASE_URL}${route}`, { data: updatedProduct });

        expect(response.status(), 'Updating a product should return HTTP 200').toBe(200);
        const updated = await response.json();
        expect(updated.id).toBe(Number(PRODUCT_ID));
        expect(updated).toEqual(expect.objectContaining(updatedProduct));
    });

    test('DELETE - Product @master @regression @api', async ({ request }) => {
        const route = Routes.DELETE_PRODUCT.replace('{id}', PRODUCT_ID);
        const response = await request.delete(`${BASE_URL}${route}`);

        expect(response.status(), 'Deleting a product should return HTTP 200').toBe(200);
        const deleted = await response.json();
        expect(deleted.id).toBe(Number(PRODUCT_ID));
    });
});