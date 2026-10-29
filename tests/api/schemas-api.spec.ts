import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = process.env.PRODUCT_ID || '1';
const USER_ID = process.env.USER_ID || '1';
const CART_ID = process.env.CART_ID || '1';
const ajv = new Ajv();

test.describe('FakeStore API Schema Tests', () => {
    test('GET - Product response matches schema @master @regression @api', async ({ request }) => {
        const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', PRODUCT_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Product schema endpoint should return HTTP 200').toBe(200);
        const product = await response.json();
        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const isValid = ajv.validate(schema, product);
        expect(isValid, `Product schema validation failed: ${ajv.errorsText()}`).toBeTruthy();
    });

    test('GET - User response matches schema @master @regression @api', async ({ request }) => {
        const route = Routes.GET_USER_BY_ID.replace('{id}', USER_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'User schema endpoint should return HTTP 200').toBe(200);
        const user = await response.json();
        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const isValid = ajv.validate(schema, user);
        expect(isValid, `User schema validation failed: ${ajv.errorsText()}`).toBeTruthy();
    });

    test('GET - Cart response matches schema @master @regression @api', async ({ request }) => {
        const route = Routes.GET_CART_BY_ID.replace('{id}', CART_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Cart schema endpoint should return HTTP 200').toBe(200);
        const cart = await response.json();
        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const isValid = ajv.validate(schema, cart);
        expect(isValid, `Cart schema validation failed: ${ajv.errorsText()}`).toBeTruthy();
    });
});