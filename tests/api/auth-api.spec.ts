import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

test.describe('FakeStore Authentication API Tests', () => {
    test('POST - Login with valid credentials @master @sanity @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: {
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
            },
        });

        expect(response.status(), 'Valid login should return HTTP 201').toBe(201);
        const body = await response.json();
        expect(body).toHaveProperty('token');
        expect(typeof body.token).toBe('string');
        expect(body.token.length, 'Authentication token should not be empty').toBeGreaterThan(0);
    });

    test('POST - Login with invalid credentials @master @regression @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: RandomDataUtil.generateInvalidLoginPayload(),
        });

        expect(response.status(), 'Invalid login should return HTTP 401').toBe(401);
        const errorMessage = await response.text();
        expect(errorMessage).toBe('username or password is incorrect');
    });
});