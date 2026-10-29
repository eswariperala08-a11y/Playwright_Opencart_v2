import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = process.env.USER_ID || '1';
const LIMIT = process.env.LIMIT || '3';

test.describe('FakeStore Users API Tests', () => {
    test('GET - All users @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'GET all users should return HTTP 200').toBe(200);
        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length, 'At least one user should be returned').toBeGreaterThan(0);
    });

    test('GET - User by ID @master @sanity @api', async ({ request }) => {
        const route = Routes.GET_USER_BY_ID.replace('{id}', USER_ID);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET user by ID should return HTTP 200').toBe(200);
        const user = await response.json();
        expect(user.id).toBe(Number(USER_ID));
        expect(user.email).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.address).toEqual(expect.objectContaining({ city: expect.any(String) }));
    });

    test('GET - Users with limit @master @regression @api', async ({ request }) => {
        const route = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', LIMIT);
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'GET users with limit should return HTTP 200').toBe(200);
        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users).toHaveLength(Number(LIMIT));
    });

    test('GET - Users sorted ascending @master @regression @api', async ({ request }) => {
        const route = Routes.GET_USERS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Ascending user sort should return HTTP 200').toBe(200);
        const users = await response.json() as { id: number }[];
        const ids = users.map((user) => user.id);
        expect(ids).toEqual([...ids].sort((first, second) => first - second));
    });

    test('GET - Users sorted descending @master @regression @api', async ({ request }) => {
        const route = Routes.GET_USERS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${route}`);

        expect(response.status(), 'Descending user sort should return HTTP 200').toBe(200);
        const users = await response.json() as { id: number }[];
        const ids = users.map((user) => user.id);
        expect(ids).toEqual([...ids].sort((first, second) => second - first));
    });

    test('POST - Create user @master @regression @api', async ({ request }) => {
        const user = RandomDataUtil.generateUserPayload();
        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: user });

        expect(response.status(), 'Creating a user should return HTTP 201').toBe(201);
        const created = await response.json();
        expect(created.id, 'Created user should have an ID').toBeTruthy();
    });

    test('PUT - Update user @master @regression @api', async ({ request }) => {
        const updatedUser = RandomDataUtil.generateUserUpdatePayload();
        const route = Routes.UPDATE_USER.replace('{id}', USER_ID);
        const response = await request.put(`${BASE_URL}${route}`, { data: updatedUser });

        expect(response.status(), 'Updating a user should return HTTP 200').toBe(200);
        const updated = await response.json();
        expect(updated).toEqual(expect.objectContaining(updatedUser));
    });

    test('DELETE - User @master @regression @api', async ({ request }) => {
        const route = Routes.DELETE_USER.replace('{id}', USER_ID);
        const response = await request.delete(`${BASE_URL}${route}`);

        expect(response.status(), 'Deleting a user should return HTTP 200').toBe(200);
        const deleted = await response.json();
        expect(deleted.id).toBe(Number(USER_ID));
    });
});