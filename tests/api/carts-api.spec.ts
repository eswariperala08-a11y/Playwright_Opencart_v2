import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const CART_ID = process.env.CART_ID || '1';
const USER_ID = process.env.USER_ID || '1';
const LIMIT = process.env.LIMIT || '3';
const START_DATE = process.env.START_DATE || '';
const END_DATE = process.env.END_DATE || '';

test.describe('FakeStore Carts API Tests', () => {
    test('GET - All carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'GET all carts should return HTTP 200').toBe(200);
        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length, 'At least one cart should be returned').toBeGreaterThan(0);
    });

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const route = Routes.GET_CART_BY_ID.replace('{id}', CART_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET cart by ID should return HTTP 200').toBe(200);
        const cart = await response.json();
        expect(cart.id).toBe(Number(CART_ID));
        expect(cart.userId).toEqual(expect.any(Number));
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    test('GET - Carts within date range @master @regression @api', async ({ request }) => {
        const route = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', encodeURIComponent(START_DATE))
            .replace('{enddate}', encodeURIComponent(END_DATE));
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET carts by date range should return HTTP 200').toBe(200);
        const carts = await response.json() as { date: string }[];
        expect(Array.isArray(carts)).toBeTruthy();
        for (const cart of carts) {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate).toBeGreaterThanOrEqual(new Date(START_DATE).getTime());
            expect(cartDate).toBeLessThanOrEqual(new Date(`${END_DATE}T23:59:59.999Z`).getTime());
        }
    });

    test('GET - Carts by user @master @regression @api', async ({ request }) => {
        const route = Routes.GET_USER_CART.replace('{userId}', USER_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET carts for a user should return HTTP 200').toBe(200);
        const carts = await response.json() as { userId: number }[];
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length, 'Configured user should have carts').toBeGreaterThan(0);
        expect(carts.every((cart) => cart.userId === Number(USER_ID))).toBeTruthy();
    });

    test('GET - Carts with limit @master @regression @api', async ({ request }) => {
        const route = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', LIMIT);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET carts with limit should return HTTP 200').toBe(200);
        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts).toHaveLength(Number(LIMIT));
    });

    test('GET - Carts sorted ascending @master @regression @api', async ({ request }) => {
        const route = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Ascending cart sort should return HTTP 200').toBe(200);
        const carts = await response.json() as { id: number }[];
        const ids = carts.map((cart) => cart.id);
        expect(ids).toEqual([...ids].sort((first, second) => first - second));
    });

    test('GET - Carts sorted descending @master @regression @api', async ({ request }) => {
        const route = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Descending cart sort should return HTTP 200').toBe(200);
        const carts = await response.json() as { id: number }[];
        const ids = carts.map((cart) => cart.id);
        expect(ids).toEqual([...ids].sort((first, second) => second - first));
    });

    test('POST - Create cart @master @regression @api', async ({ request }) => {
        const cart = RandomDataUtil.generateCartPayload(Number(USER_ID));
        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: cart });

        expect(response.status(), 'Creating a cart should return HTTP 201').toBe(201);
        const created = await response.json();
        expect(created.id, 'Created cart should have an ID').toBeTruthy();
        expect(created.userId).toBe(cart.userId);
        expect(created.products).toEqual(cart.products);
    });

    test('PUT - Update cart @master @regression @api', async ({ request }) => {
        const updatedCart = RandomDataUtil.generateUpdatedCartPayload(Number(USER_ID));
        const route = Routes.UPDATE_CART.replace('{id}', CART_ID);
        const response = await request.put(`${BASE_URL}${route}`, { data: updatedCart });

        expect(response.status(), 'Updating a cart should return HTTP 200').toBe(200);
        const updated = await response.json();
        expect(updated.id).toBe(Number(CART_ID));
        expect(updated.userId).toBe(updatedCart.userId);
        expect(updated.products).toEqual(updatedCart.products);
    });

    test('DELETE - Cart @master @regression @api', async ({ request }) => {
        const route = Routes.DELETE_CART.replace('{id}', CART_ID);
        const response = await request.delete(`${BASE_URL}${route}`);

        expect(response.status(), 'Deleting a cart should return HTTP 200').toBe(200);
        const deleted = await response.json();
        expect(deleted.id).toBe(Number(CART_ID));
    });
});